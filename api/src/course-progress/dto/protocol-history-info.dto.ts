import { ApiProperty } from "@nestjs/swagger";
import ProtocolHistories from "../models/protocol-histories.model";
import { ScenarioMessageTypes } from "../enum/ScenarioMessageTypes.enum";
import { CourseProgressInfoDto } from "./cource-progress-info.dto";
import { Expose } from "class-transformer";
import { ProtocolDecisionInfoDto } from "./protocol-decision-info.dto";
import { ProtocolMessageInfoDto } from "./protocol-messages-info.dto";
import { CourseProgressUserInfoDto } from "./course-progress-user-info.dto";

export class ProtocolHistoryInfoDto
	implements
		Partial<
			Omit<ProtocolHistories, "courseProgress" | "protocolMessages" | "protocolDecisions" | "user">
		>
{
	@ApiProperty()
	id: string;

	@ApiProperty()
	type: ScenarioMessageTypes;

    @ApiProperty()
	timestamp: number;

	@ApiProperty({ type: () => CourseProgressInfoDto })
	@Expose()
	courseProgress: CourseProgressInfoDto;

    @ApiProperty({ type: () => ProtocolDecisionInfoDto, nullable: true })
	@Expose()
	protocolDecisions: ProtocolDecisionInfoDto;

    @ApiProperty({ type: () => ProtocolMessageInfoDto, nullable: true  })
	@Expose()
	protocolMessages: ProtocolMessageInfoDto;

    @ApiProperty({ type: () => CourseProgressUserInfoDto })
	@Expose()
	user: CourseProgressUserInfoDto;

	constructor(data: ProtocolHistories) {
		Object.assign(this, data.dataValues ? data.toJSON() : data);
	}
}
