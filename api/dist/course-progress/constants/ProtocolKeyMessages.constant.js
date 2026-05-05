"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolKeyMessages = void 0;
const AdditionalStatusInfoTags_enum_1 = require("../enum/AdditionalStatusInfoTags.enum");
exports.ProtocolKeyMessages = {
    [AdditionalStatusInfoTags_enum_1.AdditionalStatusInfoTags.TIMEUP]: "Die Zeit ist um",
    [AdditionalStatusInfoTags_enum_1.AdditionalStatusInfoTags.SUCCESS]: "Erfolg",
    [AdditionalStatusInfoTags_enum_1.AdditionalStatusInfoTags.FAILURE]: "Versagen",
    "requested-spoiler": "Angeforderte Hilfe für Phase {{phaseNumber}}",
    "invited-users": "Eingeladen {{usersString}}",
    "user-joined": "Sie haben die Einladung angenommen und sind dem Szenario beigetreten.",
    "removed-user": "{{userData}} aus dem Szenario entfernt",
};
//# sourceMappingURL=ProtocolKeyMessages.constant.js.map