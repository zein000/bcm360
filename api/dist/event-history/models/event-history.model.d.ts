import { Model } from "sequelize-typescript";
import { EventName } from "../../enums/event-name.enum";
export default class EventHistory extends Model {
    id: number;
    name: EventName;
    userId?: number;
    data?: Record<string, unknown>;
    updatedAt: Date;
    createdAt: Date;
}
