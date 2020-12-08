import { Injectable } from '@nestjs/common';
import { SignUpDTO } from './dto/sign-up.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../models/user-model/user.model';
import { Model } from 'mongoose';
import { UpdateMeDto } from './dto/update-me.dto';

@Injectable()
export class AuthService {
	constructor(@InjectModel(User.name) private readonly $userModel: Model<UserDocument>) {}

	create(data: SignUpDTO): Promise<UserDocument> {
		return this.$userModel.create(data);
	}

	get(identifier: { username: string; email: string }): Promise<UserDocument> {
		const where: Partial<{ username: string; email: string }> = {};

		if (identifier.username) where.username = identifier.username;
		else if (identifier.email) where.email = identifier.email;

		return this.$userModel.findOne(where).select('+password').exec();
	}

	update(id: string, data: UpdateMeDto): Promise<UserDocument> {
		return this.$userModel.findByIdAndUpdate(id, data, { new: true }).exec();
	}

	delete(id: string) {
		return this.$userModel.findByIdAndDelete(id);
	}
}
