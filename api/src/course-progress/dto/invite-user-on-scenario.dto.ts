import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
    IsArray,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MinLength,
} from "class-validator";
import { PermissionCodes } from "src/permissions/enum/codes";

export class InviteUserOnScenarioDTO {
    @ApiProperty({ description: "User's email" })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @Transform((param) => param.value.toLowerCase())
    email: string;

    @ApiProperty({ description: "User's first name" })
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @IsOptional()
    firstName: string;

    @ApiProperty({ description: "User's last name" })
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @IsOptional()
    lastName: string;

    @ApiProperty({ description: "Array of permissions" })
    @IsArray()
    @IsEnum(PermissionCodes, { each: true })
    permissions: PermissionCodes[];
}
