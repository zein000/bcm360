import { ApiProperty } from "@nestjs/swagger";

import { IsJSON, IsNotEmpty, IsOptional, IsString } from "class-validator";

import Course from "../models/course.model";
import CourseFile from "../models/course-file.model";
import CourseTag from "../models/course-tag.model";

export class CreateCourseDTO implements Partial<Course> {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	description: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	forWhom: string;

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
