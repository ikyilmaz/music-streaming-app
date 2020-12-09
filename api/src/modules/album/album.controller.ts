import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { Auth } from 'src/decorators/auth.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { APIFeatures } from 'src/utils/api-features';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import * as multer from 'multer';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @UseInterceptors(
    FileInterceptor('coverPhoto', {
      // Sadece işlem boyunca memory'de kalacak
      storage: multer.memoryStorage(),
      // Gönderilen dosyaları kontrol et
      fileFilter: (req, file, cb) => {
        // Kapak fotoğrafı resim mi diye kontrol et
        if (file.mimetype.startsWith('image')) return cb(null, true);
        // Değilse hata döndür
        cb(new BadRequestException('Lütfen resim yükleyiniz'), false);
      },
    }),
  )
  @Auth()
  @Post()
  create(
    @Body() body: CreateAlbumDto,
    @UploadedFile() file: Record<string, any>,
    @CurrentUser('id') id: string,
  ) {
    return this.albumService.create(body, file, id);
  }

  @Get()
  async findAll(@Query() query: Record<string, any>) {
    const { total, documentQuery } = await this.albumService.findAll();

    return {
      total,
      data: await new APIFeatures(documentQuery, query).all(),
    };
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.albumService.findOne(id);
  }

  // FIXME: Eklenecek
  @Auth()
  @Put(':id')
  update(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    // return this.albumService.update(id, updateAlbumDto);
  }

  // FIXME: Eklenecek
  @Delete(':id')
  remove(@Param('id') id: string) {
    // return this.albumService.remove(id);
  }
}
