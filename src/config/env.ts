import { z } from 'zod';

const envSchema = z.object({
  APP_ENV: z.enum(['development', 'production', 'test', 'gh-actions']),
  APP_NAME: z.string().default('finz'),
  HOST: z.string().default('0.0.0.0'),
  NODE_ENV: z.enum(['production', 'development']),
  PORT: z.number().int().nonnegative().lte(65535).default(2202),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  GITHUB_SHA: z.string().min(1).default('unknown'),
  VERSION: z.string().min(1).default('0.0.0-unknown'),
});

export const env = envSchema.parse({
  VERSION: process.env['npm_package_version'],
  ...process.env,
});
