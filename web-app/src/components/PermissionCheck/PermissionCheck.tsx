import { FunctionComponent, ReactElement } from "react";

import { ErrorPageType, PermissionRoles } from "@/enum";
import { useAppSelector } from "@/redux/hooks";
import { authSelector } from "@/pages/Public/redux/auth.slice";
import { getAllUserPermissions } from "@/utils";

import { ErrorPage } from "../ErrorPage/ErrorPage";

interface PermissionCheckProps {
	children: ReactElement;
	requiredPermissions: PermissionRoles[];
	deniedPermissions?: PermissionRoles[];
	redirect?: boolean;
}

export const PermissionCheck: FunctionComponent<PermissionCheckProps> = ({
	children,
	requiredPermissions,
	deniedPermissions = [],
	redirect,
}) => {
	const { user } = useAppSelector(authSelector);

	const userPermissions = getAllUserPermissions(user?.role);
	const hasPermission = requiredPermissions.every((permission) =>
		userPermissions.includes(permission)
	);
	const hasDeniedPermission = deniedPermissions?.length
		? deniedPermissions.some((permission) => userPermissions.includes(permission))
		: false;

	return hasPermission && !hasDeniedPermission ? (
		children
	) : redirect ? (
		<ErrorPage type={ErrorPageType.Forbidden} />
	) : null;
};
