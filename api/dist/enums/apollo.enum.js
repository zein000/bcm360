"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestSource = exports.SourceApplication = exports.ApolloType = exports.ApolloCounters = void 0;
var ApolloCounters;
(function (ApolloCounters) {
    ApolloCounters["NONE"] = "NONE";
    ApolloCounters["IN_CURRENT"] = "IN_CURRENT";
    ApolloCounters["IN_OTHER"] = "IN_OTHER";
})(ApolloCounters || (exports.ApolloCounters = ApolloCounters = {}));
var ApolloType;
(function (ApolloType) {
    ApolloType["SOURCE"] = "SOURCE";
    ApolloType["LEAD_FILTER"] = "LEAD_FILTER";
    ApolloType["ACCOUNT_FILTER"] = "ACCOUNT_FILTER";
    ApolloType["COUNTER"] = "COUNTER";
    ApolloType["LEAD_EXCLUSION"] = "LEAD_EXCLUSION";
})(ApolloType || (exports.ApolloType = ApolloType = {}));
var SourceApplication;
(function (SourceApplication) {
    SourceApplication["NORTHDATA"] = "NORTHDATA";
    SourceApplication["APOLLO"] = "APOLLO";
    SourceApplication["LI_EVENT"] = "LI_EVENT";
    SourceApplication["CSV_ENRICHMENT"] = "CSV_ENRICHMENT";
    SourceApplication["LI_PEOPLE"] = "LI_PEOPLE";
})(SourceApplication || (exports.SourceApplication = SourceApplication = {}));
var RequestSource;
(function (RequestSource) {
    RequestSource["FRONTEND"] = "FRONTEND";
    RequestSource["BACKEND"] = "BACKEND";
})(RequestSource || (exports.RequestSource = RequestSource = {}));
//# sourceMappingURL=apollo.enum.js.map