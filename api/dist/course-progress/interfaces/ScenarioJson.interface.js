"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMPTY_COURSE_SCENARIO = exports.DecisionConfirmationTypes = void 0;
const FileTypes_enum_1 = require("../../file/enum/FileTypes.enum");
const Status_1 = require("../enum/Status");
var DecisionConfirmationTypes;
(function (DecisionConfirmationTypes) {
    DecisionConfirmationTypes["FROM_LEADER"] = "FROM_LEADER";
    DecisionConfirmationTypes["FROM_ALL"] = "FROM_ALL";
    DecisionConfirmationTypes["NONE"] = "NONE";
})(DecisionConfirmationTypes || (exports.DecisionConfirmationTypes = DecisionConfirmationTypes = {}));
exports.EMPTY_COURSE_SCENARIO = {
    scenarioName: "",
    author: "",
    Content: [
        {
            id: null,
            phaseName: "",
            timeLimit: null,
            confirmationRequired: DecisionConfirmationTypes.NONE,
            phaseEndResult: Status_1.CourseProgressEnum === null || Status_1.CourseProgressEnum === void 0 ? void 0 : Status_1.CourseProgressEnum.Success,
            phaseEndText: "",
            decisionName: "",
            content: "",
            timeLeftDecisionId: -1,
            contentType: FileTypes_enum_1.FileTypes.Text,
            decisionOptions: [],
        },
    ],
    timeDelayedContent: [],
};
//# sourceMappingURL=ScenarioJson.interface.js.map