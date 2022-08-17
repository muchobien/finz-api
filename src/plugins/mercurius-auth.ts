import type { Role } from '@app/generated/graphql';
import type { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import mercuriusAuth from 'mercurius-auth';

const plugin: FastifyPluginCallback = async app => {
  app.register(mercuriusAuth, {
    authDirective: 'auth',
    authContext() {
      return {};
    },
    async applyPolicy(policy, _parent, _args, context, _info) {
      const role: Role = policy.arguments[0].value.value;

      const payload = await context.reply.request.accessJwtVerify();

      return role === payload.role;
    },
  });
};

export default fp(plugin, {
  name: 'mercurius-auth',
  dependencies: ['mercurius'],
});
