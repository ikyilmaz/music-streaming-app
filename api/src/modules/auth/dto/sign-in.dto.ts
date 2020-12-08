import { IsNotEmpty, Length, IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { vldtMsg } from './../../../utils/validation-message';

export class SignInDTO {
	@ApiProperty({
		required: false,
		description: 'Ya kullanıcı adı ya da eposta adresi belirtilmeli, Karakter uzunluğu 6 ve 32 olmalı',
	})
	@IsOptional()
	@IsString({ message: vldtMsg('string') })
	@Length(6, 32, { message: vldtMsg('between 6 and 32 characters') })
	username: string;

	@ApiProperty({
		required: false,
		description: 'Ya kullanıcı adı ya da eposta adresi belirtilmeli, Geçerli bir eposta adresi olmalı',
	})
	@IsOptional()
	@IsString({ message: vldtMsg('string') })
	@IsEmail({}, { message: vldtMsg('a valid email address') })
	email: string;

	@ApiProperty({
		required: true,
		minLength: 8,
		maxLength: 32,
		description: 'Mecburi, Karakter uzunluğu 8 ve 32 olmalı',
	})
	@IsNotEmpty({ message: vldtMsg('defined') })
	@IsString({ message: vldtMsg('string') })
	@Length(8, 32, { message: vldtMsg('between 8 and 32 characters') })
	password!: string;
}
