import { builder } from '@app/builder.js';
import { db } from '@app/db.js';

builder.prismaObject('Account', {
  fields(t) {
    return {
      id: t.exposeID('id'),
      name: t.exposeString('name'),
      color: t.string({
        nullable: true,
        resolve: root => root.color,
      }),
      transactions: t.relation('transactions'),
      createdAt: t.expose('createdAt', { type: 'DateTime' }),
      updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    };
  },
});

builder.queryFields(t => ({
  account: t.prismaField({
    type: 'Account',
    args: {
      id: t.arg.id(),
    },
    resolve: (query, _, args, { currentUser }) =>
      db.account.findUniqueOrThrow({
        where: {
          id: args.id,
          userId: currentUser(),
        },
        ...query,
      }),
  }),
  accounts: t.prismaField({
    type: ['Account'],
    authScopes: { user: true },
    resolve: (query, _, _args, { currentUser }) => db.account.findMany({ ...query, where: { userId: currentUser() } }),
  }),
}));

builder.mutationFields(t => ({
  createAccount: t.prismaFieldWithInput({
    authScopes: { user: true },
    type: 'Account',
    typeOptions: {
      name: 'CreateAccountInput',
    },
    input: {
      name: t.input.string(),
      color: t.input.string(),
    },
    resolve: (query, _, { input }, { currentUser }) =>
      db.account.create({
        ...query,
        data: {
          ...input,
          userId: currentUser(),
        },
      }),
  }),
  updateAccount: t.prismaFieldWithInput({
    authScopes: { user: true },
    type: 'Account',
    typeOptions: {
      name: 'UpdateAccountInput',
    },
    input: {
      id: t.input.id(),
      name: t.input.string(),
      color: t.input.string(),
    },
    resolve: (query, _, { input }, { currentUser }) =>
      db.account.update({
        ...query,
        where: {
          id: input.id,
          userId: currentUser(),
        },
        data: {
          name: input.name,
          color: input.color,
        },
      }),
  }),
  deleteAccount: t.prismaField({
    authScopes: { user: true },
    type: 'Account',
    args: {
      id: t.arg.id(),
    },
    resolve: (query, _, args, { currentUser }) =>
      db.account.delete({
        ...query,
        where: {
          id: args.id,
          userId: currentUser(),
        },
      }),
  }),
}));
