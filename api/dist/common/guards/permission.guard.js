"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionGuard = void 0;
const common_1 = require("@nestjs/common");
const PermissionGuard = (permissions) => {
    class PermissionGuardMixin {
        canActivate(context) {
            var _a, _b, _c;
            const request = context.switchToHttp().getRequest();
            const { user } = request;
            const userPermissions = (_c = (_b = (_a = user.role) === null || _a === void 0 ? void 0 : _a.permissions) === null || _b === void 0 ? void 0 : _b.map((record) => record.code)) !== null && _c !== void 0 ? _c : [];
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
    return (0, common_1.mixin)(PermissionGuardMixin);
};
exports.PermissionGuard = PermissionGuard;
//# sourceMappingURL=permission.guard.js.map