import { env } from '@app/config/env';
import type { FastifyPluginCallback } from 'fastify';

const plugin: FastifyPluginCallback = async app => {
  // Status/health endpoint
  app.get('/healthz', () => {
    return {
      env: env.APP_ENV,
      sha: env.GITHUB_SHA,
      up: true,
      version: env.VERSION,
    };
  });
};

export default plugin;
