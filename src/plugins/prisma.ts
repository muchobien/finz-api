import type { PluginConfig } from '@app/types';
import { PrismaClient, type Prisma } from '@prisma/client';
import type { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyRequest {
    prisma: PrismaClient;
  }
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

type Config = PluginConfig<Prisma.PrismaClientOptions>;

const plugin: FastifyPluginCallback<Config> = async (app, { name, dependencies, prefix, ...opts }, next) => {
  if (app.prisma) {
    return next(new Error('fastify-prisma-client has been defined before'));
  }

  const prisma = new PrismaClient(opts);

  await prisma.$connect();

  app
    .decorate('prisma', prisma)
    .decorateRequest('prisma', { getter: () => app.prisma })
    .addHook('onClose', async (fastify, done) => {
      await fastify.prisma.$disconnect();
      done();
    });

  next();
};

export default fp(plugin, {
  name: 'prisma',
});

export const autoConfig: Config = {
  name: 'prisma',
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
};
