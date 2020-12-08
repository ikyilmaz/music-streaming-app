import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from './../models/user-model/user.model';

/**
 * @description İsteği atan kullanıcıyı almamızı sağlayan decorator AuthRequired Guard'ı kullanılmadan kullanılamaz
 * @param data Verilen alanı geri döner. Örn. id. Opsiyonel
 */
export const CurrentUser = createParamDecorator<keyof User>(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    if (data) return request.user[data];

    return request.user;
  },
);
