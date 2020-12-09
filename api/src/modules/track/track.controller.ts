import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors';
import * as multer from 'multer';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Auth } from 'src/decorators/auth.decorator';
import { APIFeatures } from 'src/utils/api-features';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @UseInterceptors(
    FileInterceptor('track', {
      // Sadece işlem boyunca memory'de kalacak
      storage: multer.memoryStorage(),
      // Gönderilen dosyaları kontrol et
      fileFilter: (req, file, cb) => {
        // Dosya mpeg türünde mi diye kontrol et
        if (file.mimetype === 'audio/mpeg') return cb(null, true);
        // Değilse hata döndür
        cb(new BadRequestException('Lütfen audio/mpeg yükleyiniz'), false);
      },
    }),
  )
  @Auth()
  @Post()
  create(
    @Body() body: CreateTrackDto,
    @UploadedFile() file: Record<string, any>,
    @CurrentUser('id') id: string,
  ) {
    return this.trackService.create(body, file, id);
  }

  @Get()
  async findAll(@Query() query: Record<string, any>) {
    const { total, documentQuery } = await this.trackService.findAll();

    return {
      total,
      data: await new APIFeatures(documentQuery, query).all(),
    };
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.trackService.findOne(id);
  }

  // FIXME: Eklenecek
  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateTrackDto) {
    return this.trackService.update(+id, body);
  }

  // FIXME: Eklenecek
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trackService.remove(+id);
  }
}
