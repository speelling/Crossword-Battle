import { v4 as uuidv4 } from 'uuid';
import { MyContext } from '..';
import { generateCrossword } from '../utils/generateCrossword';

export const GameResolver = {
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

      await context.redis.set(`game:${gameId}`, JSON.stringify(initialState));

      return gameId
        
    },
  },
};



