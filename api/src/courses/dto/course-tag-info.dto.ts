import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

import CourseFile from "../models/course-file.model";
import CourseTag from "../models/course-tag.model";
import { CourseInfoDTO } from "./course-info.dto";
import { CompanyInfoDTO } from "src/company/dto/company-info.dto";

export class CourseTagInfoDTO implements Partial<Omit<CourseTag, "courses" | "company">> {
	@ApiProperty()
	id: number;

	@ApiProperty()
	name?: string;

	@ApiProperty({ type: () => CourseInfoDTO })
	@Expose()
	courses?: CourseInfoDTO[];

	@ApiProperty({ type: () => CompanyInfoDTO })
	@Expose()
	company?: CompanyInfoDTO;

	@Exclude()
	@ApiProperty()
	updatedAt?: Date;

	@Exclude()
	@ApiProperty()
	createdAt?: Date;

	constructor(data: CourseTag) {
		Object.assign(this, data.dataValues ? data.toJSON() : data);
	}
}
