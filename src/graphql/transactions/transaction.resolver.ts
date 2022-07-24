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
};

export default resolvers;
