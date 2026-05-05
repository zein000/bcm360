"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CourseRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const errors_enum_1 = require("../../enums/errors.enum");
const user_model_1 = require("../../users/models/user.model");
const course_model_1 = require("../models/course.model");
const course_file_model_1 = require("../models/course-file.model");
const FileAssignment_enum_1 = require("../enums/FileAssignment.enum");
const course_tag_model_1 = require("../models/course-tag.model");
let CourseRepository = CourseRepository_1 = class CourseRepository {
    constructor(model) {
        this.model = model;
        this.logger = new common_1.Logger(CourseRepository_1.name);
    }
    async findAll() {
        try {
            return this.model.findAll({ include: user_model_1.default });
        }
        catch (error) {
            this.logger.error(error, "Failed to find companies");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findAllAndCount(limit, skip, searchValue, user) {
        try {
            const where = searchValue
                ? { name: { [sequelize_2.Op.like]: `%${searchValue}%` } }
                : {};
            if (user === null || user === void 0 ? void 0 : user.companyId) {
                where["companyId"] = user.companyId;
            }
            const { rows, count } = await this.model.findAndCountAll({
                where,
                order: ["name"],
                limit,
                offset: skip,
            });
            const data = await this.model.findAll({
                where: {
                    id: { [sequelize_2.Op.in]: rows.map((r) => r.id) },
                },
                include: [
                    {
                        model: course_file_model_1.default,
                        where: {
                            fileAssignment: { [sequelize_2.Op.ne]: FileAssignment_enum_1.FileAssignment.Content },
                        },
                        required: false,
                    },
                    course_tag_model_1.default,
                ],
            });
            return { rows: data, count };
        }
        catch (error) {
            this.logger.error(error, "Failed to find permissions");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findOneCourse(id) {
        try {
            return await this.model.findOne({ where: { id } });
        }
        catch (error) {
            this.logger.error(error, `Failed to find course by courseId ${id}`);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findAllWithTag(tagId, currentCourseId, user) {
        try {
            return await this.model.findAll({
                where: {
                    tagId,
                    id: { [sequelize_2.Op.ne]: currentCourseId },
                    companyId: user.companyId,
                },
                include: [course_file_model_1.default, course_tag_model_1.default],
            });
        }
        catch (error) {
            this.logger.error(error, `Failed to find courses by tagId ${tagId}`);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async createCourse(course) {
        try {
            return await course.save();
        }
        catch (error) {
            this.logger.error(error, "Failed to save course");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
};
exports.CourseRepository = CourseRepository;
exports.CourseRepository = CourseRepository = CourseRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(course_model_1.default)),
    __metadata("design:paramtypes", [Object])
], CourseRepository);
//# sourceMappingURL=course.repository.js.map