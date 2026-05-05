"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const caching_module_1 = require("../caching/caching.module");
const course_model_1 = require("./models/course.model");
const course_file_model_1 = require("./models/course-file.model");
const course_tag_model_1 = require("./models/course-tag.model");
const course_controller_1 = require("./course.controller");
const course_seeder_1 = require("./course.seeder");
const course_service_1 = require("./course.service");
const course_repository_1 = require("./repositories/course.repository");
const file_module_1 = require("../file/file.module");
const schedule_1 = require("@nestjs/schedule");
let CourseModule = class CourseModule {
};
exports.CourseModule = CourseModule;
exports.CourseModule = CourseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([course_model_1.default, course_file_model_1.default, course_tag_model_1.default]),
            caching_module_1.CachingModule,
            file_module_1.FileModule,
            schedule_1.ScheduleModule.forRoot(),
        ],
        controllers: [course_controller_1.CourseController],
        providers: [course_repository_1.CourseRepository, course_seeder_1.CourseSeeder, course_service_1.CourseService],
        exports: [course_repository_1.CourseRepository, course_seeder_1.CourseSeeder, course_service_1.CourseService],
    })
], CourseModule);
//# sourceMappingURL=course.module.js.map