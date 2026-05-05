import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";

import { ViewEngineService } from "src/view-engine/view-engine.service";

import emailConfig from "./config/mail.config";
import { Errors } from "../enums/errors.enum";
import User from "../users/models/user.model";
import { EMailTemplates } from "./mail-templates.enum";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Mailjet = require("node-mailjet");

/**
 * Klasse: MailService
 *
 * Diese Service-Klasse ist verantwortlich für das Versenden von E-Mails über Mailjet.
 * Sie nutzt Templates zur Generierung dynamischer Inhalte und behandelt Szenarien wie:
 * - E-Mail-Bestätigung
 * - Passwort-Zurücksetzung
 * - E-Mail-Änderung
 * - Registrierung & Einladungen
 *
 * Besonderheiten:
 * - Nutzt `ViewEngineService` zum Rendern von HTML-Templates
 * - Konfigurationswerte werden über `email.config.ts` eingebunden
 * - Fehler beim Senden werden mit aussagekräftigen Logs dokumentiert
 */
@Injectable()
export class MailService {
	private readonly logger = new Logger(MailService.name);
	private mailJet;

	constructor(
		@Inject(emailConfig.KEY)
		private config: ConfigType<typeof emailConfig>,
		private readonly viewEngineService: ViewEngineService
	) {
		this.mailJet = new Mailjet({
			apiKey: this.config.key,
			apiSecret: this.config.pass,
		});
	}

	/**
	 * Funktion: send
	 *
	 * Versendet eine E-Mail über die Mailjet API mit übergebenem HTML-Inhalt und Empfängerinformationen.
	 *
	 * @param mail - Objekt mit Absender, Empfänger, Betreff und HTML-Inhalt
	 * @param templateName - Name des verwendeten Templates für Logging-Zwecke
	 * @throws InternalServerErrorException, wenn der Versand fehlschlägt
	 */
	async send(mail, templateName: EMailTemplates) {
		try {
			const transport = await this.mailJet.post("send", { version: "v3.1" }).request({
				Messages: [
					{
						From: mail.from,
						To: [ { ...mail.to } ],
						Subject: mail.subject,
						HTMLPart: mail.html,
					},
				],
			});

			this.logger.log(
				{ template: templateName },
				`Email successfully dispatched to ${mail.to}`
			);

			return transport;
		} catch (error) {
			this.logger.error(error, `Failed to send email to ${mail.to}`);
			throw new InternalServerErrorException(Errors.EMAIL_NOT_SENT);
		}
	}

	/**
	 * Funktion: sendUserConfirmation
	 *
	 * Versendet eine Bestätigungs-E-Mail an den Benutzer zur Verifizierung der E-Mail-Adresse.
	 *
	 * @param user - Benutzer, der bestätigt werden soll
	 * @param token - Bestätigungstoken
	 * @param url - Basis-URL für die Bestätigung (Token wird angehängt)
	 */
	async sendUserConfirmation(user: User, token: string, url: URL): Promise<void> {
		url.searchParams.append("token", token);

		const html = this.viewEngineService.render(EMailTemplates.CONFIRM_EMAIL, {
			data: {
				name: `${user.firstName} ${user.lastName}`,
				url: url.href,
			},
		});

		await this.send(
			{
				to: { Email: user.email, Name: `${user.firstName} ${user.lastName}` },
				from: { name: "Support-Team", email: this.config.from },
				subject: "Willkommen bei BCM360! Bestätigen Sie Ihre E-Mail",
				html,
			},
			EMailTemplates.CONFIRM_EMAIL
		);
	}

	/**
	 * Funktion: sendResetPassword
	 *
	 * Versendet eine E-Mail zum Zurücksetzen des Passworts.
	 *
	 * @param user - Benutzer, der sein Passwort zurücksetzen möchte
	 * @param url - URL mit eingebettetem Reset-Token
	 */
	async sendResetPassword(user: User, url: string): Promise<void> {
		const html = this.viewEngineService.render(EMailTemplates.RESET_PASSWORD, {
			data: {
				name: `${user.firstName} ${user.lastName}`,
				url,
			},
		});

		await this.send(
			{
				to: { Email: user.email, Name: `${user.firstName} ${user.lastName}` },
				from: { name: "Support-Team", email: this.config.from },
				subject: "Passwort zurücksetzen",
				html,
			},
			EMailTemplates.RESET_PASSWORD
		);
	}

	/**
	 * Funktion: sendChangeEmail
	 *
	 * Versendet eine E-Mail an die neue Adresse zur Bestätigung der Änderung.
	 *
	 * @param user - Benutzer, der seine E-Mail-Adresse ändern möchte
	 * @param url - Bestätigungslink
	 * @param email - Neue E-Mail-Adresse
	 */
	async sendChangeEmail(user: User, url: string, email: string): Promise<void> {
		const html = this.viewEngineService.render(EMailTemplates.CONFIRM_EMAIL, {
			data: {
				name: `${user.firstName} ${user.lastName}`,
				url,
			},
		});

		await this.send(
			{
				to: { Email: email, Name: `${user.firstName} ${user.lastName}` },
				from: { name: "Support-Team", email: this.config.from },
				subject: "Bestätigen Sie die neue E-Mail!",
				html,
			},
			EMailTemplates.CONFIRM_EMAIL
		);
	}

	/**
	 * Funktion: sendUserRegisterEmail
	 *
	 * Versendet eine Willkommens-E-Mail an einen neu registrierten Benutzer.
	 *
	 * @param user - Neuer Benutzer
	 * @param url - Link zur Aktivierung oder Registrierung
	 */
	async sendUserRegisterEmail(user: User, url: string): Promise<void> {
		const html = this.viewEngineService.render(EMailTemplates.USER_REGISTRATION, {
			data: {
				name: `${user.firstName ?? ""} ${user.lastName ?? ""}`,
				url,
			},
		});

		await this.send(
			{
				to: { Email: user.email, Name: `${user.firstName} ${user.lastName}` },
				from: { name: "BCM360 Team", email: this.config.from },
				subject: "Einladung zur BCM360-Plattform",
				html,
			},
			EMailTemplates.USER_REGISTRATION
		);
	}

	/**
	 * Funktion: sendUserInvitationOnCourse
	 *
	 * Versendet eine Einladung zu einem bestimmten Szenario auf der Plattform.
	 *
	 * @param fromUser - Einladender Benutzer (Teilinformationen ausreichend)
	 * @param toEmail - E-Mail-Adresse der eingeladenen Person
	 * @param url - Direktlink zum Szenario
	 * @param scenarioName - Name des Szenarios
	 * @param senderName - Anzeigename des Absenders in der E-Mail
	 */
	async sendUserInvitationOnCourse(
		fromUser: Partial<User>,
		toEmail: string,
		url: string,
		scenarioName: string,
		senderName: string
	): Promise<void> {
		const html = this.viewEngineService.render(EMailTemplates.SCENARIO_INVITATION, {
			data: {
				firstName: fromUser.firstName,
				lastName: fromUser.lastName,
				url,
				scenarioName,
				senderName,
			},
		});

		await this.send(
			{
				to: { Email: toEmail, Name: "" },
				from: { name: "BCM360 Team", email: this.config.from },
				subject: "Einladung zum Szenario auf der BCM360-Plattform",
				html,
			},
			EMailTemplates.SCENARIO_INVITATION
		);
	}
}
