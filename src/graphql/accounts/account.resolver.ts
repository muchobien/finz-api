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
      const account = await prisma.account.update({
        where: { id, userId: user.id },
        data: input,
      });

      return account;
    },
    deleteAccount: async (_, { id }, { prisma, currentUser }) => {
      const user = currentUser();
      await prisma.account.delete({
        where: { id, userId: user.id },
      });
    },
  },
  Account: {
    balance: async account => {
      return account.transactions.reduce((acc, transaction) => {
        return acc + transaction.amount;
      }, 0);
    },
  },
};

export default resolvers;
