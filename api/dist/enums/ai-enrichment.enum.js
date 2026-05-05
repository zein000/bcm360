"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiEnrichmentTarget = exports.PromptType = exports.PromptRole = void 0;
var PromptRole;
(function (PromptRole) {
    PromptRole["HUMAN"] = "HUMAN";
    PromptRole["GPTSYSTEM"] = "GPTSYSTEM";
    PromptRole["AI"] = "AI";
})(PromptRole || (exports.PromptRole = PromptRole = {}));
var PromptType;
(function (PromptType) {
    PromptType["EMAIL"] = "EMAIL";
    PromptType["SUBJECT"] = "SUBJECT";
})(PromptType || (exports.PromptType = PromptType = {}));
var AiEnrichmentTarget;
(function (AiEnrichmentTarget) {
    AiEnrichmentTarget["ACCOUNT"] = "ACCOUNT";
    AiEnrichmentTarget["CONTACT"] = "CONTACT";
    AiEnrichmentTarget["NORTHDATA"] = "NORTHDATA";
})(AiEnrichmentTarget || (exports.AiEnrichmentTarget = AiEnrichmentTarget = {}));
//# sourceMappingURL=ai-enrichment.enum.js.map