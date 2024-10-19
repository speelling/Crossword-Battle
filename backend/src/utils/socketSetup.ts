import { MyContext } from "..";
import { ClientToServerEvents, ExtendedIncomingMessage, ServerToClientEvents } from "../types/SocketTypes";
import { Server, Socket } from "socket.io";
import { Server as HttpServer } from 'http';
import { checkCrosswordCompletion } from "./checkComplete";


export function setupSocketIO(
    httpServer: HttpServer,
    sessionMiddleware: any,
    context: MyContext) 
  {
    console.log('Setting up Socket.IO');
    const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
      cors: {
        origin: 'http://localhost:5173',
        credentials: true,
      },
    });
  
    io.engine.use(sessionMiddleware);
  
    io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
      console.log('Client connected:', socket.id);
  
      const req = socket.request as ExtendedIncomingMessage;
      const session = req.session;
      const userId = session.userId;
  
      if (!userId) {
        console.log('Unauthenticated socket connection. Disconnecting.');
        socket.disconnect(true);
        return;
      }
  
      console.log('User connected:', userId);
  
      socket.join(`user:${userId}`);
  
      socket.on('joinGame', async ({ gameId }) => {
        try {
          const gameStateJson = await context.redis.get(`game:${gameId}`);
          if (!gameStateJson) {
            socket.emit('error', { message: 'Game not found' });
            return;
          }
  
          const gameState = JSON.parse(gameStateJson);
  
          if (!gameState.players.includes(userId)) {
            if (gameState.players.length >= 2) {
              socket.emit('error', { message: 'Game is full' });
              return;
            }
  
            gameState.players.push(userId);
            await context.redis.set(`game:${gameId}`, JSON.stringify(gameState));
          }
  
          socket.join(`game:${gameId}`);
  
          const clientGameState = {
            gameId: gameState.gameId,
            clues: gameState.clues,
            dim: gameState.dim,
            status: gameState.status,
            puzzle: gameState.puzzle.map((cell: any) => ({
              isBlack: cell.isBlack,
              position: cell.position,
              clues: cell.clues,
              value: '', 
            })),
          };
  
          socket.emit('gameState', clientGameState);
  
          if (gameState.players.length === 2 && gameState.status === 'waiting') {
            gameState.status = 'ongoing';
            await context.redis.set(`game:${gameId}`, JSON.stringify(gameState));
            io.to(`game:${gameId}`).emit('gameStarted', { gameId });
          }
        } catch (error) {
          console.error('Error joining game:', error);
          socket.emit('error', { message: 'An error occurred while joining the game.' });
        }
      });
  
      socket.on('makeMove', async ({ gameId, move }) => {
        try {
          const gameStateJson = await context.redis.get(`game:${gameId}`);
          if (!gameStateJson) {
            socket.emit('error', { message: 'Game not found' });
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
            gameState.playerStates[userId] = {
              puzzle: gameState.puzzle.map((cell: any) => ({
                isBlack: cell.isBlack,
                position: cell.position,
                clues: cell.clues,
                value: '', 
              })),
            };
          }
  
          const playerPuzzle = gameState.playerStates[userId].puzzle;
          const cellIndex = playerPuzzle.findIndex(
            (cell: any) =>
              cell.position.x === move.position.x && cell.position.y === move.position.y
          );
  
          if (cellIndex !== -1) {
            playerPuzzle[cellIndex].value = move.value;
  
            await context.redis.set(`game:${gameId}`, JSON.stringify(gameState));
  
            const isComplete = checkCrosswordCompletion(gameState, userId);
  
            if (isComplete) {
              gameState.status = 'ended';
              await context.redis.set(`game:${gameId}`, JSON.stringify(gameState));
              
  
              io.to(`game:${gameId}`).emit('gameEnded', {
                gameId,
                winner: userId,
              });
  
              await context.redis.del(`game:${gameId}`);
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
        console.log('User disconnected:', userId);
      });
    });
  
    return io;
  }
  
  