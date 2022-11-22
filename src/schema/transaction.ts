import { builder } from '@app/builder.js';
import { db } from '@app/db.js';

const TransactionKind = builder.enumType('TransactionKind', {
  values: ['INCOME', 'EXPENSE', 'TRANSFER'] as const,
});

builder.prismaObject('Transaction', {
  fields(t) {
    return {
      id: t.exposeID('id'),
      amount: t.exposeFloat('amount'),
      kind: t.expose('kind', { type: TransactionKind }),
      category: t.relation('category'),
      createdAt: t.expose('createdAt', { type: 'DateTime' }),
      updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    };
  },
});

builder.queryFields(t => ({
  transaction: t.prismaField({
    type: 'Transaction',
    args: {
      id: t.arg.id(),
    },
    resolve: (query, _, args, { currentUser }) =>
      db.transaction.findUniqueOrThrow({
        where: {
          id: args.id,
          account: {
            userId: currentUser(),
          },
        },
        ...query,
      }),
  }),
  transactions: t.prismaField({
    type: ['Transaction'],
    authScopes: { user: true },
    resolve: (query, _, _args, { currentUser }) =>
      db.transaction.findMany({ ...query, where: { account: { userId: currentUser() } } }),
  }),
}));

builder.mutationFields(t => ({
  createTransaction: t.prismaFieldWithInput({
    authScopes: { user: true },
    type: 'Transaction',
    typeOptions: {
      name: 'CreateTransactionInput',
    },
    input: {
      name: t.input.string(),
      amount: t.input.float(),
      date: t.input.field({ type: 'DateTime' }),
      categoryId: t.input.id(),
      accountId: t.input.id(),
      kind: t.input.field({ type: TransactionKind }),
    },
    resolve: (query, _, { input }) =>
      db.transaction.create({
        ...query,
        data: {
          ...input,
        },
      }),
  }),
  updateTransaction: t.prismaFieldWithInput({
    authScopes: { user: true },
    type: 'Transaction',
    typeOptions: {
      name: 'UpdateTransactionInput',
    },
    input: {
      id: t.input.id(),
      name: t.input.string(),
      amount: t.input.float(),
      date: t.input.field({ type: 'DateTime' }),
      categoryId: t.input.id(),
      accountId: t.input.id(),
      kind: t.input.field({ type: TransactionKind }),
    },
    resolve: (query, _, { input }, { currentUser }) =>
      db.transaction.update({
        ...query,
        where: {
          id: input.id,
          account: {
            userId: currentUser(),
          },
        },
        data: {
          ...input,
        },
      }),
  }),
  deleteTransaction: t.prismaField({
    authScopes: { user: true },
    type: 'Transaction',
    args: {
      id: t.arg.id(),
    },
    resolve: (query, _, args, { currentUser }) =>
      db.transaction.delete({
        ...query,
        where: {
          id: args.id,
          account: {
            userId: currentUser(),
          },
        },
      }),
  }),
}));
