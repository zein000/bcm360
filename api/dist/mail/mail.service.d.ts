import { ConfigType } from "@nestjs/config";
import { ViewEngineService } from "src/view-engine/view-engine.service";
import emailConfig from "./config/mail.config";
import User from "../users/models/user.model";
import { EMailTemplates } from "./mail-templates.enum";
export declare class MailService {
    private config;
    private readonly viewEngineService;
    private readonly logger;
    private mailJet;
    constructor(config: ConfigType<typeof emailConfig>, viewEngineService: ViewEngineService);
    send(mail: any, templateName: EMailTemplates): Promise<any>;
    sendUserConfirmation(user: User, token: string, url: URL): Promise<void>;
    sendResetPassword(user: User, url: string): Promise<void>;
    sendChangeEmail(user: User, url: string, email: string): Promise<void>;
    sendUserRegisterEmail(user: User, url: string): Promise<void>;
    sendUserInvitationOnCourse(fromUser: Partial<User>, toEmail: string, url: string, scenarioName: string, senderName: string): Promise<void>;
}
