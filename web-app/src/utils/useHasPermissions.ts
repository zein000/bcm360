import { PermissionRoles } from "@/enum";
import { authSelector } from "@/pages/Public/redux/auth.slice";
import { useAppSelector } from "@/redux/hooks";

import { getAllUserPermissions } from "./user";

export const useHasPermissions = () => {
	const { user } = useAppSelector(authSelector);
	const hasPermissions = (requiredPermissions: PermissionRoles[]): boolean => {
		const userPermissions = getAllUserPermissions(user?.role);
		const hasPermission = requiredPermissions.every((permission) =>
			userPermissions.includes(permission)
		);

		return hasPermission;
	};

	return { hasPermissions };
};
