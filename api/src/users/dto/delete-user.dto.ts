import { ApiProperty } from "@nestjs/swagger";

export class DeleteUserDTO {
	@ApiProperty({ description: "The id of the deleted user." })
	userId: number;
}
