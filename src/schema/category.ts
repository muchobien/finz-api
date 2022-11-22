import { builder } from '@app/builder.js';
import { db } from '@app/db.js';

builder.prismaObject('Category', {
  fields(t) {
    return {
      id: t.exposeID('id'),
      name: t.exposeString('name'),
      color: t.string({
        nullable: true,
        resolve: root => root.color,
      }),
      createdAt: t.expose('createdAt', { type: 'DateTime' }),
      updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    };
  },
});

builder.queryFields(t => ({
  categories: t.prismaField({
    authScopes: { user: true },
    type: ['Category'],
    resolve: (query, _) => db.category.findMany({ ...query }),
  }),
  category: t.prismaField({
    authScopes: { user: true },
    type: 'Category',
    args: {
      id: t.arg.id(),
    },
    resolve: (query, _, args) => db.category.findUniqueOrThrow({ ...query, where: { id: args.id } }),
  }),
}));

builder.mutationFields(t => ({
  createCategory: t.prismaFieldWithInput({
    authScopes: { user: true },
    type: 'Category',
    typeOptions: {
      name: 'CreateCategoryInput',
    },
    input: {
      name: t.input.string(),
      color: t.input.string({ required: false }),
    },
    resolve: (_query, _, { input }) =>
      db.category.create({
        data: {
          name: input.name,
          color: input.color ?? null,
        },
      }),
  }),
  updateCategory: t.prismaFieldWithInput({
    authScopes: { admin: true },
    type: 'Category',
    typeOptions: {
      name: 'UpdateCategoryInput',
    },
    input: {
      id: t.input.id(),
      name: t.input.string(),
      color: t.input.string({ required: false }),
    },
    resolve: (query, _, { input }) =>
      db.category.update({
        ...query,
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          color: input.color ?? null,
        },
      }),
  }),
  deleteCategory: t.prismaField({
    authScopes: { admin: true },
    type: 'Category',
    args: {
      id: t.arg.id(),
    },
    resolve: (query, _, args) =>
      db.category.delete({
        ...query,
        where: {
          id: args.id,
        },
      }),
  }),
}));
