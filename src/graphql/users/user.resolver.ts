import { Hash } from '@app/utils';
import type { IResolvers } from 'mercurius';

const resolvers: IResolvers = {
  Query: {
    user: async (_, { id }, { prisma }) => {
      return prisma.user.findFirstOrThrow({
        where: {
          id,
        },
      });
    },
    users: async (_, {}, { prisma }) => {
      return prisma.user.findMany();
    },
  },

  Mutation: {
    updateUser: async (_, { id, input }, { prisma }) => {
      return prisma.user.update({
        where: {
          id,
        },
        data: input,
      });
    },
    deleteUser: async (_, { id }, { prisma }) => {
      await prisma.user.delete({
        where: {
          id,
        },
      });
    },
    register: async (_, { input }, { prisma, reply }) => {
      if (input.provider === 'LOCAL') {
        input.token = await Hash.password(input.token);
      }

      const user = await prisma.user.create({
        data: {
          email: input.email,
          identities: {
            create: {
              provider: input.provider,
              token: input.token,
            },
          },
        },
      });

      const accessToken = await reply.accessJwtSign({ id: user.id, role: user.role });
      const refreshToken = await reply.refreshJwtSign({ id: user.id, role: user.role });

      return {
        user,
        credential: {
          accessToken,
          refreshToken,
          tokenKind: 'Bearer',
        },
      };
    },
    login: async (_, { input }, { prisma, reply }) => {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
        include: {
          identities: {
            where: {
              provider: input.provider,
            },
          },
        },
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      if (input.provider === 'LOCAL') {
        const isValid = await Hash.verify(input.token, user.identities[0]!.token);
        if (!isValid) {
          throw new Error('Invalid credentials');
        }
      }

      const accessToken = await reply.accessJwtSign({ id: user.id, role: user.role });
      const refreshToken = await reply.refreshJwtSign({ id: user.id, role: user.role });

      return {
        user,
        credential: {
          accessToken,
          refreshToken,
          tokenKind: 'Bearer',
        },
      };
    },

    refreshToken: async (_parent, _args, { reply }) => {
      const originalPayload = await reply.request.refreshJwtVerify();

      const accessToken = await reply.accessJwtSign({ id: originalPayload.id, role: originalPayload.role });
      const refreshToken = await reply.refreshJwtSign({ id: originalPayload.id, role: originalPayload.role });

      return {
        accessToken,
        refreshToken,
        tokenKind: 'Bearer',
      };
    },
  },
};

export default resolvers;
