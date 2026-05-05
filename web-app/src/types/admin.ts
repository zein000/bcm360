import { User } from "@/pages/Public/pages/Login/schema/login";
import { UpdateUserRoles } from "@/pages/Private/pages/Users/schema/update-user";
import { Permission, UpdateRolePermissions } from "@/pages/Private/pages/Users/schema/permissions";
import { UpdateRole, UserRole } from "@/pages/Private/pages/UserRoles/schema/roles";

import { MetaData } from "./meta-data";

export interface GetAllUsersResponse {
	data: User[];
	meta: MetaData;
}

export interface GetAllRolesResponse {
	data: UserRole[];
	meta: MetaData;
}

export interface UpdateUserBody {
	id: number;
	body: {
		firstName?: string;
		lastName?: string;
		email?: string;
		isBlocked?: boolean;
	};
}

export interface UpdateUserRoleBody {
	id: number;
	body: UpdateUserRoles;
}

export interface UpdateRoleBody {
	id: number;
	body: UpdateRole;
}

export type UpdateRolePermissionsBody = {
	id: number;
	body: UpdateRolePermissions;
};

export interface GetAllPermissionsResponse {
	data: Permission[];
	meta: MetaData;
}
