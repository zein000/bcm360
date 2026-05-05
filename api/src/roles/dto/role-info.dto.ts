import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Type } from "class-transformer";

import { PermissionInfoDTO } from "src/permissions/dto/permission-info.dto";

import RolePermission from "../models/role-permission.model";

import Role from "../models/role.model";

export class RoleInfoDTO implements Partial<Omit<Role, "permissions">> {
	@ApiProperty({ description: "Internal unique identifier for role." })
	id?: number;

	@ApiProperty({ description: "Role's name." })
	name?: string;

	@ApiProperty({ description: "Role's code - the unique identifier." })
	code: string;

	@ApiProperty({ description: "Role's description." })
	description?: string;

	@ApiProperty({ type: PermissionInfoDTO, description: "Role's permissions.", isArray: true })
	@Type(() => PermissionInfoDTO)
	permissions?: PermissionInfoDTO[];

	@Exclude()
	createdAt: Date;

	@Exclude()
	updatedAt: Date;

	@Exclude()
	RolePermission?: RolePermission;

	constructor(data: Role) {
		Object.assign(this, data.dataValues ? data.toJSON() : data);
	}
}
