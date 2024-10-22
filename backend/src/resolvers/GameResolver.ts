import { v4 as uuidv4 } from 'uuid';
import { MyContext } from '..';
import { generateCrossword } from '../utils/generateCrossword';

export const GameResolver = {
  Query: {
    profile: async (_: any, args: any, context: MyContext) => {
      const userId = context.req.session.userId;
    
    
      if (!userId) {
        throw new Error("User not authenticated");
      }
    
      const user = await context.prisma.user.findUnique({
        where: { id: userId },
        include: {
          games: {
            include: {
              winner: true,
              users:true
            },
            orderBy: {
              updatedAt: 'desc', 
            },
            take: 20, 
          },
        },
      });
    
    
      if (!user) {
        throw new Error("User not found");
      }
    
      return {
        username: user.username,
        games: user.games,
      };
    },
  },

  Mutation: {
    async createGame(_: any, args: any, context: MyContext) {
      const userId = context.req.session.userId;

      if (!userId) {
        throw new Error('Not authenticated');
      }

      const gameId = uuidv4();

      const { fullCrossword, clientCrossword } = generateCrossword();

      const initialState = {
        gameId,
        puzzle: fullCrossword.puzzle,
        clues: fullCrossword.clues,
        dim: fullCrossword.dim,
        status: 'waiting',
        startTime: Date.now(),
        players: [userId],
        playerStates: {},
      };

      await context.redis.set(
        `game:${gameId}`,
        JSON.stringify(initialState),
        'EX',
        300 
      );

      return gameId;
    },
  },
};
