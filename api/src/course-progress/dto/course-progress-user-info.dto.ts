import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import CourseProgressUsers from "../models/course-progress-users.model";
import { CourseProgressInfoDto } from "./cource-progress-info.dto";

export class CourseProgressUserInfoDto implements Partial<Omit<CourseProgressUsers, "courseProgress">> {
    @ApiProperty()
    id: string;

    @ApiProperty()
    firstName?: string;

    @ApiProperty()
    lastName?: string;

    @ApiProperty()
    email?: string;

    @ApiProperty()
    isAccepted?: boolean;

    @ApiProperty()
    isERR?: boolean;

    @ApiProperty()
    firstJoinTimeStamp?: number;

    @ApiProperty()
    exitTimeStamp?: number;

    @ApiProperty()
    invitedTimeStamp?: number;

    @ApiProperty({ type: () => CourseProgressInfoDto })
    @Expose()
    courseProgress?: CourseProgressInfoDto;

    constructor(data: CourseProgressUsers) {
        Object.assign(this, data.dataValues ? data.toJSON() : data);
    }
}
