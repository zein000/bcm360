import { ApiProperty } from "@nestjs/swagger";

import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

import { Transform } from "class-transformer";

import { normalizeLinkedinUrl } from "src/common/normaliseLinkedinUrl";

import { YearlyOrMonthly } from "src/enums/company.enum";

import Company from "../models/company.model";

export class CreateCompanyDTO implements Partial<Company> {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	name: string;
}
