import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/user-model/user.model';
import { Track, TrackSchema } from 'src/models/track-model/track.model';
import { Album, AlbumSchema } from 'src/models/album-model/album.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Album.name,
        schema: AlbumSchema,
      },
      {
        name: Track.name,
        schema: TrackSchema,
      },
    ]),
  ],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule {}
