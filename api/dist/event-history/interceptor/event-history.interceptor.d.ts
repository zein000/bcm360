import { NestInterceptor, Type } from "@nestjs/common";
import { EventName } from "../../enums/event-name.enum";
export declare const EventHistoryInterceptor: (eventName: EventName) => Type<NestInterceptor>;
