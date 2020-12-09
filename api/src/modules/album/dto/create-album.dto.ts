import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsJSON,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { vldtMsg } from 'src/utils/validation-message';

export class CreateAlbumDto {
  @Length(1, 128, { message: vldtMsg('1 ve 128 karakter aralığında') })
  @IsString({ message: vldtMsg('string') })
  @IsNotEmpty({ message: vldtMsg('belirtilmiş') })
  title!: string;

  @Transform((val) => {
    if (typeof val === 'string') return JSON.parse(val);
    return val;
  })
  @IsArray()
  @ArrayMinSize(1, { message: vldtMsg('en az 1 değer içeriyor') })
  @IsMongoId({ message: vldtMsg("mongoId'den oluşan bir array"), each: true })
  @IsOptional()
  featIds?: string[];

  @Length(1, 256, { message: vldtMsg('1 ve 256 karakter aralığında') })
  @IsString({ message: vldtMsg('string') })
  @IsOptional()
  desc?: string;
}
