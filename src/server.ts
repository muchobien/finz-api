import { createYoga } from 'graphql-yoga';
import { schema } from '@app/schema/index.js';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import autoLoad from '@fastify/autoload';
import { tracingPlugin } from '@app/utils/tracing.js';
import { env } from '@app/config/env.js';
import { app } from '@app/app.js';
import type { Context } from '@app/types/context';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.register(autoLoad, {
  dir: join(__dirname, 'plugins'),
  forceESM: true,
  encapsulate: false,
});

const yoga = createYoga<Context>({
  logging: {
    debug: (...args) => args.forEach(arg => app.log.debug(arg)),
    info: (...args) => args.forEach(arg => app.log.info(arg)),
    warn: (...args) => args.forEach(arg => app.log.warn(arg)),
    error: (...args) => args.forEach(arg => app.log.error(arg)),
  },
  schema,
  plugins: [tracingPlugin],
});

app.route({
  url: '/graphql',
  method: ['GET', 'POST', 'OPTIONS'],
  async handler(req, reply) {
    const response = await yoga.handleNodeRequest(req, {
      req,
      reply,
      currentUser: () => req.user.id,
    });
    response.headers.forEach((value, key) => {
      reply.header(key, value);
    });

    reply.status(response.status);

    reply.send(response.body);

    return reply;
  },
});

app.listen({ host: env.HOST, port: env.PORT });
