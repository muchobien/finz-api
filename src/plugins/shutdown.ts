import type { FastifyPluginCallback } from "fastify";

const plugin: FastifyPluginCallback = async app => {
  process.on('SIGINT', () => app.close());
  process.on('SIGTERM', () => app.close());
};

export default plugin;
