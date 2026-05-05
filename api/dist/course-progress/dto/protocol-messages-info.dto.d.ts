import ProtocolMessages from "../models/protocol-messages.model";
import { ProtocolHistoryInfoDto } from "./protocol-history-info.dto";
export declare class ProtocolMessageInfoDto implements Partial<Omit<ProtocolMessages, "protocolHistory">> {
    id: string;
    message: string;
    options: string;
    protocolHistory?: ProtocolHistoryInfoDto;
    constructor(data: ProtocolMessages);
}
