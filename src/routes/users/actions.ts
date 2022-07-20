import type { Prisma } from '@prisma/client';
import type { FastifyPluginCallback, RequestGenericInterface } from 'fastify';

interface Post extends RequestGenericInterface {
  Body: Prisma.UserCreateInput;
}

const users: FastifyPluginCallback = async app => {
  app.post<Post>('/', async req => {
    const user = await req.prisma.user.create({
      data: req.body,
    });

    return user;
  });
};

export default users;
