"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseStatus = exports.AiApplyType = exports.CustomColumnFrequency = exports.CustomColumnTypes = exports.ListAction = exports.ListType = exports.ListSourceType = exports.AssignStatus = exports.InclusionFilterStatus = exports.InclusionStatus = exports.UpdateType = exports.SearchBase = exports.SourceType = exports.ListItemType = exports.ListStatus = exports.ListProcessingStatus = exports.ListConnectType = void 0;
var ListConnectType;
(function (ListConnectType) {
    ListConnectType["EMAIL"] = "EMAIL";
    ListConnectType["LINKEDIN"] = "LINKEDIN";
    ListConnectType["BOTH"] = "BOTH";
})(ListConnectType || (exports.ListConnectType = ListConnectType = {}));
var ListProcessingStatus;
(function (ListProcessingStatus) {
    ListProcessingStatus["IDLE"] = "IDLE";
    ListProcessingStatus["ERROR"] = "ERROR";
    ListProcessingStatus["PROCESSING"] = "PROCESSING";
    ListProcessingStatus["DESKTOP_APP"] = "DESKTOP_APP";
    ListProcessingStatus["API_WAITING"] = "API_WAITING";
    ListProcessingStatus["WAITING"] = "WAITING";
    ListProcessingStatus["DONE"] = "DONE";
})(ListProcessingStatus || (exports.ListProcessingStatus = ListProcessingStatus = {}));
var ListStatus;
(function (ListStatus) {
    ListStatus["PAUSED"] = "PAUSED";
    ListStatus["ACTIVE"] = "ACTIVE";
    ListStatus["ERROR"] = "ERROR";
})(ListStatus || (exports.ListStatus = ListStatus = {}));
var ListItemType;
(function (ListItemType) {
    ListItemType["SOURCE"] = "SOURCE";
    ListItemType["FILTER"] = "FILTER";
})(ListItemType || (exports.ListItemType = ListItemType = {}));
var SourceType;
(function (SourceType) {
    SourceType["APOLLO"] = "APOLLO";
    SourceType["LINKEDIN_EVENTS"] = "LINKEDIN_EVENTS";
    SourceType["NORTHDATA"] = "NORTHDATA";
    SourceType["CUSTOM_EVENTS"] = "CUSTOM_EVENTS";
})(SourceType || (exports.SourceType = SourceType = {}));
var SearchBase;
(function (SearchBase) {
    SearchBase["SOURCE"] = "SOURCE";
    SearchBase["PERSON"] = "PERSON";
    SearchBase["COMPANY"] = "COMPANY";
})(SearchBase || (exports.SearchBase = SearchBase = {}));
var UpdateType;
(function (UpdateType) {
    UpdateType["SOURCE"] = "SOURCE";
    UpdateType["SCORE"] = "SCORE";
    UpdateType["ACCOUNT_FILTER"] = "ACCOUNT_FILTER";
    UpdateType["LEAD_FILTER"] = "LEAD_FILTER";
    UpdateType["ENRICHMENTS"] = "ENRICHMENTS";
    UpdateType["CAMPAIGNS"] = "CAMPAIGNS";
    UpdateType["SETTINGS"] = "SETTINGS";
    UpdateType["STATUS"] = "STATUS";
    UpdateType["CUSTOM_COLUMN"] = "CUSTOM_COLUMN";
})(UpdateType || (exports.UpdateType = UpdateType = {}));
var InclusionStatus;
(function (InclusionStatus) {
    InclusionStatus["ADDED"] = "ADDED";
    InclusionStatus["MAYBE"] = "MAYBE";
    InclusionStatus["EXCLUDED"] = "EXCLUDED";
    InclusionStatus["MANUALLY_EXCLUDED"] = "MANUALLY_EXCLUDED";
    InclusionStatus["BLACKLIST"] = "BLACKLIST";
    InclusionStatus["SAVED_FOR_LATER"] = "SAVED_FOR_LATER";
})(InclusionStatus || (exports.InclusionStatus = InclusionStatus = {}));
var InclusionFilterStatus;
(function (InclusionFilterStatus) {
    InclusionFilterStatus["ADDED"] = "ADDED";
    InclusionFilterStatus["EXCLUDED"] = "EXCLUDED";
    InclusionFilterStatus["MAYBE"] = "MAYBE";
    InclusionFilterStatus["MANUALLY_EXCLUDED"] = "MANUALLY_EXCLUDED";
    InclusionFilterStatus["BOTH"] = "BOTH";
    InclusionFilterStatus["BLACKLIST"] = "BLACKLIST";
    InclusionFilterStatus["SAVED_FOR_LATER"] = "SAVED_FOR_LATER";
})(InclusionFilterStatus || (exports.InclusionFilterStatus = InclusionFilterStatus = {}));
var AssignStatus;
(function (AssignStatus) {
    AssignStatus["DRAFT"] = "DRAFT";
    AssignStatus["ASSIGNING"] = "ASSIGNING";
    AssignStatus["ASSIGNED"] = "ASSIGNED";
    AssignStatus["RUNNING"] = "RUNNING";
    AssignStatus["BLACKLIST"] = "BLACKLIST";
    AssignStatus["NOT_NOW"] = "NOT_NOW";
    AssignStatus["NO_REPLY"] = "NO_REPLY";
    AssignStatus["REPLIES"] = "REPLIES";
    AssignStatus["TO_BE_NURTURED"] = "TO_BE_NURTURED";
    AssignStatus["DO_NOT_CONTACT"] = "DO_NOT_CONTACT";
    AssignStatus["ENDED"] = "ENDED";
    AssignStatus["PAUSED"] = "PAUSED";
})(AssignStatus || (exports.AssignStatus = AssignStatus = {}));
var ListSourceType;
(function (ListSourceType) {
    ListSourceType["PROSPECT_SEARCH"] = "PROSPECT_SEARCH";
    ListSourceType["LI_EVENTS"] = "LI_EVENTS";
    ListSourceType["LI_PEOPLE"] = "LI_PEOPLE";
    ListSourceType["LI_COMPANY_ACTIVITY"] = "LI_COMPANY_ACTIVITY";
    ListSourceType["LI_PROFILE_VISITS"] = "LI_PROFILE_VISITS";
    ListSourceType["LINKEDIN_PROFILE_POSTS"] = "LINKEDIN_PROFILE_POSTS";
    ListSourceType["LINKEDIN_PROFILE_COMMENTS"] = "LINKEDIN_PROFILE_COMMENTS";
    ListSourceType["LINKEDIN_PROFILE_LIKES_TO_POST"] = "LINKEDIN_PROFILE_LIKES_TO_POST";
    ListSourceType["LINKEDIN_PROFILE_LIKES_TO_COMMENT"] = "LINKEDIN_PROFILE_LIKES_TO_COMMENT";
    ListSourceType["LINKEDIN_PROFILE_COMMENTS_TO_POST"] = "LINKEDIN_PROFILE_COMMENTS_TO_POST";
    ListSourceType["LI_PROFILE"] = "LI_PROFILE";
    ListSourceType["CUSTOM_EVENTS"] = "CUSTOM_EVENTS";
    ListSourceType["CSV_ENRICHMENTS"] = "CSV_ENRICHMENTS";
    ListSourceType["JOBS"] = "JOBS";
    ListSourceType["MAPS"] = "MAPS";
    ListSourceType["LI_POST"] = "LI_POST";
})(ListSourceType || (exports.ListSourceType = ListSourceType = {}));
var ListType;
(function (ListType) {
    ListType["ONCE"] = "ONCE";
    ListType["ON_GOING"] = "ON_GOING";
})(ListType || (exports.ListType = ListType = {}));
var ListAction;
(function (ListAction) {
    ListAction["GENERAL"] = "GENERAL";
    ListAction["ADDED"] = "ADDED";
    ListAction["EXCLUDED"] = "EXCLUDED";
})(ListAction || (exports.ListAction = ListAction = {}));
var CustomColumnTypes;
(function (CustomColumnTypes) {
    CustomColumnTypes["TEXT"] = "TEXT";
    CustomColumnTypes["NUMBER"] = "NUMBER";
    CustomColumnTypes["BOOLEAN"] = "BOOLEAN";
    CustomColumnTypes["LINK"] = "LINK";
    CustomColumnTypes["AI_PROMPT"] = "AI_PROMPT";
    CustomColumnTypes["GOOGLE_NEWS"] = "GOOGLE_NEWS";
    CustomColumnTypes["TECHNOLOGY"] = "TECHNOLOGY";
    CustomColumnTypes["DEPARTMENT_SIZE"] = "DEPARTMENT_SIZE";
    CustomColumnTypes["LINKEDIN_POST"] = "LINKEDIN_POST";
    CustomColumnTypes["RANDOM_VALUE"] = "RANDOM_VALUE";
    CustomColumnTypes["JOB_OFFER"] = "JOB_OFFER";
})(CustomColumnTypes || (exports.CustomColumnTypes = CustomColumnTypes = {}));
var CustomColumnFrequency;
(function (CustomColumnFrequency) {
    CustomColumnFrequency["ONCE"] = "ONCE";
    CustomColumnFrequency["WEEKLY"] = "WEEKLY";
    CustomColumnFrequency["MONTHLY"] = "MONTHLY";
    CustomColumnFrequency["QUATERLY"] = "QUATERLY";
    CustomColumnFrequency["HALFYEARLY"] = "HALFYEARLY";
    CustomColumnFrequency["YEARLY"] = "YEARLY";
})(CustomColumnFrequency || (exports.CustomColumnFrequency = CustomColumnFrequency = {}));
var AiApplyType;
(function (AiApplyType) {
    AiApplyType["NONE"] = "NONE";
    AiApplyType["ALL"] = "ALL";
    AiApplyType["FIRST_10"] = "FIRST_10";
})(AiApplyType || (exports.AiApplyType = AiApplyType = {}));
var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus["DRAFT"] = "DRAFT";
    ResponseStatus["INTERESTED"] = "INTERESTED";
    ResponseStatus["NOT_INTERESTED"] = "NOT_INTERESTED";
    ResponseStatus["SENT"] = "SENT";
    ResponseStatus["OPENED"] = "OPENED";
    ResponseStatus["CLICKED"] = "CLICKED";
    ResponseStatus["REPLIED"] = "REPLIED";
    ResponseStatus["BOUNCED"] = "BOUNCED";
    ResponseStatus["UNSUBSCRIBED"] = "UNSUBSCRIBED";
    ResponseStatus["LINKEDIN_VISIT"] = "LINKEDIN_VISIT";
    ResponseStatus["LINKEDIN_INVITED"] = "LINKEDIN_INVITED";
    ResponseStatus["LINKEDIN_INVITE_ACCEPTED"] = "LINKEDIN_INVITE_ACCEPTED";
    ResponseStatus["WRONG_PERSON"] = "WRONG_PERSON";
    ResponseStatus["NOT_NOW"] = "NOT_NOW";
})(ResponseStatus || (exports.ResponseStatus = ResponseStatus = {}));
//# sourceMappingURL=list.enum.js.map