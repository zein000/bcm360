import { Model } from "sequelize-typescript";
import ProtocolHistories from "./protocol-histories.model";
export default class ProtocolMessages extends Model {
    id: string;
    protocolHistoryId: string;
    protocolHistory: ProtocolHistories;
    message: string;
    options: string;
}
