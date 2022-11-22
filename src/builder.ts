import SchemaBuilder from '@pothos/core';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import PrismaPlugin from '@pothos/plugin-prisma';
import WithInputPlugin from '@pothos/plugin-with-input';
import { DateTimeResolver, JSONResolver } from 'graphql-scalars';
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects';
import { db } from '@app/db.js';
import type { Prisma } from '@prisma/client';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import { tracer, TracingOptions } from '@app/utils/tracing.js';
import TracingPlugin, { isRootField } from '@pothos/plugin-tracing';
import { createOpenTelemetryWrapper } from '@pothos/tracing-opentelemetry';
import type { Context } from '@app/types/context';

const createSpan = createOpenTelemetryWrapper<TracingOptions>(tracer, {
  includeSource: true,
  onSpan: (span, options) => {
    if (typeof options === 'object' && options.attributes) {
      span.setAttributes(options.attributes);
    }
  },
});

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  DefaultInputFieldRequiredness: true;
  Scalars: {
    ID: {
      Output: string;
      Input: string;
    };
    DateTime: {
      Output: Date;
      Input: Date;
    };
    JSON: {
      Output: Prisma.JsonValue;
      Input: Prisma.JsonValue;
    };
  };
  Context: Context;
  AuthScopes: {
    admin: boolean;
    user: boolean;
  };
  Tracing: TracingOptions;
}>({
  plugins: [ScopeAuthPlugin, PrismaPlugin, WithInputPlugin, SimpleObjectsPlugin, TracingPlugin],
  tracing: {
    default: config => isRootField(config),
    wrap: (resolver, options) => createSpan(resolver, options),
  },
  prisma: {
    client: db,
    // use where clause from prismaRelatedConnection for totalCount (will true by default in next major version)
    filterConnectionTotalCount: true,
  },
  defaultInputFieldRequiredness: true,
  authScopes: async ctx => ({
    admin: async () => {
      const payload = await ctx.reply.request.accessJwtVerify();

      return payload.role === 'ADMIN';
    },
    user: async () => {
      const payload = await ctx.reply.request.accessJwtVerify();

      return payload.role === 'USER';
    },
  }),
});

builder.queryType();
builder.mutationType();
builder.addScalarType('DateTime', DateTimeResolver, {});
builder.addScalarType('JSON', JSONResolver, {});
