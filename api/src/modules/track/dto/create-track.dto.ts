import {
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { vldtMsg } from 'src/utils/validation-message';
import { Transform } from 'class-transformer';

export class CreateTrackDto {
  @IsNotEmpty({ message: vldtMsg('belirtilmiş') })
  title!: string;

  @IsMongoId({ message: vldtMsg('mongoId') })
  @IsNotEmpty({ message: vldtMsg('belirtilmiş') })
  albumId!: string;

  @Transform((val) => {
    if (typeof val === 'string') return JSON.parse(val);
    return val;
  })
  @IsArray()
  @ArrayMinSize(1, { message: vldtMsg('en az 1 değer içeriyor') })
  @IsMongoId({ message: vldtMsg("mongoId'den oluşan bir array"), each: true })
  @IsOptional()
  featIds?: string[];
}
