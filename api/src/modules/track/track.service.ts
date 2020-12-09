import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { writeFile } from 'fs/promises';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { Album, AlbumDocument } from 'src/models/album-model/album.model';
import { Track, TrackDocument } from 'src/models/track-model/track.model';
import { User, UserDocument } from 'src/models/user-model/user.model';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(User.name) private readonly $userModel: Model<UserDocument>,
    @InjectModel(Track.name) private readonly $trackModel: Model<TrackDocument>,
    @InjectModel(Album.name) private readonly $albumModel: Model<AlbumDocument>,
  ) {}

  async create(
    data: CreateTrackDto,
    file: Record<string, any>,
    ownerId: string,
  ) {
    const album = await this.$albumModel.findById(data.albumId);

    if (!album) throw new NotFoundException("alan 'albumId' bulunamadı");

    if (album.ownerId.toString() !== ownerId.toString())
      throw new ForbiddenException('albümün sahibi sen değilsin');

    const feats = await this.$userModel.countDocuments({
      _id: { $in: data.featIds },
    });

    if (data.featIds && feats !== data.featIds.length)
      throw new BadRequestException(
        "alan 'featIds' bulunan kullanıcı id'leri içeriyor olmalı",
      );

    data.featIds?.forEach((featId) => {
      if (featId === ownerId)
        throw new BadRequestException('kendini feat olarak ekleyemezsin');
    });

    file.filename = `track-${ownerId}-${moment().unix()}-${Math.random()}.mp3`;

    await writeFile(
      `${__dirname}/../../../public/assets/audio/tracks/${file.filename}`,
      file.buffer as Buffer,
    );

    return this.$trackModel.create({
      ...data,
      ownerId,
      track: file.filename,
      duration: 120, // FIXME: dosyaya göre verilecek
    });
  }

  async findAll() {
    const total = await this.$trackModel.estimatedDocumentCount();

    const documentQuery = this.$trackModel
      .find()
      .populate('owner', '_id firstName lastName username');

    return { total, documentQuery };
  }

  findOne(id: string) {
    return this.$trackModel
      .findById(id)
      .populate('owner', '_id firstName lastName username');
  }

  update(id: number, data: UpdateTrackDto) {
    return `This action updates a #${id} track`;
  }

  remove(id: number) {
    return `This action removes a #${id} track`;
  }
}
