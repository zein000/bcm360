import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class RoleIdDTO {
	@IsNotEmpty()
	@IsNumber()
	@Transform((data) => Number(data.value))
	id: number;
}
