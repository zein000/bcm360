"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobScrapeType = exports.PersonSource = exports.EmploymentType = void 0;
var EmploymentType;
(function (EmploymentType) {
    EmploymentType["FULLTIME"] = "FULLTIME";
    EmploymentType["PARTTIME"] = "PARTTIME";
    EmploymentType["CONTRACTOR"] = "CONTRACTOR";
    EmploymentType["TEMPORARY"] = "TEMPORARY";
    EmploymentType["VOLUNTEER"] = "VOLUNTEER";
    EmploymentType["INTERN"] = "INTERN";
    EmploymentType["OTHER"] = "OTHER";
})(EmploymentType || (exports.EmploymentType = EmploymentType = {}));
var PersonSource;
(function (PersonSource) {
    PersonSource["OFFER"] = "OFFER";
    PersonSource["SCRAPING"] = "SCRAPING";
})(PersonSource || (exports.PersonSource = PersonSource = {}));
var JobScrapeType;
(function (JobScrapeType) {
    JobScrapeType["GET_INFO_AT"] = "GET_INFO_AT";
    JobScrapeType["GET_ENRICHMENT"] = "GET_ENRICHMENT";
    JobScrapeType["GET_MANAGING_DIRECTOR"] = "GET_MANAGING_DIRECTOR";
    JobScrapeType["GET_PERSON_FROM_OFFER"] = "GET_PERSON_FROM_OFFER";
})(JobScrapeType || (exports.JobScrapeType = JobScrapeType = {}));
//# sourceMappingURL=job.enum.js.map