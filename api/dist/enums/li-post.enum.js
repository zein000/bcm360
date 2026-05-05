"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeType = exports.LiPostResultStatus = exports.LiPostContentType = exports.LiPostSort = void 0;
var LiPostSort;
(function (LiPostSort) {
    LiPostSort["DATE_POSTED"] = "date_posted";
    LiPostSort["RELEVANCE"] = "relevance";
})(LiPostSort || (exports.LiPostSort = LiPostSort = {}));
var LiPostContentType;
(function (LiPostContentType) {
    LiPostContentType["PHOTOS"] = "photos";
    LiPostContentType["VIDEOS"] = "videos";
    LiPostContentType["LIVE_VIDEOS"] = "liveVideos";
    LiPostContentType["COLLABORATIVE_ARTICLES"] = "collaborativeArticles";
    LiPostContentType["DOCUMENTS"] = "documents";
})(LiPostContentType || (exports.LiPostContentType = LiPostContentType = {}));
var LiPostResultStatus;
(function (LiPostResultStatus) {
    LiPostResultStatus["DRAFT"] = "DRAFT";
    LiPostResultStatus["PUBLIC_PROFILE"] = "PUBLIC_PROFILE";
    LiPostResultStatus["COMPANY_PROFILE"] = "COMPANY_PROFILE";
    LiPostResultStatus["RETRY_COMPANY_PROFILE"] = "RETRY_COMPANY_PROFILE";
    LiPostResultStatus["RETRY_PUBLIC_PROFILE"] = "RETRY_PUBLIC_PROFILE";
    LiPostResultStatus["INVALID"] = "INVALID";
    LiPostResultStatus["TRIGGERED"] = "TRIGGERED";
    LiPostResultStatus["IN_PROGRESS"] = "IN_PROGRESS";
    LiPostResultStatus["SCRAPED"] = "SCRAPED";
    LiPostResultStatus["ERROR"] = "ERROR";
    LiPostResultStatus["WAITING"] = "WAITING";
    LiPostResultStatus["APOLLO_ENRICHED"] = "APOLLO_ENRICHED";
    LiPostResultStatus["APOLLO_PERSON_ENRICHED"] = "APOLLO_PERSON_ENRICHED";
    LiPostResultStatus["DONE"] = "DONE";
    LiPostResultStatus["PERSON_FINDING"] = "PERSON_FINDING";
})(LiPostResultStatus || (exports.LiPostResultStatus = LiPostResultStatus = {}));
var TimeType;
(function (TimeType) {
    TimeType["PERIOD"] = "PERIOD";
    TimeType["FROM_TO"] = "FROM_TO";
})(TimeType || (exports.TimeType = TimeType = {}));
//# sourceMappingURL=li-post.enum.js.map