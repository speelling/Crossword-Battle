import { MyContext } from "..";

export const HelloWorldResolver = {
  Query: {
    getRedisValue: async (_parent: any, args: { key: string }, context: MyContext) => {
      try {
        const value = await context.redis.get(args.key);
        return value;
      } catch (error) {
        console.error("Error fetching from Redis:", error);
        throw new Error("Failed to get value from Redis");
      }
    },
  },
  Mutation: {
    setRedisValue: async (_parent: any, args: { key: string, value: string }, context: MyContext) => {
      try {
        await context.redis.set(args.key, args.value);
        return `Key ${args.key} set successfully with value ${args.value}`; 
      } catch (error) {
        console.error("Error setting Redis value:", error);
        throw new Error("Failed to set value in Redis");
      }
    },
  },
};

