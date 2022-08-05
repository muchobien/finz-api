import { z } from 'zod';

const envSchema = z.object({
  APP_ENV: z.enum(['development', 'production', 'test', 'gh-actions']),
  HOST: z.string().default('0.0.0.0'),
  NODE_ENV: z.enum(['production', 'development']),
  PORT: z.number().int().nonnegative().lte(65535).default(2202),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  GITHUB_SHA: z.string().min(1).default('unknown'),
  VERSION: z.string().min(1).default('0.0.0-unknown'),
  API_DOMAIN: z.string().min(1).default('http://127.0.0.1:2202'),
  WEB_DOMAIN: z.string().min(1).default('http://127.0.0.1:3000'),
  SUPERTOKENS_CONNECTION_URI: z.string().min(1),
});

export const env = envSchema.parse({
  VERSION: process.env['npm_package_version'],
  ...process.env,
});
