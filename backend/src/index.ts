import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import Redis, { Redis as RedisType } from "ioredis";

import { HelloWorldResolver } from "./resolvers/UserResolver";
import userTypeDefs from "./schema/userTypeDefs";

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
  token?: string;
  prisma: PrismaClient;
  redis: RedisType;
}

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        token: req.headers.token as string,
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
