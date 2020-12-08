import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';
import { vldtMsg } from './../../../utils/validation-message';

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'Kullanıcının şu anki şifresi',
    required: true,
    maxLength: 32,
    minLength: 8,
  })
  @Length(8, 32, { message: vldtMsg('8 ve 32 karakter aralığında') })
  @IsNotEmpty({ message: vldtMsg('belirtilmiş') })
  currentPassword!: string;

  @ApiProperty({
    required: true,
    description: 'Kullanıcının oluşturmak istediği yeni şifre',
    maxLength: 32,
    minLength: 8,
  })
  @Length(8, 32, { message: vldtMsg('8 ve 32 karakter aralığında') })
  @IsNotEmpty({ message: vldtMsg('belirtilmiş') })
  newPassword!: string;

  @ApiProperty({
    required: true,
    description: 'Yeni şifre tekrar',
    maxLength: 32,
    minLength: 8,
  })
  @Length(8, 32, { message: vldtMsg('8 ve 32 karakter aralığında') })
  @IsNotEmpty({ message: vldtMsg('belirtilmiş') })
  newPasswordConfirm!: string;
}
