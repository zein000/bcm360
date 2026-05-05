import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber } from "class-validator";

export class UserIdParamDTO {
	@ApiProperty({ description: "User id" })
	@IsNumber()
	@Transform((param) => Number(param.value as string))
	id: number;
}
