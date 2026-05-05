import { ApiProperty } from "@nestjs/swagger";

import { IsJSON, IsNotEmpty, IsOptional, IsString } from "class-validator";

import CourseFile from "../models/course-file.model";
import CourseTag from "../models/course-tag.model";
import Course from "../models/course.model";

export class UpdateCourseDTO implements Partial<Course> {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	name?: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	description?: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	forWhom?: string;

	@ApiProperty()
	@IsNotEmpty()
	tag?: CourseTag;

	@ApiProperty()
	@IsOptional()
	@IsJSON()
	json?: JSON;

	@ApiProperty()
	@IsOptional()
	courseFiles?: CourseFile[];
}
