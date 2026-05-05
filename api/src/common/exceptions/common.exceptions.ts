import { HttpException, HttpStatus } from "@nestjs/common";

export const generateNotFoundException = (entity: string) => {
	throw new HttpException(
		{
			statusCode: HttpStatus.NOT_FOUND,
			message: `${entity} not found.`,
		},
		HttpStatus.NOT_FOUND
	);
};

export const generateServiceNotFoundException = () => {
	throw new HttpException(
		{
			statusCode: HttpStatus.NOT_FOUND,
			message: "NOT_FOUND",
		},
		HttpStatus.NOT_FOUND
	);
};

export const generateDuplicateException = (entity: string) => {
	throw new HttpException(
		{
			statusCode: HttpStatus.BAD_REQUEST,
			message: `${entity} already exists.`,
		},
		HttpStatus.BAD_REQUEST
	);
};

export const unsupportedFileFormatException = () => {
	throw new HttpException(
		{
			statusCode: HttpStatus.BAD_REQUEST,
			message: "File format is not supported.",
		},
		HttpStatus.BAD_REQUEST
	);
};

export const incorrectFileFormatException = (formats) => {
	throw new HttpException(
		{
			statusCode: HttpStatus.BAD_REQUEST,
			message: `File format must be one of: ${formats}.`,
		},
		HttpStatus.BAD_REQUEST
	);
};

export const generateUnauthorizedNamedException = (message: string) => {
	throw new HttpException(
		{
			statusCode: HttpStatus.UNAUTHORIZED,
			message: message,
		},
		HttpStatus.UNAUTHORIZED
	);
};
export const generateUnauthorizedException = () => {
	throw new HttpException(
		{
			statusCode: HttpStatus.UNAUTHORIZED,
			message: "Unauthorized.",
		},
		HttpStatus.UNAUTHORIZED
	);
};

export const generateMissingParamsException = () => {
	throw new HttpException(
		{
			statusCode: HttpStatus.BAD_REQUEST,
			message: "Missing parameters.",
		},
		HttpStatus.BAD_REQUEST
	);
};

export const generateBadRequestException = (message) => {
	throw new HttpException(
		{
			statusCode: HttpStatus.BAD_REQUEST,
			message,
		},
		HttpStatus.BAD_REQUEST
	);
};
