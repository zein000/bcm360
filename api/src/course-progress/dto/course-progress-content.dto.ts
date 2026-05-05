import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { FileTypes } from "src/file/enum/FileTypes.enum";
import CourseProgressContent from "../models/course-progress-content.model";
import { CourseProgressInfoDto } from "./cource-progress-info.dto";

export class CourseProgressContentInfoDto
    implements
        Partial<
            Omit<CourseProgressContent, "courseProgress">
        >
{
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    stageNumber: number;

    @ApiProperty()
    content: string;

    @ApiProperty()
    contentType: FileTypes;

    @ApiProperty()
    timeStamp: number;

    @ApiProperty({ type: () => CourseProgressInfoDto })
    @Expose()
    courseProgress: CourseProgressInfoDto;

    constructor(data: CourseProgressContent) {
        Object.assign(this, data.dataValues ? data.toJSON() : data);
    }
}
