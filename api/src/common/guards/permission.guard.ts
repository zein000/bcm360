import { CanActivate, ExecutionContext, mixin, Type } from "@nestjs/common";

import RequestWithUser from "src/interfaces/request-with-user.interface";
import { PermissionCodes } from "src/permissions/enum/codes";

export const PermissionGuard = (permissions: PermissionCodes[]): Type<CanActivate> => {
	class PermissionGuardMixin implements CanActivate {
		canActivate(context: ExecutionContext) {
			const request: RequestWithUser = context.switchToHttp().getRequest<RequestWithUser>();
			const { user } = request;

			const userPermissions = user.role?.permissions?.map((record) => record.code) ?? [];

			if (!userPermissions.length) {
				return false;
			}

			for (const permission of permissions) {
				if (!userPermissions.includes(permission)) {
					return false;
				}
			}

			return true;
		}
	}

	return mixin(PermissionGuardMixin);
};
