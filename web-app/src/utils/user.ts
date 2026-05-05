import { PermissionRoles, Role } from "@/enum";
import { UserRole } from "@/pages/Private/pages/UserRoles/schema/roles";
import { Permission } from "@/pages/Private/pages/Users/schema/permissions";
import { User } from "@/pages/Public/pages/Login/schema/login";
import { ChipsListItem } from "@/schemas/chips";

export const getAllUserPermissions = (role?: UserRole): PermissionRoles[] => {
	if (!role) {
		return [];
	}

	return role.permissions.map((permission) => PermissionRoles[permission.code as PermissionRoles]);
};

export const getDiff = (saved: string[], selected: string[]) => {
	const added = selected.filter((item) => !saved.includes(item));
	const removed = saved.filter((item) => !selected.includes(item));

	return {
		added,
		removed,
	};
};

export const getAllUserRoles = (role: UserRole): ChipsListItem[] => {
	const roleColor = role.code === Role.ADMIN ? "primary" : "info";

	return [{ identifier: role.code, name: role.name, color: roleColor }];
};

export const getUserRolesDiff = (
	userRoles: string[],
	selectedRoles: string[],
	allRoles: UserRole[]
) => {
	const addedRoles: string[] = selectedRoles.filter((role) => !userRoles.includes(role));
	const removedRoles: string[] = userRoles.filter((role) => !selectedRoles.includes(role));

	const addedRolesIds: number[] = addedRoles
		.map((role) => {
			const foundRole = allRoles.find((r) => r.code === role);

			if (foundRole) {
				return foundRole.id;
			}
		})
		.filter(Boolean) as number[];

	const removedRolesIds: number[] = removedRoles
		.map((role) => {
			const foundRole = allRoles.find((r) => r.code === role);

			if (foundRole) {
				return foundRole.id;
			}
		})
		.filter(Boolean) as number[];

	return {
		addedRoleIds: addedRolesIds.map((id) => {
			return { id };
		}),
		removedRoleIds: removedRolesIds.map((id) => {
			return { id };
		}),
	};
};

export const getUserPermissionsDiff = (
	userPermissions: string[],
	selectedPermissions: string[]
) => {
	const addedPermissions: string[] = selectedPermissions.filter(
		(permission) => !userPermissions.includes(permission)
	);
	const removedPermissions: string[] = userPermissions.filter(
		(permission) => !selectedPermissions.includes(permission)
	);

	return {
		addedPermissions,
		removedPermissions,
	};
};

export const getAllRolePermissions = (permissions: Permission[]): ChipsListItem[] => {
	return permissions.map((permission) => {
		return { identifier: permission.code, name: permission.name, color: "primary" };
	});
};

export const isAdmin = (user: User): boolean => {
	if (user.role.code === Role.ADMIN) {
		return true;
	}

	return false;
};

export const hasPermission = (user: User, requiredPermissions: PermissionRoles[]): boolean => {
	const userPermissions = getAllUserPermissions(user?.role ?? "");
	const hasPermission = requiredPermissions.every((permission) =>
		userPermissions.includes(permission)
	);

	return !!hasPermission || false;
};
