import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";

import { UserInfoDTO } from "src/users/dto/user-info.dto";

import User from "../../users/models/user.model";
import Company from "../models/company.model";

export class CompanyAdminInfoDTO implements Partial<Company> {
	@ApiProperty()
	id: number;

	@ApiProperty()
	name?: string;

	@Exclude()
	@ApiProperty()
	updatedAt?: Date;

	@Exclude()
	@ApiProperty()
	createdAt?: Date;

	@Expose()
	@ApiProperty({ type: UserInfoDTO, isArray: true })
	@Type(() => UserInfoDTO)
	admins?: User[];

	constructor(data: Company) {
		Object.assign(this, data.dataValues ? data.toJSON() : data);
	}
}
