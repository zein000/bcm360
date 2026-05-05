"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileTypeToMimetype = void 0;
const FileTypes_enum_1 = require("../enum/FileTypes.enum");
exports.FileTypeToMimetype = {
    "image/jpeg": FileTypes_enum_1.FileTypes.Image,
    "image/png": FileTypes_enum_1.FileTypes.Image,
    "image/gif": FileTypes_enum_1.FileTypes.Image,
    "image/svg+xml": FileTypes_enum_1.FileTypes.Image,
    "application/pdf": FileTypes_enum_1.FileTypes.Text,
    "video/mp4": FileTypes_enum_1.FileTypes.Video,
    "video/avi": FileTypes_enum_1.FileTypes.Video,
    "video/mkv": FileTypes_enum_1.FileTypes.Video,
    "audio/mpeg": FileTypes_enum_1.FileTypes.Audio,
    "audio/wav": FileTypes_enum_1.FileTypes.Audio,
};
//# sourceMappingURL=FileTypeToMimetype.js.map