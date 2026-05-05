import { ApiProperty } from "@nestjs/swagger";

export class FileUploadResponseDto {
	@ApiProperty({ description: "Path to file in S3" })
	file: string;
}
