import type { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { errorHandler, plugin as supertokensPlugin } from 'supertokens-node/framework/fastify';
import supertokens from 'supertokens-node';
import cors from '@fastify/cors';
import Session from 'supertokens-node/recipe/session';
import ThirdPartyEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword';
import formDataPlugin from '@fastify/formbody';
import { verifySession } from 'supertokens-node/recipe/session/framework/fastify';
import type { SessionRequest } from 'supertokens-node/framework/fastify';
import UserRoles from 'supertokens-node/recipe/userroles';
import { env } from '@app/config/env';

declare module 'fastify' {
  interface FastifyRequest {
    session?: SessionRequest['session'];
  }
}

const { Google, Github, Apple } = ThirdPartyEmailPassword;

async function createRoles() {
  await UserRoles.createNewRoleOrAddPermissions('USER', ['read', 'write']);
  await UserRoles.createNewRoleOrAddPermissions('ADMIN', ['read', 'write', 'delete']);
}

const plugin: FastifyPluginCallback = async app => {
  app.setErrorHandler(errorHandler());

  app.addHook('onRequest', verifySession({ sessionRequired: false }));

  supertokens.init({
    framework: 'fastify',
    supertokens: {
      // try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
      connectionURI: env.SUPERTOKENS_CONNECTION_URI,
      // apiKey: "IF YOU HAVE AN API KEY FOR THE CORE, ADD IT HERE",
    },
    appInfo: {
      // learn more about this on https://supertokens.com/docs/session/appinfo
      appName: 'Finz',
      apiDomain: env.API_DOMAIN,
      websiteDomain: env.WEB_DOMAIN,
      apiBasePath: '/auth',
      websiteBasePath: '/auth',
    },
    recipeList: [
      ThirdPartyEmailPassword.init({
        override: {
          functions: originalImplementation => {
            return {
              ...originalImplementation,
              async emailPasswordSignUp(input) {
                const result = await originalImplementation.emailPasswordSignUp(input);

                if (result.status === 'OK') {
                  await UserRoles.addRoleToUser(result.user.id, 'USER');
                }

                return result;
              },
              async thirdPartySignInUp(input) {
                const result = await originalImplementation.thirdPartySignInUp(input);

                if (result.status === 'OK') {
                  await UserRoles.addRoleToUser(result.user.id, 'USER');
                }

                return result;
              },
            };
          },
        },
        providers: [
          // We have provided you with development keys which you can use for testing.
          // IMPORTANT: Please replace them with your own OAuth keys for production use.
          Google({
            clientId: '1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com',
            clientSecret: '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',
          }),
          Github({
            clientId: '467101b197249757c71f',
            clientSecret: 'e97051221f4b6426e8fe8d51486396703012f5bd',
          }),
          Apple({
            clientId: '4398792-io.supertokens.example.service',
            clientSecret: {
              keyId: '7M48Y4RYDL',
              privateKey:
                '-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----',
              teamId: 'YWQCXGJRJL',
            },
          }),
        ],
      }),
      Session.init(),
      UserRoles.init(),
    ],
  });

  await createRoles();

  await app.register(cors, {
    origin: env.WEB_DOMAIN,
    allowedHeaders: ['Content-Type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

  await app.register(formDataPlugin);
  await app.register(supertokensPlugin);
};

export default fp(plugin, {
  name: 'supertokens',
});
