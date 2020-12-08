import {
  IsNotEmpty,
  Length,
  IsEmail,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { vldtMsg } from './../../../utils/validation-message';

export class SignUpDTO {
  @ApiProperty({
    description: 'Kullanıcının adı',
    required: true,
    maxLength: 32,
    minLength: 2,
  })
  @Length(2, 32, { message: vldtMsg('2 ve 32 karakter aralığında') })
  @IsString({ message: vldtMsg('string') })
  @IsNotEmpty({ message: vldtMsg('belirtilmiş') })
  firstName!: string;

  @ApiProperty({
    description: 'Kullanıcının soyadı',
    required: true,
    maxLength: 32,
    minLength: 2,
  })
  @Length(2, 32, { message: vldtMsg('2 ve 32 karakter aralığında') })
  @IsString({ message: vldtMsg('string') })
  @IsNotEmpty({ message: vldtMsg('belirtilmiş') })
  lastName!: string;

  @ApiProperty({
    description: 'Kullanıcının kullanıcı adı',
    required: true,
    maxLength: 32,
    minLength: 6,
  })
  @Matches(/^[a-z0-9_]{6,32}$/, {
    message: vldtMsg(
      'sadece a-z 0-9 _ içeriyor ya da 6 ve 32 karakter aralığında',
    ),
  })
  @IsString({ message: vldtMsg('string') })
  @IsNotEmpty({ message: vldtMsg('belirtilmiş') })
  username!: string;

  @ApiProperty({
    description: 'Kullanıcının eposta adresi',
    required: true,
    format: 'eposta',
  })
  @IsEmail({}, { message: vldtMsg('geçerli bir eposta adresi') })
  @IsNotEmpty({ message: vldtMsg('belirtilmiş') })
  email!: string;

  @ApiProperty({
    description: 'Kullanıcının şifresi',
    required: true,
    maxLength: 32,
    minLength: 8,
  })
  @IsString({ message: vldtMsg('string') })
  @Length(8, 32, { message: vldtMsg('8 ve 32 karakter aralığında') })
  @IsNotEmpty({ message: vldtMsg('belirtilmiş') })
  password!: string;
}
