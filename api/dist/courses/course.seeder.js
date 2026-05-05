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
var CourseSeeder_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseSeeder = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const course_model_1 = require("./models/course.model");
let CourseSeeder = CourseSeeder_1 = class CourseSeeder {
    constructor(courseModel) {
        this.courseModel = courseModel;
        this.logger = new common_1.Logger(CourseSeeder_1.name);
    }
    async seed() {
        const courses = [
            {
                name: "Browserbite Test Course",
                json: {},
                companyId: 1,
            },
            {
                name: "Browserbite Test 2 Course",
                json: {},
                companyId: 1,
            },
        ];
        try {
            this.logger.debug("Upserting courses");
            for (const course of courses) {
                const foundCourse = await this.courseModel.findOne({
                    where: {
                        name: course.name,
                    },
                });
                if (!foundCourse) {
                    await this.courseModel.create(course);
                }
            }
            this.logger.debug("Finished upserting courses");
        }
        catch (error) {
            console.log(error);
            this.logger.error("Failed upserting courses: ", error);
        }
    }
};
exports.CourseSeeder = CourseSeeder;
exports.CourseSeeder = CourseSeeder = CourseSeeder_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(course_model_1.default)),
    __metadata("design:paramtypes", [Object])
], CourseSeeder);
//# sourceMappingURL=course.seeder.js.map