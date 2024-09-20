import { MyContext } from "..";
import { UsernamePasswordInput } from "../types/UserTypes";
import argon2 from "argon2";


export const UserResolver = {
  Query: {
  },
  Mutation: {
    Register: async (_parent: any, { args }: { args: UsernamePasswordInput } , context: MyContext) => {
        console.log(args);      
        const hashedPassword = await argon2.hash(args.password);
        const user = await context.prisma.user.create({
          data: {
            username: args.username,
            email: args.email,
            password: hashedPassword,
          },
        });
        context.req.session.userId = user.id;
        return { user };
      } 
    },
};

