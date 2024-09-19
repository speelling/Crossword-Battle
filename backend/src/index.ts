import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import session from "express-session";
import connectRedis from "connect-redis";
import Redis, { Redis as RedisType } from "ioredis";
import { PrismaClient } from "@prisma/client";

import { HelloWorldResolver } from "./resolvers/UserResolver";
import userTypeDefs from "./schema/userTypeDefs";
import RedisStore from "connect-redis";
import 'dotenv/config';


const prisma = new PrismaClient();
const redis = new Redis();


const typeDefs = [userTypeDefs];

const resolvers = {
  Query: {
    ...HelloWorldResolver.Query,
  },
  Mutation: {
    ...HelloWorldResolver.Mutation,
  },
};

export interface MyContext {
  prisma: PrismaClient;
  redis: RedisType;
  req: express.Request;
  res: express.Response;
}

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);

  app.use(
    cors({
      origin: "http://localhost:3000", 
      credentials: true, 
    })
  );

  app.use(
    session({
      name: process.env.COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.COOKIE_SECURE === "true",
      },
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET || (() => { throw new Error('No Secret'); })(),
      resave: false,
    })
  );
  

  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({
        req,
        res,
        prisma,
        redis,
      }),
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
}

startApolloServer().catch((error) => {
  console.error("Error starting server:", error);
});
