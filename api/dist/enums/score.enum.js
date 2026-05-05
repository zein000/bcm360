"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationScoreTypes = exports.NumbericScoreTypes = exports.ScoreTypes = void 0;
var ScoreTypes;
(function (ScoreTypes) {
    ScoreTypes["TITLE"] = "TITLE";
    ScoreTypes["SENIORITY"] = "SENIORITY";
    ScoreTypes["LOCATION"] = "LOCATION";
    ScoreTypes["COMPANY_LOCATION"] = "COMPANY_LOCATION";
    ScoreTypes["EMPLOYEES"] = "EMPLOYEES";
    ScoreTypes["INDUSTRY"] = "INDUSTRY";
    ScoreTypes["KEYWORDS"] = "KEYWORDS";
    ScoreTypes["NUMBER_IN_LEAD_FILTER"] = "NUMBER_IN_LEAD_FILTER";
})(ScoreTypes || (exports.ScoreTypes = ScoreTypes = {}));
exports.NumbericScoreTypes = [ScoreTypes.EMPLOYEES, ScoreTypes.NUMBER_IN_LEAD_FILTER];
exports.LocationScoreTypes = [ScoreTypes.LOCATION, ScoreTypes.COMPANY_LOCATION];
//# sourceMappingURL=score.enum.js.map