import { PrismaClient, type Prisma } from '@prisma/client';
import type { FastifyPluginCallback } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    prisma: PrismaClient;
  }
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const prisma: FastifyPluginCallback<Prisma.PrismaClientOptions & { prefix?: string }> = async (
  fastify,
  { prefix, ...opts },
  next,
) => {
  if (fastify.prisma) {
    return next(new Error('fastify-prisma-client has been defined before'));
  }

  const prisma = new PrismaClient(opts);

  await prisma.$connect();

  fastify
    .decorate('prisma', prisma)
    .decorateRequest('prisma', { getter: () => fastify.prisma })
    .addHook('onClose', async (fastify, done) => {
      await fastify.prisma.$disconnect();
      done();
    });

  next();
};

export default prisma;

export const autoConfig: Prisma.PrismaClientOptions = {
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
};
