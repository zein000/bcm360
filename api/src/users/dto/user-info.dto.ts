import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";

import { RoleInfoDTO } from "src/roles/dto/role-info.dto";

import { UserLanguage } from "src/enums/user.enum";

import { CompanyInfoDTO } from "../../company/dto/company-info.dto";
import { UserStatus } from "../../enums/user-status.enum";

import User from "../models/user.model";

@Exclude()
export class UserInfoDTO implements Partial<Omit<User, "company" | "role">> {
	@ApiProperty({ description: "Internal unique identifier for admin." })
	@Expose()
	id?: number;

	@ApiProperty({ description: "User's first name." })
	@Expose()
	firstName?: string;

	@ApiProperty({ description: "User's last name." })
	@Expose()
	lastName?: string;

	@ApiProperty({ description: "User's language." })
	@Expose()
	userLanguage?: UserLanguage;

	@ApiProperty({ description: "User's email." })
	@Expose()
	email?: string;

	@ApiProperty({ description: "User's useragent." })
	@Expose()
	customUa?: string;

	@ApiProperty({ description: "User's linkedinUrl." })
	@Expose()
	linkedinUrl?: string;

	@ApiProperty({ description: "Is user blocked." })
	@Expose()
	isBlocked?: boolean;

	@ApiProperty({ description: "Linkedin autoAccept." })
	@Expose()
	autoAccept?: boolean;


	@ApiProperty({ description: "Current user status" })
	@Expose()
	status?: UserStatus;

	@ApiProperty({ type: () => RoleInfoDTO, description: "User's role." })
	@Type(() => RoleInfoDTO)
	@Expose()
	role?: RoleInfoDTO;

	@ApiProperty({ type: () => CompanyInfoDTO })
	@Expose()
	company?: CompanyInfoDTO;

	@ApiProperty({ description: "Is 2fa enabled." })
	@Expose()
	is2FAEnabled?: boolean;

	@ApiProperty({ description: "apiKey for authorization" })
	@Expose()
	apiKey?: string;

	@ApiProperty({ description: "courseProgressId for participants" })
	@Expose()
	courseProgressId?: string;

	constructor(data: User) {
		let company;
		if(data?.dataValues?.company || data?.company) {
			company = new CompanyInfoDTO(data?.dataValues?.company || data?.company);
	
			if (data?.dataValues) {
				data.dataValues.company = company;
			}
		}

		Object.assign(
			this,
			data.dataValues
				? data.toJSON()
				: {
						...data,
						company: company ? company : undefined,
					}
		);
	}
}
