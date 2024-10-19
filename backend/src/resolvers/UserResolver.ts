import { MyContext } from "..";
import { UsernamePasswordInput } from "../types/UserTypes";
import argon2 from "argon2";
import { validateRegister } from "../utils/validateRegister";

export const UserResolver = {
  Query: {
    me: (_parent: any, _args: any, context: MyContext) => {
      if (!context.req.session.userId) {
        return null;
      }

      return context.prisma.user.findUnique({
        where: {
          id: context.req.session.userId,
        },
      });
    }
  },
  Mutation: {
    Register: async (_parent: any, { args }: { args: UsernamePasswordInput }, context: MyContext) => {
      console.log(context)
      const errors = validateRegister(args);
      if (errors) {
        return { errors }; 
      }

      const hashedPassword = await argon2.hash(args.password);

      try {
        const user = await context.prisma.user.create({
          data: {
            username: args.username,
            email: args.email,
            password: hashedPassword,
          },
        });

        context.req.session.userId = user.id;

        return { user };
      } catch (err: any) {
        if (err.code === "P2002") {
          return {
            errors: [
              {
                field: "username",
                message: "username already taken",
              },
            ],
          };
        }

      }
      throw new Error("An error occurred while registering the user");  
    },
    Login : async (_parent: any, { args }: { args: UsernamePasswordInput }, context: MyContext) => { 
      const user = await context.prisma.user.findUnique({
        where: {
          email: args.email,
        },
      });

      if (!user) {
        return {
          errors: [
            {
              field: "email",
              message: "user does not exist",
            },
          ],
        };
      }

      const valid = await argon2.verify(user.password, args.password);

      if (!valid) {
        return {
          errors: [
            {
              field: "password",
              message: "incorrect password",
            },
          ],
        };
      }

      context.req.session.userId = user.id;

      return { user };
    },
    Logout : async (_parent: any, _args: any, context: MyContext) => {
      return new Promise((resolve) =>
        context.req.session.destroy((err) => {
          context.res.clearCookie(process.env.COOKIE_NAME!);
          if (err) {
            console.log(err);
            resolve(false);
            return;
          }

          resolve(true);
        })
      );
    },
  },
};
