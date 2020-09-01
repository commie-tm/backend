import 'reflect-metadata';
import Koa from 'koa';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './src/resolvers/user';
import { ApolloServer } from 'apollo-server-koa';
import { createConnection } from 'typeorm';
import { Container } from 'typedi';
import { authChecker } from './src/utils/auth-checker';
// import koaJwt from 'koa-jwt';
import applicationConfig from './config.json';
import { buildContext } from './src/utils/context-builder';
import { UserFlagResolver } from './src/resolvers/user-flag';
import KoaStatic from 'koa-static';

async function main(): Promise<void> {
  const koaApp = new Koa();

  // koaApp.use(koaJwt({ secret: applicationConfig.JWT_SECRET }));

  const schema = await buildSchema({
    resolvers: [UserResolver, UserFlagResolver],
    container: Container,
    authChecker
  });

  // Uses configuration from /ormconfig.json
  await createConnection();

  if (applicationConfig.FRONTEND_PATH) {
    koaApp.use(KoaStatic(applicationConfig.FRONTEND_PATH, {}));
  }

  const apolloServer = new ApolloServer({
    schema,
    context: ({ ctx }: { ctx: Koa.Context }) => { return buildContext(ctx); }
  });
  apolloServer.applyMiddleware({ app: koaApp });

  console.log(`Server starting at http://localhost:${applicationConfig.HTTP_PORT}${apolloServer.graphqlPath}`);
  koaApp.listen(Number(applicationConfig.HTTP_PORT));
}

main();
