import { db } from '@app/db.js';
import type { FastifyPluginCallback } from 'fastify';

const plugin: FastifyPluginCallback = async app => {
  app.get('/liveness', () => {
    return {
      up: true,
    };
  });

  app.get('/readiness', async (_, res) => {
    try {
      await db.$queryRaw`SELECT 1`;
      return {
        up: true,
        db: true,
      };
    } catch (error) {
      res.status(503);
      return {
        up: true,
        db: false,
      };
    }
  });
};

export default plugin;
