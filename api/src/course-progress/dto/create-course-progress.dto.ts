import { ApiProperty } from "@nestjs/swagger";

import { IsJSON, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

import CourseProgress from "../models/course-progress.model";

export class CreateCourseProgressDTO implements Partial<CourseProgress> {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    courseId?: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    userId?: number;
}
