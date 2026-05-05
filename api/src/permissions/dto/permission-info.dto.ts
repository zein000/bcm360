import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Type } from "class-transformer";

import { RoleInfoDTO } from "src/roles/dto/role-info.dto";

import RolePermission from "../../roles/models/role-permission.model";

import Permission from "../models/permission.model";

export class PermissionInfoDTO implements Partial<Omit<Permission, "roles">> {
	@ApiProperty({ description: "Internal unique identifier for permission." })
	id?: number;

	@ApiProperty({ description: "Permission's name." })
	name?: string;

	@ApiProperty({ description: "Permission's code - the unique identifier." })
	code?: string;

	@ApiProperty({ description: "Permission's description." })
	description?: string;

	@Exclude()
	createdAt: Date;

	@Exclude()
	updatedAt: Date;

	@ApiProperty({
		type: RoleInfoDTO,
		isArray: true,
		description: "Roles that use this permission.",
	})
	@Type(() => RoleInfoDTO)
	roles?: RoleInfoDTO[];

	@Exclude()
	RolePermission?: RolePermission;

	constructor(data: Permission) {
		Object.assign(this, data.dataValues ? data.toJSON() : data);
	}
}
