import Fastify from 'fastify';
import { env } from '@app/config/env';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import autoLoad from '@fastify/autoload';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = Fastify({
  logger:
    env.APP_ENV === 'development'
      ? {
          transport: {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          },
        }
      : true,
});

app.register(autoLoad, {
  dir: join(__dirname, 'plugins'),
  forceESM: true,
  encapsulate: false,
});

const start = async () => {
  try {
    const address = await app.listen({ port: env.PORT, host: env.HOST });
    app.log.info(`Graphiql listen at ${address}/graphiql`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
