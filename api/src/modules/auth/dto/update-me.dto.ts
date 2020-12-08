import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, Matches } from 'class-validator';
import { vldtMsg } from './../../../utils/validation-message';

export class UpdateMeDto {
	/**@description email field, optional */
	@ApiProperty({
		minLength: 2,
		maxLength: 32,
		required: false,
		description: 'Opsiyonel, Karakter uzunluğu 2 ve 32 arasında olmalı',
	})
	@Length(2, 32, { message: vldtMsg('between 2 and 32 characters') })
	@IsString({ message: vldtMsg('string') })
	@IsOptional()
	firstName!: string;

	/**@description email field, optional */
	@ApiProperty({
		minLength: 2,
		maxLength: 32,
		required: false,
		description: 'Opsiyonel, Karakter uzunluğu 2 ve 32 arasında olmalı',
	})
	@Length(2, 32, { message: vldtMsg('between 2 and 32 characters') })
	@IsString({ message: vldtMsg('string') })
	@IsOptional()
	lastName!: string;

	/**@description username field, required */
	@ApiProperty({
		required: false,
		minLength: 6,
		maxLength: 32,
		description: 'Opsiyonel, Sadece a-z 0-9 _ karakterleri, Karakter uzunluğu 6 ve 32 arasında olmalı',
	})
	@Matches(/^[a-z0-9_]{6,32}$/, { message: vldtMsg('a valid username a-z 0-9 _') })
	@IsString({ message: vldtMsg('string') })
	@IsOptional()
	username!: string;
}
