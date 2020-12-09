import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { Album, AlbumDocument } from 'src/models/album-model/album.model';
import { Track, TrackDocument } from 'src/models/track-model/track.model';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import * as sharp from 'sharp';
import { User, UserDocument } from 'src/models/user-model/user.model';

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(Album.name) private readonly $albumModel: Model<AlbumDocument>,
    @InjectModel(User.name) private readonly $userModel: Model<UserDocument>,
    @InjectModel(Track.name) private readonly $trackModel: Model<TrackDocument>,
  ) {}

  async create(
    data: CreateAlbumDto,
    file: Record<string, any>,
    ownerId: string,
  ) {
    file.filename = `album-${ownerId}-${moment().unix()}.jpeg`;

    await sharp(file.buffer as Buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(
        `${__dirname}/../../../public/assets/img/album-images/${file.filename}`,
      );

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

    return this.$albumModel.create({
      ...data,
      ownerId,
      coverPhoto: file.filename,
    });
  }

  async findAll() {
    const total = await this.$albumModel.estimatedDocumentCount();

    const documentQuery = this.$albumModel
      .find()
      .populate('owner', '_id firstName lastName username');

    return { total, documentQuery };
  }

  findOne(id: string) {
    return this.$albumModel
      .findById(id)
      .populate('owner', '_id firstName lastName username');
  }

  update(id: number, updateAlbumDto: UpdateAlbumDto) {
    return `This action updates a #${id} album`;
  }

  remove(id: number) {
    return `This action removes a #${id} album`;
  }
}
