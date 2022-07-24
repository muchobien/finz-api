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
};

export default resolvers;
