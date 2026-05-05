import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import ProtocolDecisions from "../models/protocol-decisions.model";
import { CourseProgressUserInfoDto } from "./course-progress-user-info.dto";
import { ProtocolHistoryInfoDto } from "./protocol-history-info.dto";

export class ProtocolDecisionInfoDto implements Partial<Omit<ProtocolDecisions, "protocolHistory" | "votedBy">> {
	@ApiProperty()
	id: number;

	@ApiProperty()
	decision?: string;

	@ApiProperty()
	finalDecision?: string;
	
	@ApiProperty({ type: () => ProtocolHistoryInfoDto })
	@Expose()
	protocolHistory?: ProtocolHistoryInfoDto;

	@ApiProperty({ type: () => CourseProgressUserInfoDto, isArray: true })
	@Expose()
	votedBy?: CourseProgressUserInfoDto[];

	constructor(data: ProtocolDecisions) {
		Object.assign(this, data.dataValues ? data.toJSON() : data);
	}
}
