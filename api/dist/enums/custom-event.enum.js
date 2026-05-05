"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventType = exports.CustomEventType = exports.CustomEventPersonType = void 0;
var CustomEventPersonType;
(function (CustomEventPersonType) {
    CustomEventPersonType["VISITOR"] = "VISITOR";
    CustomEventPersonType["EXHIBITOR"] = "EXHIBITOR";
})(CustomEventPersonType || (exports.CustomEventPersonType = CustomEventPersonType = {}));
var CustomEventType;
(function (CustomEventType) {
    CustomEventType["PERSON"] = "PERSON";
    CustomEventType["ORGANIZATION"] = "ORGANIZATION";
})(CustomEventType || (exports.CustomEventType = CustomEventType = {}));
var EventType;
(function (EventType) {
    EventType["ATTENDEES"] = "ATTENDEES";
    EventType["EXHIBITORS"] = "EXHIBITORS";
    EventType["SPEAKERS"] = "SPEAKERS";
})(EventType || (exports.EventType = EventType = {}));
//# sourceMappingURL=custom-event.enum.js.map