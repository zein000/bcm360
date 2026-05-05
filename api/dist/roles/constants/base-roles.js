"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPermissionCodes = exports.participantPermissionCodes = void 0;
const codes_1 = require("../../permissions/enum/codes");
exports.participantPermissionCodes = [
    codes_1.PermissionCodes.LOGOUT,
    codes_1.PermissionCodes.PARTICIPANT,
    codes_1.PermissionCodes.GET_ME,
];
exports.userPermissionCodes = [
    codes_1.PermissionCodes.CHANGE_PASSWORD,
    codes_1.PermissionCodes.GET_ME,
    codes_1.PermissionCodes.LOGOUT,
    codes_1.PermissionCodes.DISABLE_2FA,
    codes_1.PermissionCodes.VERIFY_2FA,
    codes_1.PermissionCodes.COURSES,
    codes_1.PermissionCodes.USER,
    codes_1.PermissionCodes.PARTICIPANT,
    codes_1.PermissionCodes.PROTOCOL_WRITER,
];
//# sourceMappingURL=base-roles.js.map