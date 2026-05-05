"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const constants_1 = require("../../constants");
const path_1 = require("path");
exports.default = (0, config_1.registerAs)("viewEngine", () => {
    var _a, _b, _c, _d, _e;
    return ({
        partialsDir: (_a = process.env.PARTIALS_DIR) !== null && _a !== void 0 ? _a : (0, path_1.join)(constants_1.ROOT_DIR, "views", "partials"),
        layoutsDir: (_b = process.env.LAYOUTS_DIR) !== null && _b !== void 0 ? _b : (0, path_1.join)(constants_1.ROOT_DIR, "views", "layouts"),
        viewsDir: (_c = process.env.VIEWS_DIR) !== null && _c !== void 0 ? _c : (0, path_1.join)(constants_1.ROOT_DIR, "views"),
        staticAssetsDir: (_d = process.env.STATIC_ASSETS_DIR) !== null && _d !== void 0 ? _d : (0, path_1.join)(constants_1.ROOT_DIR, "public"),
        defaultLayout: (_e = process.env.DEFAULT_LAYOUT) !== null && _e !== void 0 ? _e : "default",
    });
});
//# sourceMappingURL=view-engine.config.js.map