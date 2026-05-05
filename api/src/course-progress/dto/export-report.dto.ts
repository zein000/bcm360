import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { ExportFileTypes } from "../enum/ExportFileTypes.enum";
import { ExportFormat } from "../enum/ExportFormat.enum";

export class ExportScenarioReportDto {
    @ApiProperty({ description: "File type" })
    @IsNotEmpty()
    @IsEnum(ExportFileTypes)
    fileType: ExportFileTypes;

    @ApiProperty({ description: "Export format" })
    @IsNotEmpty()
    @IsEnum(ExportFormat)
    format: ExportFormat;
}