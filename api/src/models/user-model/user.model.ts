import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Document } from 'mongoose';
import { UserRoles } from './user.enums';
import { isEmail } from 'class-validator';
import { modelRefs } from '../model-referances';

/**
 * @description Kullanıcı için şema
 * */
@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  collection: modelRefs.user,
})
export class User {
  // CurrentUser dekoratörü için gerekli yoksa id yok diyor
  id?: string;

  /**
   * @description Ad
   */
  @Prop({
    type: SchemaTypes.String,
    required: true,
    lowercase: true,
  })
  firstName!: string;

  /**
   * @description Soyad
   */
  @Prop({
    type: SchemaTypes.String,
    required: true,
    lowercase: true,
  })
  lastName!: string;

  /**
   * @description Yaş
   */
  @Prop({
    type: SchemaTypes.Number,
    required: false,
  })
  age?: number;

  /**
   * @description Profil Fotoğrafı
   */
  @Prop({
    type: SchemaTypes.String,
    required: false,
  })
  profilePhoto?: string;

  /**
   * @description Kullanıcı Rolü
   */
  @Prop({
    type: SchemaTypes.String,
    default: UserRoles.USER,
    enum: Object.keys(UserRoles),
  })
  role?: UserRoles;

  /**
   * @description Kullanıcı adı
   */
  @Prop({
    type: SchemaTypes.String,
    required: true,
    unique: true,
  })
  username!: string;

  /**
   * @description Eposta adresi
   */
  @Prop({
    type: SchemaTypes.String,
    required: false,
    unique: true,
    validate: isEmail,
  })
  email?: string;

  /**
   * @description Şifre Rolü
   */
  @Prop({
    type: SchemaTypes.String,
    required: true,
    // Find query'lerinde password'ü seçmemesi için select: true
    select: false,
  })
  password!: string;

  /**
   * @description Aktiflik
   */
  @Prop({
    type: SchemaTypes.Boolean,
    required: false,
    default: true,
  })
  active?: boolean;

  /**
   * @description Oluşturulma Tarihi
   */
  createdAt?: Date;

  /**
   * @description Güncelleme Tarihi
   */
  updatedAt?: Date;

  // Sanal ilişkiler
  profile?: Profile;
}

export type UserDocument = User &
  Document & {
    /**
     * @description Şifreyi döküman üzerinden hashleyebilmek için bir fonksiyon
     */
    hashPassword?: (password: string) => Promise<string>;
    /**
     * @description Verilen şifre ile hash'i karşılaştıran fonksiyon
     * @param candidatePassword aday
     * @param hashedPassword hash'lenmiş şifre
     */
    comparePasswords?: (
      candidatePassword: string,
      hashedPassword: string,
    ) => Promise<boolean>;
    /**
     * @description Şifre değiştirilmeden önce alınan bir token mi değil mi?
     */
    changedPasswordAfter?: (JWTTimeStamp: string | number) => boolean;
  };
export const UserSchema = SchemaFactory.createForClass(User);

import './user.methods';
import './user.hooks';
import { Profile } from '../profile-model/profile.model';
