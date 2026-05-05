"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPermission = exports.passwordLength = exports.passwordRegExp = exports.getRandomPassword = exports.getInviteTokenCompareDate = exports.getUserToken = void 0;
const random_utils_1 = require("./random.utils");
const getUserToken = () => {
    return (Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 4));
};
exports.getUserToken = getUserToken;
const getInviteTokenCompareDate = () => {
    const compareDate = new Date();
    const validTokenDaysInterval = 7;
    compareDate.setDate(compareDate.getDate() - validTokenDaysInterval);
    return compareDate;
};
exports.getInviteTokenCompareDate = getInviteTokenCompareDate;
const getRandomPassword = () => {
    return (0, random_utils_1.randomizeArray)(Array.prototype.concat((0, random_utils_1.getRandomDigits)(2), (0, random_utils_1.getRandomChars)(5), (0, random_utils_1.getRandomChars)(1).map((c) => c.toUpperCase()), (0, random_utils_1.getRandomSpecials)(1))).join("");
};
exports.getRandomPassword = getRandomPassword;
exports.passwordRegExp = new RegExp(/(?=[\p{L}\p{N}~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/]+$)^(?=.*[\p{Ll}])(?=.*[\p{Lu}])(?=.*[\p{N}])(?=.*[~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/])(?=.{8,}).*$/u);
exports.passwordLength = 8;
const hasPermission = (user, permission) => {
    if (!user || !user.role) {
        return false;
    }
    const permissions = user.role.permissions.map((p) => p.code);
    return permissions.includes(permission);
};
exports.hasPermission = hasPermission;
//# sourceMappingURL=user.util.js.map