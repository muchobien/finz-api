import type { FastifyPluginCallback, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import FastifyJWT, {
  type FastifyJwtSignOptions,
  type FastifyJwtVerifyOptions,
  type SignOptions,
  type SignPayloadType,
  type VerifyOptions,
} from '@fastify/jwt';
import type { Role } from '@prisma/client';
import { env } from '@app/config/env.js';

type Payload = {
  id: string;
  role: Role;
};

type VerifyPayload = Payload & {
  iat: number;
  exp: number;
};

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: Payload;
  }
}

declare module 'fastify' {
  interface FastifyReply {
    accessJwtSign(payload: SignPayloadType, options?: FastifyJwtSignOptions): Promise<string>;
    accessJwtSign(payload: SignPayloadType, options?: Partial<SignOptions>): Promise<string>;
    refreshJwtSign(payload: SignPayloadType, options?: FastifyJwtSignOptions): Promise<string>;
    refreshJwtSign(payload: SignPayloadType, options?: Partial<SignOptions>): Promise<string>;
  }

  interface FastifyRequest {
    accessJwtVerify<Decoded extends VerifyPayload>(options?: FastifyJwtVerifyOptions): Promise<Decoded>;
    accessJwtVerify<Decoded extends VerifyPayload>(options?: Partial<VerifyOptions>): Promise<Decoded>;
    refreshJwtVerify<Decoded extends VerifyPayload>(options?: FastifyJwtVerifyOptions): Promise<Decoded>;
    refreshJwtVerify<Decoded extends VerifyPayload>(options?: Partial<VerifyOptions>): Promise<Decoded>;
  }
}

const extractToken = (req: FastifyRequest) => {
  const header = req.headers['x-refresh-token'];
  if (Array.isArray(header) || header === undefined) {
    return undefined;
  }
  return header.replace(/^Bearer\s/, '');
};

const plugin: FastifyPluginCallback = async app => {
  app.register(FastifyJWT, {
    secret: env.JWT_ACCESS_SECRET,
    namespace: 'access',
    sign: {
      expiresIn: '1 week',
    },
  });

  app.register(FastifyJWT, {
    secret: env.JWT_REFRESH_SECRET,
    namespace: 'refresh',
    sign: {
      expiresIn: '4 weeks',
    },
    verify: {
      extractToken,
    },
  });
};

export default fp(plugin, {
  name: 'jwt',
});
