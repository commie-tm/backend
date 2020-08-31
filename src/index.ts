import 'reflect-metadata';
import * as Koa from 'koa';
import { config as envConfig } from 'dotenv';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/user';
import { ApolloServer } from 'apollo-server-koa';
import { createConnection } from 'typeorm';

envConfig();

async function main(): Promise<void> {
  const koaApp = new Koa();

  const schema = await buildSchema({
    resolvers: [UserResolver]
  });

  // Uses configuration from /ormconfig.json
  const dbConn = await createConnection();

  const apolloServer = new ApolloServer({ schema });
  apolloServer.setGraphQLPath("/api")
  koaApp.use(apolloServer.getMiddleware());

  console.log(`Server starting at http://localhost:${process.env.HTTP_PORT}${apolloServer.graphqlPath}`);
  koaApp.listen(Number(process.env.HTTP_PORT));
}

main();
