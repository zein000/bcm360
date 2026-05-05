"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvEnrichmentScrapeStatus = exports.CSVEnrichmentScrapeStatus = exports.CSVEnrichmentType = void 0;
var CSVEnrichmentType;
(function (CSVEnrichmentType) {
    CSVEnrichmentType["PERSON"] = "PERSON";
    CSVEnrichmentType["PERSON_BY_TITLE"] = "PERSON_BY_TITLE";
    CSVEnrichmentType["ORGANIZATION"] = "ORGANIZATION";
})(CSVEnrichmentType || (exports.CSVEnrichmentType = CSVEnrichmentType = {}));
var CSVEnrichmentScrapeStatus;
(function (CSVEnrichmentScrapeStatus) {
    CSVEnrichmentScrapeStatus["DRAFT"] = "DRAFT";
    CSVEnrichmentScrapeStatus["INVALID"] = "INVALID";
    CSVEnrichmentScrapeStatus["COMPANY_FINDING"] = "COMPANY_FINDING";
    CSVEnrichmentScrapeStatus["PERSON_FINDING"] = "PERSON_FINDING";
    CSVEnrichmentScrapeStatus["SCRAPED"] = "SCRAPED";
    CSVEnrichmentScrapeStatus["HAS_DOMAIN"] = "HAS_DOMAIN";
    CSVEnrichmentScrapeStatus["HAS_NO_DOMAIN"] = "HAS_NO_DOMAIN";
    CSVEnrichmentScrapeStatus["APOLLO_ENRICHED"] = "APOLLO_ENRICHED";
})(CSVEnrichmentScrapeStatus || (exports.CSVEnrichmentScrapeStatus = CSVEnrichmentScrapeStatus = {}));
var CsvEnrichmentScrapeStatus;
(function (CsvEnrichmentScrapeStatus) {
    CsvEnrichmentScrapeStatus["DRAFT"] = "DRAFT";
    CsvEnrichmentScrapeStatus["SCRAPED"] = "SCRAPED";
    CsvEnrichmentScrapeStatus["VALIDATED"] = "VALIDATED";
    CsvEnrichmentScrapeStatus["ERROR"] = "ERROR";
    CsvEnrichmentScrapeStatus["RUNNING"] = "RUNNING";
    CsvEnrichmentScrapeStatus["ENRICHED"] = "ENRICHED";
    CsvEnrichmentScrapeStatus["INVALID"] = "INVALID";
    CsvEnrichmentScrapeStatus["SCRAPE_BY_LINKEDIN"] = "SCRAPE_BY_LINKEDIN";
    CsvEnrichmentScrapeStatus["SCRAPE_BY_EMAIL"] = "SCRAPE_BY_EMAIL";
    CsvEnrichmentScrapeStatus["SCRAPE_BY_NAME_COMPANY_NAME_TITLE"] = "SCRAPE_BY_NAME_COMPANY_NAME_TITLE";
    CsvEnrichmentScrapeStatus["SCRAPE_BY_NAME_COMPANY_NAME"] = "SCRAPE_BY_NAME_COMPANY_NAME";
    CsvEnrichmentScrapeStatus["SCHEDULE_SCRAPE"] = "SCHEDULE_SCRAPE";
    CsvEnrichmentScrapeStatus["LOCAL_SCAPED"] = "LOCAL_SCAPED";
    CsvEnrichmentScrapeStatus["PUBLIC_PROFILE"] = "PUBLIC_PROFILE";
    CsvEnrichmentScrapeStatus["COMPANY_PROFILE"] = "COMPANY_PROFILE";
    CsvEnrichmentScrapeStatus["RETRY_COMPANY_PROFILE"] = "RETRY_COMPANY_PROFILE";
    CsvEnrichmentScrapeStatus["RETRY_PUBLIC_PROFILE"] = "RETRY_PUBLIC_PROFILE";
    CsvEnrichmentScrapeStatus["WAITING"] = "WAITING";
    CsvEnrichmentScrapeStatus["COMPANY_NAME"] = "COMPANY_NAME";
    CsvEnrichmentScrapeStatus["APOLLO_ENRICHED"] = "APOLLO_ENRICHED";
    CsvEnrichmentScrapeStatus["DONE"] = "DONE";
    CsvEnrichmentScrapeStatus["PERSON_FINDING"] = "PERSON_FINDING";
})(CsvEnrichmentScrapeStatus || (exports.CsvEnrichmentScrapeStatus = CsvEnrichmentScrapeStatus = {}));
//# sourceMappingURL=csv-enrichment.enum.js.map