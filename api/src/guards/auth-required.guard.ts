import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user-model/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { verifyJWTToken } from '../utils/token';

@Injectable()
export class AuthRequiredGuard implements CanActivate {
	constructor(
		private readonly $configService: ConfigService,
		@InjectModel(User.name) private readonly $userModel: Model<UserDocument>,
	) {}

	async canActivate(context: ExecutionContext) {
		const req = context.switchToHttp().getRequest<Request>();

		let token;
		if (req.headers?.authorization?.startsWith('Bearer ')) token = req.headers.authorization.split(' ')[1];
		else if (req.cookies?.jwt) token = req.cookies.jwt;

		if (!token) throw new UnauthorizedException();

		const decoded = await verifyJWTToken(token, this.$configService.get('JWT_SECRET_KEY'));

		const currentUser = await this.$userModel.findById(decoded.id).select('+password');

		if (!currentUser) throw new UnauthorizedException('the user belonging to this token does no longer exists');

		if (currentUser.changedPasswordAfter(decoded.iat))
			throw new UnauthorizedException('the user recently changed password, please log in again');

		req.user = currentUser;

		return true;
	}
}
