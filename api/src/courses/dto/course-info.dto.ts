import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

import { CompanyInfoDTO } from "src/company/dto/company-info.dto";
import { CourseProgressInfoDto } from "src/course-progress/dto/cource-progress-info.dto";
import Course from "../models/course.model";
import { CourseFileInfoDTO } from "./course-file-info.dto";
import { CourseTagInfoDTO } from "./course-tag-info.dto";

export class CourseInfoDTO implements Partial<Omit<Course, "company"| "courseFiles" | "courseProgresses" | "tag">> {
	@ApiProperty()
	id: number;

	@ApiProperty()
	name?: string;

	@ApiProperty()
	description?: string;

	@ApiProperty()
	forWhom?: string;

	@ApiProperty()
	json?: JSON;

	@ApiProperty({ type: () => CompanyInfoDTO })
	@Expose()
	company?: CompanyInfoDTO;

	@ApiProperty({ type: () => CourseFileInfoDTO })
	@Expose()
	courseFiles?: CourseFileInfoDTO[];

	@ApiProperty({ type: () => CourseTagInfoDTO })
	@Expose()
	tag?: CourseTagInfoDTO;

	@ApiProperty({ type: () => CourseProgressInfoDto })
	@Expose()
	courseProgresses?: CourseProgressInfoDto[];

	@Exclude()
	@ApiProperty()
	updatedAt?: Date;

	@Exclude()
	@ApiProperty()
	createdAt?: Date;

	constructor(data: Course) {
		Object.assign(this, data.dataValues ? data.toJSON() : data);
	}
}
