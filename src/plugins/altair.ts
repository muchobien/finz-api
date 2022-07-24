import type { FastifyPluginCallback } from 'fastify';
import AltairFastify from 'altair-fastify-plugin';
import fp from 'fastify-plugin';

const plugin: FastifyPluginCallback = async (app) => {
  app.register(AltairFastify);
};

export default fp(plugin,{
  name: 'altair',
  dependencies: ['mercurius'],
});
