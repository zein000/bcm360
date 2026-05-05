/**
 * Enum: EMailTemplates
 *
 * Dieses Enum listet alle unterstützten E-Mail-Template-Namen auf, die im `MailService`
 * verwendet werden können. Die Werte entsprechen den Template-Dateinamen, die von der
 * ViewEngine gerendert werden (z.B. Handlebars oder andere Template-Engines).
 *
 * Verwendungszweck:
 * - Auswahl und Wiederverwendung von Template-Namen beim E-Mail-Versand
 * - Einheitliche und typisierte Verwaltung von Template-Bezeichnern
 *
 * Werte:
 * - CONFIRM_EMAIL: Template für E-Mail-Bestätigungen
 * - RESET_PASSWORD: Template für Passwort-zurücksetzen-Mails
 * - USER_REGISTRATION: Template für Einladungs-/Registrierungsmails
 * - CHANGE_PASSWORD: Template für Passwortänderungsbestätigungen
 * - SCENARIO_INVITATION: Template für Einladungen zu einem Szenario auf der Plattform
 */
export enum EMailTemplates {
	CONFIRM_EMAIL = "confirmation",
	RESET_PASSWORD = "reset-password",
	USER_REGISTRATION = "user-registration",
	CHANGE_PASSWORD = "change-password",
	SCENARIO_INVITATION = "scenario-invitation"
}
