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
var CourseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const user_info_caching_service_1 = require("../caching/services/user-info-caching.service");
const dto_1 = require("../common/dto");
const course_admin_info_dto_1 = require("./dto/course-admin-info.dto");
const course_model_1 = require("./models/course.model");
const course_repository_1 = require("./repositories/course.repository");
const file_service_1 = require("../file/file.service");
const course_file_model_1 = require("./models/course-file.model");
const course_file_info_dto_1 = require("./dto/course-file-info.dto");
const schedule_1 = require("@nestjs/schedule");
const FileAssignment_enum_1 = require("./enums/FileAssignment.enum");
const course_tag_model_1 = require("./models/course-tag.model");
const course_tag_info_dto_1 = require("./dto/course-tag-info.dto");
let CourseService = CourseService_1 = class CourseService {
    constructor(model, courseFileModel, courseTag, userInfoCachingService, courseRepository, fileService) {
        this.model = model;
        this.courseFileModel = courseFileModel;
        this.courseTag = courseTag;
        this.userInfoCachingService = userInfoCachingService;
        this.courseRepository = courseRepository;
        this.fileService = fileService;
        this.logger = new common_1.Logger(CourseService_1.name);
    }
    async handleCron() {
        this.logger.debug("Running scheduled task to clear unused files");
        try {
            await this.handleFilesDeleting(null, false);
        }
        catch (error) {
            this.logger.error("Error running scheduled task:", error);
        }
    }
    async create(data, user) {
        var _a, _b;
        let tag = null;
        if ((_a = data === null || data === void 0 ? void 0 : data.tag) === null || _a === void 0 ? void 0 : _a.name) {
            tag = await this.addTagIfNotExist(data.tag.name, user);
        }
        const course = new course_model_1.default();
        course.name = data.name;
        course.description = data.description;
        course.forWhom = data.forWhom;
        course.json = typeof data.json === "string" ? JSON.parse(data.json) : data.json;
        course.tagId = tag === null || tag === void 0 ? void 0 : tag.id;
        course.companyId = user === null || user === void 0 ? void 0 : user.companyId;
        await course.save();
        if ((_b = data === null || data === void 0 ? void 0 : data.courseFiles) === null || _b === void 0 ? void 0 : _b.length) {
            await Promise.all(data.courseFiles.map((file) => this.courseFileModel.update({ courseId: course.id }, { where: { fullFilePath: file.fullFilePath } })));
        }
        return new course_admin_info_dto_1.CourseAdminInfoDTO(course);
    }
    async updateAsAdmin(id, data, user) {
        var _a, _b;
        let tag = null;
        if ((_a = data === null || data === void 0 ? void 0 : data.tag) === null || _a === void 0 ? void 0 : _a.name) {
            tag = await this.addTagIfNotExist(data.tag.name, user);
        }
        const course = await this.model.findByPk(id);
        if (!course)
            throw new common_1.NotFoundException("Course not found");
        course.name = data.name;
        course.description = data.description;
        course.forWhom = data.forWhom;
        course.json = typeof data.json === "string" ? JSON.parse(data.json) : data.json;
        course.tagId = tag === null || tag === void 0 ? void 0 : tag.id;
        course.companyId = user === null || user === void 0 ? void 0 : user.companyId;
        await course.save();
        if ((_b = data === null || data === void 0 ? void 0 : data.courseFiles) === null || _b === void 0 ? void 0 : _b.length) {
            await Promise.all(data.courseFiles.map((file) => this.courseFileModel.update({ courseId: course.id }, { where: { fullFilePath: file.fullFilePath } })));
        }
        return course.id;
    }
    async update(data, user) {
        var _a, _b;
        let tag = null;
        if ((_a = data === null || data === void 0 ? void 0 : data.tag) === null || _a === void 0 ? void 0 : _a.name) {
            tag = await this.addTagIfNotExist(data.tag.name, user);
        }
        const course = await this.model.findByPk(data.id);
        if (!course)
            throw new common_1.NotFoundException("Course not found");
        course.name = data.name;
        course.description = data.description;
        course.forWhom = data.forWhom;
        course.json = typeof data.json === "string" ? JSON.parse(data.json) : data.json;
        course.tagId = tag === null || tag === void 0 ? void 0 : tag.id;
        course.companyId = user === null || user === void 0 ? void 0 : user.companyId;
        await course.save();
        if ((_b = data === null || data === void 0 ? void 0 : data.courseFiles) === null || _b === void 0 ? void 0 : _b.length) {
            await Promise.all(data.courseFiles.map((file) => this.courseFileModel.update({ courseId: course.id }, { where: { fullFilePath: file.fullFilePath } })));
        }
        return course.id;
    }
    async addTagIfNotExist(tagName, user) {
        let tag = await this.courseTag.findOne({ where: { name: tagName } });
        if (!tag) {
            tag = new course_tag_model_1.default();
            tag.name = tagName;
            tag.companyId = user === null || user === void 0 ? void 0 : user.companyId;
            await tag.save();
        }
        return new course_tag_info_dto_1.CourseTagInfoDTO(tag);
    }
    async findAllTags(user) {
        const tags = await this.courseTag.findAll({ where: { companyId: user.companyId } });
        return tags.map((tag) => new course_tag_info_dto_1.CourseTagInfoDTO(tag));
    }
    async findOne(id) {
        const course = await this.model.findByPk(id, { include: [course_file_model_1.default, course_tag_model_1.default] });
        if (!course)
            throw new common_1.NotFoundException("Course not found");
        return new course_admin_info_dto_1.CourseAdminInfoDTO(course);
    }
    async findAllRelatedCourses(id, user) {
        var _a;
        const course = await this.findOne(id);
        if (!((_a = course === null || course === void 0 ? void 0 : course.tag) === null || _a === void 0 ? void 0 : _a.id))
            return [];
        const related = await this.courseRepository.findAllWithTag(course.tag.id, id, user);
        return related.map((c) => new course_admin_info_dto_1.CourseAdminInfoDTO(c));
    }
    async findAll(pageOptions, user) {
        const { rows, count } = await this.courseRepository.findAllAndCount(pageOptions.limit || 1000, pageOptions.skip, pageOptions.searchValue || null, user);
        const pageMeta = new dto_1.PageMetaDTO({ itemCount: count, pageOptions });
        return new dto_1.PageDTO(rows.map((course) => new course_admin_info_dto_1.CourseAdminInfoDTO(course)), pageMeta);
    }
    async delete(id, user) {
        var _a;
        const course = await this.model.findByPk(id, { include: [course_file_model_1.default] });
        if (!course)
            throw new common_1.NotFoundException("Course not found");
        if (course.companyId !== user.companyId && user.companyId !== 1) {
            throw new common_1.NotFoundException("You are not allowed to delete this course");
        }
        if ((_a = course === null || course === void 0 ? void 0 : course.courseFiles) === null || _a === void 0 ? void 0 : _a.length) {
            await this.handleFilesDeleting(id);
        }
        course.deletedById = user.id;
        await course.save();
        await course.destroy();
        return course.id;
    }
    async uploadCourseFiles(files, fileAssignment = FileAssignment_enum_1.FileAssignment.Content) {
        const filePaths = await this.fileService.uploadFiles(files);
        const courseFiles = filePaths.map((fileInfo) => ({
            fileType: fileInfo.fileType,
            fullFilePath: fileInfo.fullFilePath,
            fileLength: fileInfo.fileLength,
            fileName: fileInfo.fileName,
            fileAssignment: fileAssignment,
        }));
        const fileEntries = await this.courseFileModel.bulkCreate(courseFiles);
        return fileEntries.map((entry) => new course_file_info_dto_1.CourseFileInfoDTO(entry));
    }
    async deleteCourseFile(fullFilePath) {
        const existedFile = await this.courseFileModel.findOne({ where: { fullFilePath } });
        if (!existedFile)
            throw new common_1.NotFoundException("File was not found");
        await existedFile.destroy();
        await this.fileService.deleteFile(fullFilePath);
    }
    async handleFilesDeleting(courseId, safeDelete = true) {
        const unUsedFiles = await this.courseFileModel.findAll({ where: { courseId } });
        const deleteResults = await Promise.allSettled(unUsedFiles.map((file) => this.fileService.deleteFile(file.fullFilePath)));
        if (!safeDelete) {
            const successfullyDeleted = unUsedFiles.filter((_, index) => deleteResults[index].status === "fulfilled");
            const failedDeletions = deleteResults
                .map((result, index) => (result.status === "rejected" ? unUsedFiles[index] : null))
                .filter(Boolean);
            if (failedDeletions.length) {
                this.logger.error(`Failed to delete ${failedDeletions.length} course files from bucket`);
                if (courseId !== null) {
                    await this.courseFileModel.update({ courseId: null }, { where: { id: failedDeletions.map((file) => file.id) } });
                }
            }
            if (successfullyDeleted.length) {
                await this.courseFileModel.destroy({
                    where: { id: successfullyDeleted.map((file) => file.id) },
                });
                this.logger.debug(`Successfully deleted ${successfullyDeleted.length} unused files from the database`);
            }
        }
    }
};
exports.CourseService = CourseService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CourseService.prototype, "handleCron", null);
exports.CourseService = CourseService = CourseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(course_model_1.default)),
    __param(1, (0, sequelize_1.InjectModel)(course_file_model_1.default)),
    __param(2, (0, sequelize_1.InjectModel)(course_tag_model_1.default)),
    __metadata("design:paramtypes", [Object, Object, Object, user_info_caching_service_1.UserInfoCachingService,
        course_repository_1.CourseRepository,
        file_service_1.FileService])
], CourseService);
//# sourceMappingURL=course.service.js.map