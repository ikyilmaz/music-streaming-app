import { ValidationArguments } from 'class-validator';

export const vldtMsg = (message: string) => (args: ValidationArguments) =>
	`alan '${args.property}' ${message} olmalı`;
