import { ValidationArguments } from 'class-validator';

export const vldtMsg = (message: string) => (args: ValidationArguments) =>
	`field '${args.property}' must be ${message}`;
