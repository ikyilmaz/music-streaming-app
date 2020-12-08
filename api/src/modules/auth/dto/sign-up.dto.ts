import { IsNotEmpty, Length, IsEmail, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { vldtMsg } from './../../../utils/validation-message';

export class SignUpDTO {
	/**@description email field, optional */
	@ApiProperty({ minLength: 2, maxLength: 32, required: true, description: 'Mecburi, Karakter uzunluğu 2 ve 32' })
	@Length(2, 32, { message: vldtMsg('between 2 and 32 characters') })
	@IsString({ message: vldtMsg('string') })
	@IsNotEmpty({ message: vldtMsg('defined') })
	firstName!: string;

	/**@description email field, optional */
	@ApiProperty({ minLength: 2, maxLength: 32, required: true, description: 'Mecburi, Karakter uzunluğu 2 ve 32' })
	@Length(2, 32, { message: vldtMsg('between 2 and 32 characters') })
	@IsString({ message: vldtMsg('string') })
	@IsNotEmpty({ message: vldtMsg('defined') })
	lastName!: string;

	/**@description username field, required */
	@ApiProperty({
		required: true,
		minLength: 6,
		maxLength: 32,
		description: 'Mecburi, Sadece a-z 0-9 _ karakterleri, Karakter uzunluğu 6 ve 32 olmalı',
	})
	@Matches(/^[a-z0-9_]{6,32}$/, { message: vldtMsg('a valid username a-z 0-9 _') })
	@IsString({ message: vldtMsg('string') })
	@IsNotEmpty({ message: vldtMsg('defined') })
	username!: string;

	/**@description email field, required */
	@ApiProperty({ required: false, description: 'Mecburi, Geçerli eposta adresi olmalı' })
	@IsEmail({}, { message: vldtMsg('a valid email address') })
	@IsNotEmpty({ message: vldtMsg('defined') })
	email?: string;

	/**@description password field, required */
	@ApiProperty({ required: true, minLength: 8, maxLength: 32, description: 'Mecburi, Karakter uzunluğu 8 ve 32' })
	@IsString({ message: vldtMsg('string') })
	@Length(8, 32, { message: vldtMsg('between 8 and 32 characters') })
	@IsNotEmpty({ message: vldtMsg('defined') })
	password!: string;
}
