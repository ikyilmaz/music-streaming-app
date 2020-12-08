import {
  IsNotEmpty,
  Length,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { vldtMsg } from './../../../utils/validation-message';

export class SignInDTO {
  @ApiProperty({
    required: false,
    description: 'Ya kullanıcı adı ya da eposta adresi belirtilmeli',
    maxLength: 32,
    minLength: 6,
  })
  @IsString({ message: vldtMsg('string') })
  @Length(6, 32, { message: vldtMsg('6 ve 32 karakter aralığında') })
  @IsOptional()
  username: string;

  @ApiProperty({
    required: false,
    description: 'Ya kullanıcı adı ya da eposta adresi belirtilmeli',
  })
  @IsString({ message: vldtMsg('string') })
  @IsEmail({}, { message: vldtMsg('geçerli bir eposta adresi') })
  @IsOptional()
  email: string;

  @ApiProperty({
    required: true,
    minLength: 8,
    maxLength: 32,
    description: 'Mecburi, Karakter uzunluğu 8 ve 32 olmalı',
  })
  @IsString({ message: vldtMsg('string') })
  @Length(8, 32, { message: vldtMsg('8 ve 32 karakter aralığında') })
  @IsNotEmpty({ message: vldtMsg('belirtilmiş') })
  password!: string;
}
