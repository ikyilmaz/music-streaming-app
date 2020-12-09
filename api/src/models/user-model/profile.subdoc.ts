import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

/**
 * @description Kullanıcı Profili için şema
 * */
@Schema({
  _id: false,
})
export class Profile {
  // Biyografi

  @Prop({
    type: SchemaTypes.String,
    required: false,
  })
  bio?: string;

  // Kapak Fotosu
  @Prop({
    type: SchemaTypes.String,
    required: false,
  })
  coverPhoto?: string;
}

export type ProfileSubdocument = Profile & Types.Subdocument;
export const ProfileSchema = SchemaFactory.createForClass(Profile);
