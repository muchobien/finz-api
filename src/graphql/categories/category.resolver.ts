import type { IResolvers } from 'mercurius';

const resolvers: IResolvers = {
  Query: {
    category: async (_, { id }, { prisma }) => {
      return prisma.category.findFirstOrThrow({
        where: {
          id,
        },
      });
    },
    categories: async (_, {}, { prisma }) => {
      return prisma.category.findMany();
    },
  },
  Mutation: {
    createCategory: async (_, { input }, { prisma }) => {
      return prisma.category.create({
        data: input,
      });
    },
    updateCategory: async (_, { id, input }, { prisma }) => {
      return prisma.category.update({
        where: {
          id,
        },
        data: input,
      });
    },
    deleteCategory: async (_, { id }, { prisma }) => {
      await prisma.category.delete({
        where: {
          id,
        },
      });
    },
  },
};

export default resolvers;
