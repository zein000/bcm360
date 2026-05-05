import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import ProtocolMessages from "../models/protocol-messages.model";
import { ProtocolHistoryInfoDto } from "./protocol-history-info.dto";

export class ProtocolMessageInfoDto implements Partial<Omit<ProtocolMessages, "protocolHistory">> {
    @ApiProperty()
    id: string;

    @ApiProperty()
    message: string;

    @ApiProperty()
    options: string;

    @ApiProperty({ type: () => ProtocolHistoryInfoDto })
    @Expose()
    protocolHistory?: ProtocolHistoryInfoDto;

    constructor(data: ProtocolMessages) {
        Object.assign(this, data.dataValues ? data.toJSON() : data);
    }
}
