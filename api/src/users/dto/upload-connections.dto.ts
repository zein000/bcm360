import { ApiProperty } from "@nestjs/swagger";

export class UploadConnectionsDto {
	@ApiProperty({ type: "string", format: "binary" })
	file: Express.Multer.File;
}
