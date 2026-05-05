import { CanActivate, ExecutionContext, mixin, Type } from "@nestjs/common";

import { ERole } from "src/enums/role.enum";
import RequestWithUser from "src/interfaces/request-with-user.interface";

export const RoleGuard = (roles: ERole[]): Type<CanActivate> => {
	class RoleGuardMixin implements CanActivate {
		canActivate(context: ExecutionContext) {
			const request: RequestWithUser = context.switchToHttp().getRequest<RequestWithUser>();
			const { user } = request;

			if (!user) {
				return false;
			}

			if (!user.role) {
				return false;
			}

			for (const role of roles) {
				if (user.role?.code !== role) {
					return false;
				}
			}

			return true;
		}
	}

	return mixin(RoleGuardMixin);
};
