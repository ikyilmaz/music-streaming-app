import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';
import { vldtMsg } from './../../../utils/validation-message';

export class UpdatePasswordDto {
	@ApiProperty({ required: true, description: 'Mecburi,\n Karakter uzunluğu 8 ve 32 olmalı' })
	@Length(8, 32, { message: vldtMsg('between 8 and 32 characters') })
	@IsNotEmpty({ message: vldtMsg('defined') })
	currentPassword!: string;

	@ApiProperty({ required: true, description: 'Mecburi,\n Karakter uzunluğu 8 ve 32 olmalı' })
	@Length(8, 32, { message: vldtMsg('between 8 and 32 characters') })
	@IsNotEmpty({ message: vldtMsg('defined') })
	newPassword!: string;

	@ApiProperty({ required: true, description: 'Mecburi,\n Karakter uzunluğu 8 ve 32 olmalı' })
	@Length(8, 32, { message: vldtMsg('between 8 and 32 characters') })
	@IsNotEmpty({ message: vldtMsg('defined') })
	newPasswordConfirm!: string;
}
