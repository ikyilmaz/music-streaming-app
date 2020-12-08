import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class RestrictToGuard implements CanActivate {
	constructor(private readonly $reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const req = context.switchToHttp().getRequest<Request>();
		const roles = this.$reflector.get<string[]>('roles', context.getHandler());

		return roles.includes(req.user.role);
	}
}
