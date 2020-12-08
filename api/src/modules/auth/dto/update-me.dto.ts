import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, Matches } from 'class-validator';
import { vldtMsg } from './../../../utils/validation-message';

export class UpdateMeDto {
  @ApiProperty({
    description: 'Kullanıcının adı',
    required: false,
    maxLength: 32,
    minLength: 2,
  })
  @Length(2, 32, { message: vldtMsg('2 ve 32 karakter aralığında') })
  @IsString({ message: vldtMsg('string') })
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'Kullanıcının soyadı',
    required: false,
    maxLength: 32,
    minLength: 2,
  })
  @Length(2, 32, { message: vldtMsg('2 ve 32 karakter aralığında') })
  @IsString({ message: vldtMsg('string') })
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: 'Kullanıcının kullanıcı adı',
    required: false,
    maxLength: 32,
    minLength: 6,
    format: 'a-z 0-9 _',
  })
  @Matches(/^[a-z0-9_]{6,32}$/, {
    message: vldtMsg(
      'sadece a-z 0-9 _ içeriyor ya da 6 ve 32 karakter aralığında',
    ),
  })
  @IsString({ message: vldtMsg('string') })
  @IsOptional()
  username?: string;
}
