"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiEventType = exports.LiEventLocationType = exports.LiEventScrapeStatus = exports.LiEventsScrapeStatus = void 0;
var LiEventsScrapeStatus;
(function (LiEventsScrapeStatus) {
    LiEventsScrapeStatus["DRAFT"] = "DRAFT";
    LiEventsScrapeStatus["TRIGGERED"] = "TRIGGERED";
    LiEventsScrapeStatus["IN_PROGRESS"] = "IN_PROGRESS";
    LiEventsScrapeStatus["SCRAPED"] = "SCRAPED";
    LiEventsScrapeStatus["ERROR"] = "ERROR";
    LiEventsScrapeStatus["WAITING"] = "WAITING";
    LiEventsScrapeStatus["DONE"] = "DONE";
})(LiEventsScrapeStatus || (exports.LiEventsScrapeStatus = LiEventsScrapeStatus = {}));
var LiEventScrapeStatus;
(function (LiEventScrapeStatus) {
    LiEventScrapeStatus["DRAFT"] = "DRAFT";
    LiEventScrapeStatus["PUBLIC_PROFILE"] = "PUBLIC_PROFILE";
    LiEventScrapeStatus["COMPANY_PROFILE"] = "COMPANY_PROFILE";
    LiEventScrapeStatus["INVALID"] = "INVALID";
    LiEventScrapeStatus["TRIGGERED"] = "TRIGGERED";
    LiEventScrapeStatus["IN_PROGRESS"] = "IN_PROGRESS";
    LiEventScrapeStatus["SCRAPED"] = "SCRAPED";
    LiEventScrapeStatus["ERROR"] = "ERROR";
    LiEventScrapeStatus["WAITING"] = "WAITING";
    LiEventScrapeStatus["APOLLO_ENRICHED"] = "APOLLO_ENRICHED";
    LiEventScrapeStatus["APOLLO_PERSON_ENRICHED"] = "APOLLO_PERSON_ENRICHED";
    LiEventScrapeStatus["DONE"] = "DONE";
    LiEventScrapeStatus["PERSON_FINDING"] = "PERSON_FINDING";
})(LiEventScrapeStatus || (exports.LiEventScrapeStatus = LiEventScrapeStatus = {}));
var LiEventLocationType;
(function (LiEventLocationType) {
    LiEventLocationType["ONLINE"] = "ONLINE";
    LiEventLocationType["OFFLINE"] = "OFFLINE";
})(LiEventLocationType || (exports.LiEventLocationType = LiEventLocationType = {}));
var LiEventType;
(function (LiEventType) {
    LiEventType["SEARCH"] = "SEARCH";
    LiEventType["SPECIFIC"] = "SPECIFIC";
})(LiEventType || (exports.LiEventType = LiEventType = {}));
//# sourceMappingURL=li-event.enum.js.map