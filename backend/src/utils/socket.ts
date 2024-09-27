import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import Redis from 'ioredis';

export function setupSocketIO(httpServer: HttpServer, redis: Redis) {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173", 
      credentials: true,
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
  
    socket.on('joinGame', async (gameId) => {
      const gameKey = `game:${gameId}`;
      const game = await redis.hgetall(gameKey);
  
      if (!game) {
        socket.emit('error', 'Game not found or expired');
        return;
      }
  
      if (game.status === 'waiting') {
        // Update game state to start
        await redis.hmset(gameKey, { status: 'started', opponentId: socket.id });
        socket.join(gameId);
        io.in(gameId).emit('gameStarted', { gameId });
  
        console.log(`Game ${gameId} started by user ${socket.id}`);
      } else {
        socket.emit('error', 'Game already in progress');
      }
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
}
