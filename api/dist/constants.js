"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REQUEST_ID_HEADER = exports.ROOT_DIR = exports.BCRYPT_HASH_SALT_ROUNDS = void 0;
const path_1 = require("path");
exports.BCRYPT_HASH_SALT_ROUNDS = 10;
exports.ROOT_DIR = (0, path_1.join)(__dirname, "..");
exports.REQUEST_ID_HEADER = "x-request-id";
//# sourceMappingURL=constants.js.map