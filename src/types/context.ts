import type { FastifyReply, FastifyRequest } from 'fastify';

export type Context = {
  req: FastifyRequest;
  reply: FastifyReply;
  currentUser: () => string;
};
