import type { IResolvers } from 'mercurius';

const resolvers: IResolvers = {
  Query: {
    transaction: async (_, { id }, { prisma }) => {
      return prisma.transaction.findFirstOrThrow({
        where: {
          id,
        },
      });
    },
    transactions: async (_, {}, { prisma }) => {
      return prisma.transaction.findMany();
    },
  },
  Mutation: {
    createTransaction: async (_, { input }, { prisma }) => {
      return prisma.transaction.create({
        data: input,
      });
    },
    updateTransaction: async (_, { id, input }, { prisma }) => {
      return prisma.transaction.update({
        where: {
          id,
        },
        data: input,
      });
    },
    deleteTransaction: async (_, { id }, { prisma }) => {
      await prisma.transaction.delete({
        where: {
          id,
        },
      });
    },
  },
};

export default resolvers;
