import type { Prisma } from '@prisma/client';
import type { FastifyPluginCallback } from 'fastify';

type Get = {
  Params: { id: string };
};

type Delete = {
  Params: { id: string };
};

type Update = {
  Params: { id: string };
  Body: Prisma.UserUpdateInput;
};

const users: FastifyPluginCallback = async app => {
  app.get<Get>('/', async req => {
    return req.prisma.user.findUniqueOrThrow({
      where: { id: req.params.id },
    });
  });

  app.put<Update>('/', async req => {
    const user = await req.prisma.user.update({
      where: { id: req.params.id },
      data: req.body,
    });

    return user;
  });

  app.delete<Delete>('/', async req => {
    return req.prisma.user.delete({
      where: { id: req.params.id },
    });
  });
};

export default users;
