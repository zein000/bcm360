import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";


import CourseFile from "../models/course-file.model";
import { CourseInfoDTO } from "./course-info.dto";
import { FileTypes } from "../../file/enum/FileTypes.enum";
import { FileAssignment } from "../enums/FileAssignment.enum";

export class CourseFileInfoDTO implements Partial<Omit<CourseFile, "course">> {
    @ApiProperty()
    id: number;

    @ApiProperty()
    fullFilePath?: string;
    
    @ApiProperty()
    fileName?: string;

    @ApiProperty()
    fileLength?: number;

    @ApiProperty()
    fileType?: FileTypes;

    @ApiProperty()
    fileAssignment?: FileAssignment;

    @ApiProperty({ type: () => CourseInfoDTO })
    @Expose()
    course?: CourseInfoDTO;

    @Exclude()
    @ApiProperty()
    updatedAt?: Date;

    @Exclude()
    @ApiProperty()
    createdAt?: Date;

    constructor(data: CourseFile) {
        Object.assign(this, data.dataValues ? data.toJSON() : data);
    }
}
