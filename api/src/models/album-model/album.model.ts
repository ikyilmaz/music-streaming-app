import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { modelRefs } from '../model-referances';
import { UserDocument } from '../user-model/user.model';

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
  toObject: { useProjection: true, minimize: false, virtuals: true },
  toJSON: { useProjection: true, minimize: false, virtuals: true },
  collection: modelRefs.album,
})
export class Album {
  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  title!: string;

  @Prop({
    type: SchemaTypes.String,
    required: false,
  })
  coverPhoto?: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    ref: modelRefs.user,
  })
  ownerId: string;

  // Sanal
  owner?: UserDocument;

  @Prop({
    type: [SchemaTypes.ObjectId],
    required: false,
    ref: modelRefs.user,
  })
  featIds?: string[];

  // Sanal
  feats?: UserDocument[];

  @Prop({
    type: SchemaTypes.String,
    required: false,
  })
  desc?: string;
}

export type AlbumDocument = Album & Document;
export const AlbumSchema = SchemaFactory.createForClass(Album);

import './album.virtuals';
