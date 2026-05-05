"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseProgressModule = void 0;
const common_1 = require("@nestjs/common");
const course_progress_service_1 = require("./course-progress.service");
const course_progress_controller_1 = require("./course-progress.controller");
const course_progress_model_1 = require("./models/course-progress.model");
const sequelize_1 = require("@nestjs/sequelize");
const course_progress_repository_1 = require("./repositories/course-progress.repository");
const course_progress_gateway_1 = require("./course-progress.gateway");
const auth_module_1 = require("../auth/auth.module");
const course_module_1 = require("../courses/course.module");
const protocol_histories_model_1 = require("./models/protocol-histories.model");
const protocol_decisions_model_1 = require("./models/protocol-decisions.model");
const protocol_messages_model_1 = require("./models/protocol-messages.model");
const mail_module_1 = require("../mail/mail.module");
const config_1 = require("@nestjs/config");
const app_config_1 = require("../app/config/app.config");
const jwt_1 = require("@nestjs/jwt");
const jwt_config_1 = require("../auth/config/jwt.config");
const jwt_options_service_1 = require("../auth/jwt-options.service");
const course_progress_users_model_1 = require("./models/course-progress-users.model");
const course_progress_content_model_1 = require("./models/course-progress-content.model");
const export_scenario_progress_service_1 = require("./export-scenario-progress.service");
const protocol_decision_user_model_1 = require("./models/protocol-decision-user.model");
const schedule_1 = require("@nestjs/schedule");
const course_progress_content_repository_1 = require("./repositories/course-progress-content.repository");
const course_progress_users_repository_1 = require("./repositories/course-progress-users.repository");
const protocol_decisions_repository_1 = require("./repositories/protocol-decisions.repository");
const protocol_history_repository_1 = require("./repositories/protocol-history.repository");
const protocol_messages_repository_1 = require("./repositories/protocol-messages.repository");
const connect_quest_service_1 = require("../quest/connect-quest.service");
const connect_quest_module_1 = require("../quest/connect-quest.module");
let CourseProgressModule = class CourseProgressModule {
};
exports.CourseProgressModule = CourseProgressModule;
exports.CourseProgressModule = CourseProgressModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([
                course_progress_model_1.default,
                protocol_histories_model_1.default,
                protocol_decisions_model_1.default,
                protocol_messages_model_1.default,
                course_progress_users_model_1.default,
                course_progress_content_model_1.default,
                protocol_decision_user_model_1.default,
            ]),
            auth_module_1.AuthModule,
            course_module_1.CourseModule,
            connect_quest_module_1.ConnectQuestModule,
            mail_module_1.MailModule,
            schedule_1.ScheduleModule.forRoot(),
            config_1.ConfigModule.forRoot({
                load: [app_config_1.default],
            }),
            jwt_1.JwtModule.registerAsync({
                imports: [
                    config_1.ConfigModule.forRoot({
                        load: [jwt_config_1.default],
                    }),
                ],
                useClass: jwt_options_service_1.JWTOptionsService,
            }),
        ],
        controllers: [course_progress_controller_1.CourseProgressController],
        providers: [
            course_progress_service_1.CourseProgressService,
            connect_quest_service_1.ConnectQuestService,
            course_progress_repository_1.CourseProgressRepository,
            course_progress_gateway_1.CourseProgressGateway,
            export_scenario_progress_service_1.ExportScenarioProgressService,
            course_progress_content_repository_1.CourseProgressContentRepository,
            course_progress_users_repository_1.CourseProgressUsersRepository,
            protocol_decisions_repository_1.ProtocolDecisionRepository,
            protocol_history_repository_1.ProtocolHistoryRepository,
            protocol_messages_repository_1.ProtocolMessagesRepository,
        ],
        exports: [
            course_progress_service_1.CourseProgressService,
            course_progress_repository_1.CourseProgressRepository,
            course_progress_gateway_1.CourseProgressGateway,
        ],
    })
], CourseProgressModule);
//# sourceMappingURL=course-progress.module.js.map