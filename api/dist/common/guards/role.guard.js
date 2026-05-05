"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleGuard = void 0;
const common_1 = require("@nestjs/common");
const RoleGuard = (roles) => {
    class RoleGuardMixin {
        canActivate(context) {
            var _a;
            const request = context.switchToHttp().getRequest();
            const { user } = request;
            if (!user) {
                return false;
            }
            if (!user.role) {
                return false;
            }
            for (const role of roles) {
                if (((_a = user.role) === null || _a === void 0 ? void 0 : _a.code) !== role) {
                    return false;
                }
            }
            return true;
        }
    }
    return (0, common_1.mixin)(RoleGuardMixin);
};
exports.RoleGuard = RoleGuard;
//# sourceMappingURL=role.guard.js.map