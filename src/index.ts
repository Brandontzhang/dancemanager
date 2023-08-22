import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";
import { PGDBDataSource } from "./datasources/db.js";
import { config } from "dotenv";

async function startApolloServer() {
  config();
  const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
  });
  const { url } = await startStandaloneServer(server, {
    context: async () => {
      const { cache } = server;
      // TODO: Look into caching later (Redis)
      return {
        dataSources: {
          db: new PGDBDataSource(),
        }
      };
    },
  });
  console.log(`
    🚀  Server is running!
    📭  Query at ${url}
  `);
}

startApolloServer();
