import Fastify from 'fastify';
import { env } from '@app/config/env';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import autoLoad from '@fastify/autoload';
import swagger from '@fastify/swagger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = Fastify({
  logger: true,
});

app.register(swagger, {
  routePrefix: '/docs',
})

app.register(autoLoad, {
  dir: join(__dirname, 'plugins'),
  forceESM: true,
  encapsulate: false,
});

app.register(autoLoad, {
  dir: join(__dirname, 'routes'),
  routeParams: true,
});

const start = async () => {
  try {
    await app.listen({ port: env.port, host: env.host });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
