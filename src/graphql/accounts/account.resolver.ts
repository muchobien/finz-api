import { Prisma } from '@prisma/client';
import type { IResolvers } from 'mercurius';

const resolvers: IResolvers = {
  Query: {
    account: async (_, { id }, { prisma }) => {
      return prisma.account.findFirstOrThrow({
        where: {
          id,
        },
      });
    },
    accounts: async (_, {}, { prisma }) => {
      return prisma.account.findMany();
    },
  },
  Mutation: {
    createAccount: async (_, { input }, { prisma, session }) => {
      const userId = session.getUserId();
      return prisma.account.create({
        data: { ...input, userId },
      });
    },
    updateAccount: async (_, { id, input }, { prisma, session }) => {
      const userId = session.getUserId();
      await prisma.account.updateMany({
        where: { id, userId },
        data: input,
      });

      return prisma.account.findFirstOrThrow({
        where: { id, userId },
      });
    },
    deleteAccount: async (_, { id }, { prisma, session }) => {
      const userId = session.getUserId();
      await prisma.account.deleteMany({
        where: { id, userId },
      });
    },
  },
  Account: {
    balance: async account => {
      return account.transactions.reduce((acc, transaction) => {
        return acc.add(transaction.amount);
      }, new Prisma.Decimal(0));
    },
  },
};

export default resolvers;
