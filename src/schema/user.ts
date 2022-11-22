import { builder } from '@app/builder.js';
import { db } from '@app/db.js';
import { Hash } from '@app/utils/hash.js';

const UserRef = builder.prismaObject('User', {
  fields(t) {
    return {
      id: t.exposeID('id'),
      email: t.exposeString('email'),
      role: t.exposeString('role'),
      accounts: t.relation('accounts'),
      createdAt: t.expose('createdAt', { type: 'DateTime' }),
      updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
      settings: t.expose('settings', { type: 'JSON' }),
    };
  },
});

const Provider = builder.enumType('Provider', {
  values: ['APPLE', 'GOOGLE', 'LOCAL'] as const,
});

const AuthInput = builder.inputType('AuthInput', {
  fields: t => ({
    provider: t.field({ type: Provider }),
    email: t.string(),
    token: t.string(),
  }),
});

const Crendential = builder.simpleObject('Credential', {
  fields: t => ({
    accessToken: t.string(),
    refreshToken: t.string(),
    tokenKind: t.string(),
  }),
});

const Authenticated = builder.simpleObject('Authenticated', {
  fields: t => ({
    user: t.field({ type: UserRef }),
    credential: t.field({ type: Crendential }),
  }),
});

builder.queryFields(t => ({
  me: t.prismaField({
    authScopes: { user: true },
    type: 'User',
    resolve: (query, _, _args, { currentUser }) =>
      db.user.findUniqueOrThrow({ ...query, where: { id: currentUser() } }),
  }),
}));

builder.mutationFields(t => ({
  register: t.field({
    type: Authenticated,
    args: {
      input: t.arg({ type: AuthInput }),
    },
    resolve: async (_, { input }, { reply }) => {
      if (input.provider === 'LOCAL') {
        input.token = await Hash.password(input.token);
      }

      const user = await db.user.create({
        data: {
          email: input.email,
          settings: {},
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
  }),

  login: t.field({
    type: Authenticated,
    args: {
      input: t.arg({ type: AuthInput }),
    },
    resolve: async (_, { input }, { reply }) => {
      const user = await db.user.findUniqueOrThrow({
        where: { email: input.email },
        include: {
          identities: {
            where: {
              provider: input.provider,
            },
          },
        },
      });

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
  }),

  refreshToken: t.field({
    type: Crendential,
    resolve: async (_, __, { reply }) => {
      const originalPayload = await reply.request.refreshJwtVerify();

      const accessToken = await reply.accessJwtSign({ id: originalPayload.id, role: originalPayload.role });
      const refreshToken = await reply.refreshJwtSign({ id: originalPayload.id, role: originalPayload.role });

      return {
        accessToken,
        refreshToken,
        tokenKind: 'Bearer',
      };
    },
  }),
}));
