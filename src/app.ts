import fastify from 'fastify';
import { env } from '@app/config/env.js';

export const app = fastify({
  logger:
    env.APP_ENV === 'development'
      ? {
          transport: {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
              colorize: true,
            },
          },
        }
      : true,
});

export const log = app.log;
