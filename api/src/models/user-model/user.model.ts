/**
 * @description Kullanıcı için şema
 * */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Document } from 'mongoose';
import { UserRoles } from './user.enums';
import { isEmail } from 'class-validator';
import { modelRefs } from '../model-referances';

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
  collection: modelRefs.user,
})
export class User {
  id?: string;

  @Prop({
    type: SchemaTypes.String,
    required: true,
    minlength: 2,
    maxlength: 32,
    lowercase: true,
  })
  firstName!: string;

  @Prop({
    type: SchemaTypes.String,
    required: true,
    minlength: 2,
    maxlength: 32,
    lowercase: true,
  })
  lastName!: string;

  @Prop({
    type: SchemaTypes.String,
    default: UserRoles.EMPLOYEE,
    enum: Object.keys(UserRoles),
  })
  role?: UserRoles;

  @Prop({
    type: SchemaTypes.String,
    required: true,
    unique: true,
    minlength: 6,
    maxlength: 32,
    validate: /^[a-z0-9_]{6,32}$/,
  })
  username!: string;

  @Prop({
    type: SchemaTypes.String,
    required: false,
    unique: true,
    validate: isEmail,
  })
  email?: string;

  @Prop({
    type: SchemaTypes.String,
    required: true,
    minlength: 8,
    maxlength: 32,
    select: false,
  })
  password!: string;

  @Prop({
    type: SchemaTypes.Boolean,
    required: false,
    default: true,
  })
  active?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export type UserDocument = User &
  Document & {
    hashPassword?: (password: string) => Promise<string>;
    comparePasswords?: (
      candidatePassword: string,
      hashedPassword: string,
    ) => Promise<boolean>;
    changedPasswordAfter?: (JWTTimeStamp: string | number) => boolean;
  };
export const UserSchema = SchemaFactory.createForClass(User);

import './user.methods';
import './user.hooks';
