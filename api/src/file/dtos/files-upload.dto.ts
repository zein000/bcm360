import { ApiProperty } from "@nestjs/swagger";

export class FilesUploadDto {
  @ApiProperty({
		description: "Upload multiple files. Supports video, image, and PDF types.",
    type: [String],
  })
  files: string[];
}