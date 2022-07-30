import type { Role } from '@app/generated/graphql';
import type { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import mercuriusAuth from 'mercurius-auth';
import UserRoles from 'supertokens-node/recipe/userroles';

const plugin: FastifyPluginCallback = async app => {
  app.register(mercuriusAuth, {
    authDirective: 'auth',
    authContext({ session }) {
      return { session };
    },
    async applyPolicy(policy, _parent, _args, context, _info) {
      const role: Role = policy.arguments[0].value.value;

      if (role === 'UNKNOWN') {
        return true;
      }

      const userId = context.session?.getUserId();

      if (!userId) {
        return false;
      }

      const { roles } = await UserRoles.getRolesForUser(userId);

      return roles.includes(role);
    },
  });
};

export default fp(plugin, {
  name: 'mercurius-auth',
  dependencies: ['mercurius'],
});
