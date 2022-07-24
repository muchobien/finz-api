import { loadFiles } from '@graphql-tools/load-files';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import type { FastifyPluginCallback, FastifyReply, FastifyRequest } from 'fastify';
import mercurius, { MercuriusLoaders } from 'mercurius';
import { codegenMercurius } from 'mercurius-codegen';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname } from 'node:path';
import {
  DateTimeTypeDefinition,
  DateTimeResolver,
  DateResolver,
  DateTypeDefinition,
  BigIntTypeDefinition,
  BigIntResolver,
  VoidTypeDefinition,
  VoidResolver,
} from 'graphql-scalars';
import fp from 'fastify-plugin';

const buildContext = async (req: FastifyRequest, _reply: FastifyReply) => {
  return {
    prisma: req.prisma,
  };
};

type PromiseType<T> = T extends PromiseLike<infer U> ? U : T;

declare module 'mercurius' {
  interface MercuriusContext extends PromiseType<ReturnType<typeof buildContext>> {}
}

export const loaders: MercuriusLoaders = {
  User: {
    async accounts(queries, { prisma }) {
      const ids = queries.map(({ obj }) => obj.id);

      const accounts = await prisma.account.findMany({
        where: {
          userId: {
            in: ids,
          },
        },
      });

      return ids.map(id => accounts.filter(account => account.userId === id));
    },
  },
  Account: {
    async transactions(queries, { prisma }) {
      const ids = queries.map(({ obj }) => obj.id);

      const transactions = await prisma.transaction.findMany({
        where: {
          accountId: {
            in: ids,
          },
        },
      });

      return ids.map(id => transactions.filter(transaction => transaction.accountId === id));
    },
  },
  Transaction: {
    async category(queries, { prisma }) {
      const ids = queries.map(({ obj }) => obj.id);

      const categories = await prisma.category.findMany();

      return ids.map(id => categories.find(category => category.id === id)!);
    },
  },
};

const plugin: FastifyPluginCallback = async app => {
  const __basedir = dirname(dirname(fileURLToPath(import.meta.url)));
  const loadedFiles = await loadFiles(`${__basedir}/graphql/**/*.gql`);
  const typeDefs = mergeTypeDefs(loadedFiles);

  const resolversArray = await loadFiles(`${__basedir}/graphql/**/*.resolver.*`, {
    requireMethod: (path: string) => import(pathToFileURL(path).toString()),
  });
  const resolvers = mergeResolvers(resolversArray);

  app.register(mercurius, {
    schema: makeExecutableSchema({
      typeDefs: [DateTimeTypeDefinition, DateTypeDefinition, BigIntTypeDefinition, VoidTypeDefinition, typeDefs],
      resolvers: {
        DateTime: DateTimeResolver,
        Date: DateResolver,
        BigInt: BigIntResolver,
        Void: VoidResolver,
        ...resolvers,
      },
    }),
    context: buildContext,
    loaders,
  });

  codegenMercurius(app, {
    watchOptions: {
      enabled: false,
    },
    outputSchema: true,
    targetPath: './src/generated/graphql.ts',
    codegenConfig: {
      scalars: {
        DateTime: 'Date',
        Date: 'Date',
        Void: 'void',
      },
      enumsAsTypes: true,
    },
  });
};

export default fp(plugin, {
  name: 'mercurius',
  dependencies: ['prisma', 'jwt'],
});
