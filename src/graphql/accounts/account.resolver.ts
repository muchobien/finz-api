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
    createAccount: async (_, { input }, { prisma, currentUser }) => {
      const user = currentUser();
      return prisma.account.create({
        data: { ...input, userId: user.id },
      });
    },
    updateAccount: async (_, { id, input }, { prisma, currentUser }) => {
      const user = currentUser();
      await prisma.account.updateMany({
        where: { id, userId: user.id },
        data: input,
      });

      return prisma.account.findFirstOrThrow({
        where: { id, userId: user.id },
      });
    },
    deleteAccount: async (_, { id }, { prisma, currentUser }) => {
      const user = currentUser();
      await prisma.account.deleteMany({
        where: { id, userId: user.id },
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
