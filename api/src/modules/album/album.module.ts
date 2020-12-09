import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, AlbumSchema } from 'src/models/album-model/album.model';
import { User, UserSchema } from 'src/models/user-model/user.model';
import { Track, TrackSchema } from 'src/models/track-model/track.model';

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
        schema: TrackSchema
      }
    ]),
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
