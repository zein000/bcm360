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
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const view_engine_service_1 = require("../view-engine/view-engine.service");
const mail_config_1 = require("./config/mail.config");
const errors_enum_1 = require("../enums/errors.enum");
const mail_templates_enum_1 = require("./mail-templates.enum");
const Mailjet = require("node-mailjet");
let MailService = MailService_1 = class MailService {
    constructor(config, viewEngineService) {
        this.config = config;
        this.viewEngineService = viewEngineService;
        this.logger = new common_1.Logger(MailService_1.name);
        this.mailJet = new Mailjet({
            apiKey: this.config.key,
            apiSecret: this.config.pass,
        });
    }
    async send(mail, templateName) {
        try {
            const transport = await this.mailJet.post("send", { version: "v3.1" }).request({
                Messages: [
                    {
                        From: mail.from,
                        To: [Object.assign({}, mail.to)],
                        Subject: mail.subject,
                        HTMLPart: mail.html,
                    },
                ],
            });
            this.logger.log({ template: templateName }, `Email successfully dispatched to ${mail.to}`);
            return transport;
        }
        catch (error) {
            this.logger.error(error, `Failed to send email to ${mail.to}`);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.EMAIL_NOT_SENT);
        }
    }
    async sendUserConfirmation(user, token, url) {
        url.searchParams.append("token", token);
        const html = this.viewEngineService.render(mail_templates_enum_1.EMailTemplates.CONFIRM_EMAIL, {
            data: {
                name: `${user.firstName} ${user.lastName}`,
                url: url.href,
            },
        });
        await this.send({
            to: { Email: user.email, Name: `${user.firstName} ${user.lastName}` },
            from: { name: "Support-Team", email: this.config.from },
            subject: "Willkommen bei BCM360! Bestätigen Sie Ihre E-Mail",
            html,
        }, mail_templates_enum_1.EMailTemplates.CONFIRM_EMAIL);
    }
    async sendResetPassword(user, url) {
        const html = this.viewEngineService.render(mail_templates_enum_1.EMailTemplates.RESET_PASSWORD, {
            data: {
                name: `${user.firstName} ${user.lastName}`,
                url,
            },
        });
        await this.send({
            to: { Email: user.email, Name: `${user.firstName} ${user.lastName}` },
            from: { name: "Support-Team", email: this.config.from },
            subject: "Passwort zurücksetzen",
            html,
        }, mail_templates_enum_1.EMailTemplates.RESET_PASSWORD);
    }
    async sendChangeEmail(user, url, email) {
        const html = this.viewEngineService.render(mail_templates_enum_1.EMailTemplates.CONFIRM_EMAIL, {
            data: {
                name: `${user.firstName} ${user.lastName}`,
                url,
            },
        });
        await this.send({
            to: { Email: email, Name: `${user.firstName} ${user.lastName}` },
            from: { name: "Support-Team", email: this.config.from },
            subject: "Bestätigen Sie die neue E-Mail!",
            html,
        }, mail_templates_enum_1.EMailTemplates.CONFIRM_EMAIL);
    }
    async sendUserRegisterEmail(user, url) {
        var _a, _b;
        const html = this.viewEngineService.render(mail_templates_enum_1.EMailTemplates.USER_REGISTRATION, {
            data: {
                name: `${(_a = user.firstName) !== null && _a !== void 0 ? _a : ""} ${(_b = user.lastName) !== null && _b !== void 0 ? _b : ""}`,
                url,
            },
        });
        await this.send({
            to: { Email: user.email, Name: `${user.firstName} ${user.lastName}` },
            from: { name: "BCM360 Team", email: this.config.from },
            subject: "Einladung zur BCM360-Plattform",
            html,
        }, mail_templates_enum_1.EMailTemplates.USER_REGISTRATION);
    }
    async sendUserInvitationOnCourse(fromUser, toEmail, url, scenarioName, senderName) {
        const html = this.viewEngineService.render(mail_templates_enum_1.EMailTemplates.SCENARIO_INVITATION, {
            data: {
                firstName: fromUser.firstName,
                lastName: fromUser.lastName,
                url,
                scenarioName,
                senderName,
            },
        });
        await this.send({
            to: { Email: toEmail, Name: "" },
            from: { name: "BCM360 Team", email: this.config.from },
            subject: "Einladung zum Szenario auf der BCM360-Plattform",
            html,
        }, mail_templates_enum_1.EMailTemplates.SCENARIO_INVITATION);
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(mail_config_1.default.KEY)),
    __metadata("design:paramtypes", [void 0, view_engine_service_1.ViewEngineService])
], MailService);
//# sourceMappingURL=mail.service.js.map