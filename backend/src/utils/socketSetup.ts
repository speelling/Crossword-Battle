import { MyContext } from "..";
import { ClientToServerEvents, ExtendedIncomingMessage, ServerToClientEvents } from "../types/SocketTypes";
import { Server, Socket } from "socket.io";
import { Server as HttpServer } from 'http';
import { checkCrosswordCompletion } from "./checkComplete";

export function setupSocketIO(
  httpServer: HttpServer,
  sessionMiddleware: any,
  context: MyContext
) {
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
    },
  });

  io.engine.use(sessionMiddleware);

  context.redis.config('SET', 'notify-keyspace-events', 'Ex');

  const subscriber = context.redis.duplicate();
  subscriber.psubscribe('__keyevent@*__:expired');

  subscriber.on('pmessage', (pattern, channel, expiredKey) => {
    if (expiredKey.startsWith('game:')) {
      const gameId = expiredKey.split(':')[1];
      io.to(`game:${gameId}`).emit('gameExpired', {
        gameId,
        message: 'The game has expired due to inactivity.',
      });
    }
  });

  io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {

    const req = socket.request as ExtendedIncomingMessage;
    const session = req.session;
    const userId = session.userId;

    if (!userId) {
      socket.disconnect(true);
      return;
    }


    socket.join(`user:${userId}`);

    socket.on('joinGame', async ({ gameId }) => {
      try {
        const gameKey = `game:${gameId}`;
        const timerKey = `timer:${gameId}`;  
        const gameStateJson = await context.redis.get(gameKey);
        if (!gameStateJson) {
          socket.emit('error', { message: 'Game not found or has expired due to inactivity.' });
          return;
        }

        const gameState = JSON.parse(gameStateJson);

        if (!gameState.players.includes(userId)) {
          if (gameState.players.length >= 2) {
            socket.emit('error', { message: 'Game is full' });
            return;
          }

          gameState.players.push(userId);
          await context.redis.set(gameKey, JSON.stringify(gameState),'KEEPTTL');
        }

        socket.join(`game:${gameId}`);

        if (!gameState.playerStates[userId]) {
          const playerPuzzle = gameState.puzzle.map((cell: any) => ({
            isBlack: cell.isBlack,
            position: cell.position,
            clues: cell.clues,
            value: '', 
          }));

          gameState.playerStates[userId] = { puzzle: playerPuzzle };

          await context.redis.set(gameKey, JSON.stringify(gameState),'KEEPTTL');
        }

        const clientGameState = {
          gameId: gameState.gameId,
          clues: gameState.clues,
          dim: gameState.dim,
          status: gameState.status,
          puzzle: gameState.playerStates[userId].puzzle,
        };

        socket.emit('gameState', clientGameState);

        if (gameState.players.length === 2 && gameState.status === 'waiting') {
          gameState.status = 'ongoing';
          await context.redis.set(gameKey, JSON.stringify(gameState),'KEEPTTL');

          await context.redis.expire(gameKey, 1800); 

          io.to(`game:${gameId}`).emit('gameStarted', { gameId });

          await context.redis.set(timerKey, 0);  
          startGameTimer(gameId, context, io); 
        }
      } catch (error) {
        console.error('Error joining game:', error);
        socket.emit('error', { message: 'An error occurred while joining the game.' });
      }
    });

    const startGameTimer = (gameId: string, context: MyContext, io: Server) => {
      const timerKey = `timer:${gameId}`;
      const intervalId = setInterval(async () => {
        const currentTime = await context.redis.get(timerKey);
        const newTime = parseInt(currentTime || "0") + 1;

        await context.redis.set(timerKey, newTime);  
        io.to(`game:${gameId}`).emit('timerUpdate', { gameId, time: newTime });  

        const gameStateJson = await context.redis.get(`game:${gameId}`);
        if (gameStateJson) {
          const gameState = JSON.parse(gameStateJson);
          if (gameState.status === 'ended') {
            clearInterval(intervalId);  
            await context.redis.del(timerKey);  
          }
        }
      }, 1000);  
    };

    socket.on('makeMove', async ({ gameId, move }) => {

      try {
        const gameKey = `game:${gameId}`;
        const gameStateJson = await context.redis.get(gameKey);
        if (!gameStateJson) {
          socket.emit('error', { message: 'Game not found or has expired.' });
          return;
        }

        const gameState = JSON.parse(gameStateJson);

        if (gameState.status !== 'ongoing') {
          socket.emit('error', { message: 'Waiting for players' });
          return;
        }

        if (!gameState.players.includes(userId)) {
          socket.emit('error', { message: 'You are not a player in this game' });
          return;
        }

        if (!gameState.playerStates[userId]) {
          socket.emit('error', { message: 'Player state not found.' });
          return;
        }

        const playerPuzzle = gameState.playerStates[userId].puzzle;
        const cellIndex = playerPuzzle.findIndex(
          (cell: any) =>
            cell.position.x === move.position.x && cell.position.y === move.position.y
        );

        if (cellIndex !== -1) {
          playerPuzzle[cellIndex].value = move.value;

          await context.redis.set(gameKey, JSON.stringify(gameState),"KEEPTTL");

          const isComplete = checkCrosswordCompletion(gameState, userId);

          if (isComplete) {
            gameState.status = 'ended';
            await context.redis.set(gameKey, JSON.stringify(gameState),"KEEPTTL");

            const winner = await context.prisma.user.findUnique({
              where: { id: userId },
              select: { username: true },
            });

            io.to(`game:${gameId}`).emit('gameEnded', {
              gameId,
              winner: winner?.username!,
            });

            await context.prisma.game.create({
              data: {
                id: gameId,
                gameState: gameState,
                status: gameState.status,
                winnerId: userId,
                users: {
                  connect: gameState.players.map((playerId: string) => ({ id: playerId })),
                },
                finishedStates: {
                  create: gameState.players.map((playerId: string) => ({
                    userId: playerId,
                    state: gameState.playerStates[playerId],
                  })),
                },
              },
            });

            await context.redis.del(gameKey);
          } else {
            socket.emit('updatePlayerState', {
              gameId,
              puzzle: playerPuzzle,
            });
          }
        } else {
          socket.emit('error', { message: 'Invalid cell position' });
        }
      } catch (error) {
        console.error('Error handling makeMove:', error);
        socket.emit('error', { message: 'An error occurred while processing your move.' });
      }
    });

    socket.on('disconnect', () => {
    });
  });

  return io;
}
