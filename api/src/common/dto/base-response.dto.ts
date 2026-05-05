import { ApiProperty } from "@nestjs/swagger";

export class BaseResponseDTO<T> {
	@ApiProperty()
	status: "ok";

	@ApiProperty()
	data?: T;
}
