import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { modelRefs } from '../model-referances';

/**
 * @description Kullanıcı Profili için şema
 * */
@Schema({
  _id: false,
  collection: modelRefs.profile,
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
