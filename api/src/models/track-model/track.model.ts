import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { AlbumDocument } from '../album-model/album.model';
import { modelRefs } from '../model-referances';
import { UserDocument } from '../user-model/user.model';

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
  toObject: { useProjection: true, minimize: false, virtuals: true },
  toJSON: { useProjection: true, minimize: false, virtuals: true },
  collection: modelRefs.track,
})
export class Track {
  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  title!: string;

  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  track!: string;

  @Prop({
    type: SchemaTypes.Number,
    required: true,
  })
  duration!: number;

  // FIXME: Eklenecek
  // @Prop({
  //   type: SchemaTypes.ObjectId,
  //   required: true,
  //   ref: modelRefs.genre
  // })
  // genreId!: string;

  @Prop({
    type: SchemaTypes.Number,
    default: 0,
  })
  listenCount?: number;

  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    ref: modelRefs.album,
  })
  albumId!: string;

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

export type TrackDocument = Track & Document;
export const TrackSchema = SchemaFactory.createForClass(Track);

import './track.virtuals';
