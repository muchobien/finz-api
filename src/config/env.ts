import { z } from 'zod';

const envSchema = z.object({
  app: z.enum(['development', 'production', 'test', 'gh-actions']),
  host: z.string().default('0.0.0.0'),
  node: z.enum(['production', 'development']),
  port: z.number().int().nonnegative().lte(65535).default(2202),
  postgresUrl: z.string().min(1),
});

export const env = envSchema.parse({
  app: process.env['APP_ENV'],
  host: process.env['HOST'],
  node: process.env['NODE_ENV'],
  port: process.env['PORT'],
  postgresUrl: process.env['DATABASE_URL'],
});
