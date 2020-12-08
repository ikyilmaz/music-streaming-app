import { Injectable, NotFoundException } from '@nestjs/common';
import { SignUpDTO } from './dto/sign-up.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../models/user-model/user.model';
import { Connection, Model } from 'mongoose';
import { UpdateMeDto } from './dto/update-me.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectConnection()
    private readonly $mongooseConnection: Connection,
    @InjectModel(User.name)
    private readonly $userModel: Model<UserDocument>
  ) {}

  async create(data: SignUpDTO): Promise<UserDocument> {
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

  async delete(id: string) {
    const session = await this.$mongooseConnection.startSession();
    await session.withTransaction(async () => {
      const user = await this.$userModel.findOne({ _id: id }).session(session);

      if (!user) throw new NotFoundException();

      await user.remove();
    });

    session.endSession();
  }
}
