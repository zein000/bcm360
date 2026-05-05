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
var CourseProgressRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseProgressRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const course_model_1 = require("../../courses/models/course.model");
const errors_enum_1 = require("../../enums/errors.enum");
const course_progress_users_model_1 = require("../models/course-progress-users.model");
const course_progress_model_1 = require("../models/course-progress.model");
const protocol_decisions_model_1 = require("../models/protocol-decisions.model");
const protocol_histories_model_1 = require("../models/protocol-histories.model");
const protocol_messages_model_1 = require("../models/protocol-messages.model");
const course_file_model_1 = require("../../courses/models/course-file.model");
const FileAssignment_enum_1 = require("../../courses/enums/FileAssignment.enum");
const course_tag_model_1 = require("../../courses/models/course-tag.model");
const user_model_1 = require("../../users/models/user.model");
const course_progress_content_model_1 = require("../models/course-progress-content.model");
const Status_1 = require("../enum/Status");
let CourseProgressRepository = CourseProgressRepository_1 = class CourseProgressRepository {
    constructor(model) {
        this.model = model;
        this.logger = new common_1.Logger(CourseProgressRepository_1.name);
    }
    async findAll() {
        try {
            return this.model.findAll({ include: course_model_1.default });
        }
        catch (error) {
            this.logger.error(error, "Failed to find course progress");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findAllScenariosInProgress() {
        try {
            return this.model.findAll({
                where: {
                    status: Status_1.CourseProgressEnum.InProgress,
                }
            });
        }
        catch (error) {
            this.logger.error(error, "Failed to find course progress");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findAllScenariosInProgressForUser(userId) {
        try {
            return this.model.findAll({
                where: {
                    status: Status_1.CourseProgressEnum.InProgress,
                    userId: userId,
                }
            });
        }
        catch (error) {
            this.logger.error(error, "Failed to find course progress");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findOneCourseProgress(id) {
        try {
            return await this.model.findByPk(id, {
                include: [
                    {
                        model: course_model_1.default,
                        include: [course_tag_model_1.default],
                    },
                    {
                        model: user_model_1.default,
                        as: "user",
                    },
                ],
            });
        }
        catch (error) {
            this.logger.error(error, "Failed to find course progress by id %s", id);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async saveCourseProgress(course) {
        try {
            return course.save();
        }
        catch (error) {
            this.logger.error(error, "Failed to save course progress");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findLastScenarioInProgress(userId) {
        try {
            return this.model.findOne({
                where: {
                    userId,
                    status: Status_1.CourseProgressEnum.InProgress,
                },
                order: [["createdAt", "DESC"]],
            });
        }
        catch (error) {
            this.logger.error(error, "Failed to find scenario in progress");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findCourseProgressWithRelatedDataForReport(id, user) {
        try {
            return this.model.findByPk(id, {
                include: [
                    course_model_1.default,
                    course_progress_users_model_1.default,
                    course_progress_content_model_1.default,
                    {
                        model: user_model_1.default,
                        as: "user",
                        where: {
                            companyId: user.companyId,
                        },
                        required: true,
                    },
                    {
                        model: protocol_histories_model_1.default,
                        include: [
                            {
                                model: protocol_decisions_model_1.default,
                                include: [course_progress_users_model_1.default],
                            },
                            protocol_messages_model_1.default,
                            course_progress_users_model_1.default,
                        ],
                    },
                ],
            });
        }
        catch (error) {
            this.logger.error(error, "Failed to find course progress data with all relations for report");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findAllAndCount(limit, skip, searchValue, user) {
        try {
            const where = searchValue
                ? {
                    name: {
                        [sequelize_2.Op.like]: sequelize_2.Sequelize.literal('CONCAT("%", :searchValue, "%")'),
                    },
                }
                : {};
            const { rows, count } = await this.model.findAndCountAll({
                where: Object.assign({}, where),
                order: ["status"],
                limit,
                offset: skip,
                include: [
                    {
                        model: user_model_1.default,
                        as: "user",
                        where: {
                            companyId: user.companyId,
                        },
                        required: true,
                    },
                ],
            });
            const data = await this.model.findAll({
                where: {
                    id: { [sequelize_2.Op.in]: rows.map((r) => r.id) },
                },
                include: [
                    {
                        model: protocol_histories_model_1.default,
                        include: [
                            {
                                model: protocol_messages_model_1.default,
                            },
                            {
                                model: protocol_decisions_model_1.default,
                            },
                        ],
                    },
                    {
                        model: course_model_1.default,
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
                    },
                    {
                        model: course_progress_users_model_1.default,
                        where: {
                            isAccepted: true,
                        },
                        required: false,
                    },
                    {
                        model: user_model_1.default,
                        as: "user",
                    },
                    course_progress_content_model_1.default,
                ],
            });
            return { rows: data, count };
        }
        catch (error) {
            this.logger.error(error, "Failed to find course progresses");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async deleteCourseProgress(id, deletedByUser) {
        var _a;
        try {
            const scenarioProgress = await this.model.findByPk(id, {
                include: [
                    {
                        model: user_model_1.default,
                        as: "user",
                    },
                ],
            });
            if (!scenarioProgress) {
                throw new common_1.NotFoundException("Scenario progress not found");
            }
            if (((_a = scenarioProgress === null || scenarioProgress === void 0 ? void 0 : scenarioProgress.user) === null || _a === void 0 ? void 0 : _a.companyId) !== deletedByUser.companyId) {
                throw new common_1.NotFoundException("You are not allowed to delete this scenario progress");
            }
            scenarioProgress.deletedById = deletedByUser.id;
            await scenarioProgress.save();
            await scenarioProgress.destroy();
        }
        catch (error) {
            this.logger.error(error, "Failed to delete course progress by id %s", id);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
};
exports.CourseProgressRepository = CourseProgressRepository;
exports.CourseProgressRepository = CourseProgressRepository = CourseProgressRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(course_progress_model_1.default)),
    __metadata("design:paramtypes", [Object])
], CourseProgressRepository);
//# sourceMappingURL=course-progress.repository.js.map