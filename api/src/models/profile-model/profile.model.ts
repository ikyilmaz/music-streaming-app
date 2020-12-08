import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { modelRefs } from '../model-referances';

/**
 * @description Kullanıcı Profili için şema
 * */
@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  collection: modelRefs.profile,
})
export class Profile {
  @Prop({
    type: SchemaTypes.String,
    required: false,
  })
  bio?: string;

  @Prop({
    type: SchemaTypes.String,
    required: false,
  })
  coverPhoto?: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    ref: modelRefs.user,
    // Her kullanıcının bir adet profili olabilir
    unique: true,
  })
  ownerId: string;

  /**
   * @description Oluşturulma Tarihi
   */
  createdAt?: Date;

  /**
   * @description Güncelleme Tarihi
   */
  updatedAt?: Date;
}

export type ProfileDocument = Profile & Document;
export const ProfileSchema = SchemaFactory.createForClass(Profile);
