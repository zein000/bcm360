import { ForbiddenException, forwardRef, Inject, Injectable, Logger } from "@nestjs/common";

import { ConfigType } from "@nestjs/config";

import {
	DuplicateUserException,
	IncorrectInputDataException,
	UserNotFoundException,
} from "src/exceptions/user.exceptions";
import { MailService } from "src/mail/mail.service";

import { getUserToken, hasPermission } from "src/common/user.util";

import { ERole } from "src/enums/role.enum";
import { RolesService } from "src/roles/roles.service";
import { ETokenPurpose } from "src/tokens/enums/token-purpose.enum";
import { ETokenStatus } from "src/tokens/enums/token-status.enum";
import { TokensService } from "src/tokens/tokens.service";

import { UserBlacklistService } from "src/user-blacklist/user-blacklist.service";
import RequestWithUser from "src/interfaces/request-with-user.interface";

import { PermissionCodes } from "src/permissions/enum/codes";
import Company from "src/company/models/company.model";

import appConfig from "../app/config/app.config";
import { AuthService } from "../auth/auth.service";
import { AuthResponseDTO } from "../auth/dto/auth-response.dto";
import { PageDTO, PageMetaDTO } from "../common/dto";
import { BaseResponseDTO } from "../common/dto/base-response.dto";
import { Errors } from "../enums/errors.enum";

import { AssignUnassignRolesDTO } from "./dto/assign-unassign-roles.dto";
import { UserAuthResponseDTO } from "./dto/auth-response.dto";
import { InviteUserDTO } from "./dto/invite-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { TwoFAEnabledDTO } from "./dto/2fa-enabled.dto";
import { ConfirmEmailDTO } from "./dto/confirm-email.dto";
import { DeleteUserDTO } from "./dto/delete-user.dto";
import { SetPasswordDTO } from "./dto/set-password.dto";
import { UserInfoDTO } from "./dto/user-info.dto";
import { UserSearchParamsDTO } from "./dto/user-search-params.dto";
import User from "./models/user.model";
import { UserRepository } from "./repositories/user.repository";
import { AcceptInvitationDto } from "./dto/accept-invitation.dto";

/**
 * Klasse: UsersService
 *
 * Diese Service-Klasse verwaltet die Kernfunktionen rund um Benutzerkonten.
 * Dazu gehören Passwortverwaltung via Token, E-Mail-Bestätigungen, das Einloggen
 * als anderer Benutzer und das Auslösen von Authentifizierungsvorgängen.
 *
 * Die Klasse nutzt verschiedene unterstützende Dienste wie TokensService,
 * AuthService, MailService und RolesService, um sichere und robuste
 * Benutzerprozesse bereitzustellen.
 */
@Injectable()
export class UsersService {
	private readonly logger = new Logger(UsersService.name);
	private readonly registrationUrl = "/accept-invitation";
	private readonly setPasswordUrl = "/change-password";
	private readonly emailConfirmation = "/confirm-email";

	constructor(
		private readonly userRepo: UserRepository,
		@Inject(appConfig.KEY)
		private config: ConfigType<typeof appConfig>,
		private readonly mailService: MailService,
		@Inject(forwardRef(() => AuthService))
		private readonly authService: AuthService,
		@Inject(forwardRef(() => TokensService))
		private readonly tokensService: TokensService,
		@Inject(forwardRef(() => RolesService))
		private readonly rolesService: RolesService,
		@Inject(forwardRef(() => UserBlacklistService))
		private readonly blacklistService: UserBlacklistService
	) {}

	/**
	 * Funktion: setPassword
	 *
	 * Setzt ein neues Passwort für einen Benutzer basierend auf einem Token.
	 * Das Token muss gültig, nicht verwendet und nicht abgelaufen sein.
	 * Nach erfolgreicher Passwortänderung wird der Benutzer eingeloggt.
	 *
	 * @param token - Das Token zur Autorisierung der Passwortänderung
	 * @param password - Das neue Passwort
	 * @param purpose - Der Verwendungszweck des Tokens
	 * @returns Ein Objekt mit Login-Daten oder Tokenstatus
	 */
	async setPassword({ token, password, purpose }: SetPasswordDTO): Promise<UserAuthResponseDTO> {
		const tokenRecord = await this.tokensService.findTokenWithPurpose(token, purpose);
		const status = await this.tokensService.getTokenStatus(tokenRecord);

		if ([ETokenStatus.INVALID, ETokenStatus.USED].includes(status)) {
			return { status };
		}

		const user = await this.userRepo.findById(tokenRecord.user.id);

		if (!user) {
			return { status: ETokenStatus.INVALID };
		}

		if (status === ETokenStatus.EXPIRED) {
			return {
				status,
				email: user.email,
			};
		}

		user.password = password;

		await this.userRepo.save(user);
		await this.tokensService.markAsUsed(tokenRecord);

		return {
			status: ETokenStatus.USED,
			...this.authService.login(user),
		};
	}

	/**
	 * Funktion: confirmEmail
	 *
	 * Bestätigt eine neue E-Mail-Adresse für einen Benutzer.
	 * Die Änderung erfolgt über einen Token mit zugehörigem Änderungswunsch (ChangeRequest).
	 *
	 * @param token - Der Token zur Bestätigung
	 * @param purpose - Der Zweck des Tokens (z. B. "confirm-email")
	 */
	async confirmEmail({ token, purpose }: ConfirmEmailDTO): Promise<void> {
		const tokenRecord = await this.tokensService.findTokenWithChangeRequest(token, purpose);
		const status = await this.tokensService.getTokenStatus(tokenRecord);

		if (status !== ETokenStatus.OPEN) {
			this.logger.warn({ token, status }, "Token status is not open");
			return;
		}

		const user = tokenRecord.user;
		const changeRequest = tokenRecord.changeRequest;

		if (!user) {
			this.logger.warn({ token, status }, "User not found");
			return;
		}

		if (!changeRequest || changeRequest.isAccepted || !changeRequest.changeTo?.email) {
			this.logger.warn(
				{ token, isAccepted: changeRequest.isAccepted, changeTo: changeRequest.changeTo },
				"Invalid change request"
			);
			return;
		}

		user.email = changeRequest.changeTo?.email as string;

		await this.userRepo.save(user);
		await this.tokensService.markAsUsed(tokenRecord);
		await this.tokensService.markChangeRequestAsAccepted(changeRequest);

		return;
	}

	/**
	 * Funktion: refreshToken
	 *
	 * Gibt ein neues Authentifizierungs-Token für den Benutzer zurück.
	 * Wird meist in Kombination mit Refresh-Tokens genutzt.
	 *
	 * @param user - Der Benutzer, für den das Token erneuert werden soll
	 * @returns Authentifizierungsdaten mit neuem Token
	 */
	async refreshToken(user: User): Promise<AuthResponseDTO> {
		return this.authService.login(user);
	}

	/**
	 * Funktion: loginAs
	 *
	 * Meldet sich als ein anderer Benutzer im System an.
	 * Wird meist von Admins genutzt, um andere Accounts zu überprüfen.
	 *
	 * @param id - ID des Benutzers, als der eingeloggt werden soll
	 * @param isRememberMe - Gibt an, ob die Sitzung dauerhaft gespeichert wird
	 * @returns Authentifizierungsdaten des Zielbenutzers
	 */
	async loginAs(
		id: number,
		isRememberMe: boolean = false
	): Promise<TwoFAEnabledDTO | AuthResponseDTO> {
		const user = await this.findOneById(id);
		return this.authService.login(user, isRememberMe);
	}

	/**
	 * Funktion: login
	 *
	 * Meldet einen Benutzer im System an.
	 * Falls Zwei-Faktor-Authentifizierung aktiviert ist, wird ein spezieller Login-Prozess gestartet.
	 *
	 * @param user - Der Benutzer, der sich anmelden möchte
	 * @param isRememberMe - Ob die Sitzung gespeichert werden soll (Remember Me)
	 * @returns Login-Daten oder 2FA-Status
	 */
	async login(user: User, isRememberMe: boolean): Promise<TwoFAEnabledDTO | AuthResponseDTO> {
		if (user.is2FAEnabled) {
			return this.authService.loginWith2fa(user, isRememberMe);
		}

		return this.authService.login(user, isRememberMe);
	}

	/**
	 * Funktion: sendEmailWithToken
	 *
	 * Sendet eine E-Mail mit einem Link, der einen Token enthält.
	 * Der Zweck des Tokens (Einladung, Passwort-Reset, E-Mail-Änderung) wird durch `purpose` bestimmt.
	 * Die Methode erzeugt einen neuen Token und versendet eine passende E-Mail.
	 *
	 * @param user - Der Benutzer, an den die E-Mail gesendet werden soll
	 * @param purpose - Der Verwendungszweck des Tokens
	 * @param email - (optional) neue E-Mail-Adresse bei Änderungszweck
	 * @returns Erzeugter Token
	 */
	async sendEmailWithToken(user: User, purpose: ETokenPurpose, email?: string) {
		const token = getUserToken();
		const url = new URL(this.getUrlByPurpose(purpose), this.config.webAppDomain);
		url.searchParams.append("token", token);

		switch (purpose) {
			case ETokenPurpose.INVITATION:
				await this.mailService.sendUserRegisterEmail(user, url.href);
				break;
			case ETokenPurpose.FORGOTTEN_PASSWORD:
			case ETokenPurpose.RESET_PASSWORD:
				await this.mailService.sendResetPassword(user, url.href);
				break;
			case ETokenPurpose.CHANGE_EMAIL:
				await this.mailService.sendChangeEmail(user, url.href, email);
				break;
		}

		switch (purpose) {
			case ETokenPurpose.INVITATION:
			case ETokenPurpose.FORGOTTEN_PASSWORD:
			case ETokenPurpose.RESET_PASSWORD:
				return this.tokensService.createToken(user, purpose, token);
			case ETokenPurpose.CHANGE_EMAIL:
				return this.tokensService.createTokenWithChangeRequest(user, purpose, token, email);
		}
	}

	/**
	 * Funktion: getUrlByPurpose
	 *
	 * Gibt den Pfad der passenden URL zurück, abhängig vom Zweck des Tokens.
	 *
	 * @param purpose - Zweck des Tokens
	 * @returns String-Pfad der Weiterleitungs-URL
	 */
	getUrlByPurpose(purpose: ETokenPurpose) {
		switch (purpose) {
			case ETokenPurpose.INVITATION:
				return this.registrationUrl;
			case ETokenPurpose.FORGOTTEN_PASSWORD:
			case ETokenPurpose.RESET_PASSWORD:
				return this.setPasswordUrl;
			case ETokenPurpose.CHANGE_EMAIL:
				return this.emailConfirmation;
		}
	}

	/**
	 * Funktion: resendInviteEmail
	 *
	 * Versendet erneut eine Einladung an einen bereits bestehenden Benutzer.
	 * Dabei wird ein neuer Token generiert und per E-Mail verschickt.
	 *
	 * @param userToInvite - Der Benutzer, der erneut eingeladen werden soll
	 * @returns Benutzerinformationen des eingeladenen Benutzers
	 */
	async resendInviteEmail(userToInvite: InviteUserDTO): Promise<UserInfoDTO> {
		const user: User = await this.userRepo.findOneByEmail(userToInvite.email);
		const token = getUserToken();
		const invitationUrl = new URL(this.registrationUrl, this.config.webAppDomain);
		invitationUrl.searchParams.append("token", token);

		await this.mailService.sendUserRegisterEmail(user, invitationUrl.href);
		await this.tokensService.createToken(user, ETokenPurpose.INVITATION, token);

		return new UserInfoDTO(user);
	}

	/**
	 * Funktion: invite
	 *
	 * Lädt eine Liste von Benutzern ins System ein. Existierende Benutzer werden ggf. gelöscht und neu erstellt.
	 * Es wird ein Einladungstoken generiert und per E-Mail verschickt.
	 *
	 * @param data - Ein Array von Benutzer-Einladungsdaten
	 * @param invitingUser - Der Benutzer, der die Einladung ausspricht
	 * @param companyId - Die Firmen-ID, unter der die Benutzer registriert werden sollen
	 * @returns Ein Array von Benutzerinformationen
	 */
	async invite(
		data: InviteUserDTO[],
		invitingUser: User,
		companyId: number
	): Promise<UserInfoDTO[]> {
		const invitedUsers = await Promise.all(
			data?.map(async (userToInvite) => {
				const user: User = await this.userRepo.findOneByEmail(userToInvite.email, true);

				if (user && !user?.deletedAt && !user?.deletedById) {
					throw new DuplicateUserException();
				}

				if (user && user.deletedAt && user.deletedById) {
					user.destroy({ force: true }); // Benutzer hart löschen, falls als gelöscht markiert
				}

				let userCompanyId = invitingUser.companyId;

				if (hasPermission(invitingUser, PermissionCodes.GLOBAL_ADMIN) && companyId) {
					userCompanyId = companyId;
				}

				const newUser: User = this.userRepo.create({
					email: userToInvite.email.trim(),
					roleId: userToInvite.roleId,
					companyId: userCompanyId,
				});

				const savedUser: User = await this.userRepo.save(newUser);

				const token = getUserToken();
				const invitationUrl = new URL(this.registrationUrl, this.config.webAppDomain);
				invitationUrl.searchParams.append("token", token);

				await this.mailService.sendUserRegisterEmail(newUser, invitationUrl.href);
				await this.tokensService.createToken(savedUser, ETokenPurpose.INVITATION, token);

				await savedUser.reload({
					include: [Company],
				});

				return new UserInfoDTO(savedUser);
			})
		);

		return invitedUsers;
	}

	/**
	 * Funktion: findAll
	 *
	 * Sucht und listet Benutzer gemäß Such- und Filterparametern auf.
	 * Admins und Global-Admins können auch Benutzer anderer Firmen sehen.
	 *
	 * @param userSearchParamsDTO - Parameter für Suche, Filterung und Pagination
	 * @param user - Der aktuell eingeloggte Benutzer (zur Rechteprüfung)
	 * @returns Paginierte Liste von Benutzerinformationen
	 */
	async findAll(
		userSearchParamsDTO: UserSearchParamsDTO,
		user: User
	): Promise<PageDTO<UserInfoDTO>> {
		const { value, fieldName, page, skip, limit, companyId, filters, sortBy, sortOrder } =
			userSearchParamsDTO;

		let setCompanyId = user.companyId;

		if (
			(hasPermission(user, PermissionCodes.GLOBAL_ADMIN) ||
				hasPermission(user, PermissionCodes.ADMIN)) &&
			companyId
		) {
			setCompanyId = companyId;
		}

		const { rows, count } = await this.userRepo.findAllAndCount(
			limit,
			skip,
			fieldName,
			value,
			setCompanyId,
			filters,
			sortBy,
			sortOrder
		);

		const pageMetaDto = new PageMetaDTO({
			itemCount: count,
			pageOptions: {
				page,
				limit,
				skip,
			},
		});

		return new PageDTO(
			rows.map((user) => new UserInfoDTO(user)),
			pageMetaDto
		);
	}

	/**
	 * Funktion: findOneByEmail
	 *
	 * Sucht einen Benutzer anhand seiner E-Mail-Adresse.
	 * Lädt zusätzlich Firmen- und Berechtigungsinformationen.
	 *
	 * @param email - E-Mail des gesuchten Benutzers
	 * @returns Benutzerobjekt mit Relationen
	 * @throws UserNotFoundException wenn kein Benutzer gefunden wurde
	 */
	async findOneByEmail(email: string): Promise<User> {
		const user = await this.userRepo.findOneByEmailWithCompanyAndPermissions(email);

		if (!user) {
			throw new UserNotFoundException();
		}

		return user;
	}

	/**
	 * Funktion: findOneById
	 *
	 * Sucht einen Benutzer anhand seiner ID inkl. Firmen- und Berechtigungsdaten.
	 *
	 * @param id - Benutzer-ID
	 * @returns Benutzerobjekt
	 * @throws UserNotFoundException wenn kein Benutzer gefunden wurde
	 */
	async findOneById(id: number): Promise<User> {
		const user = await this.userRepo.findOneByIdWithCompanyAndPermissions(id);

		if (!user) {
			throw new UserNotFoundException();
		}

		return user;
	}

	/**
	 * Funktion: findOneByApiKey
	 *
	 * Sucht einen Benutzer anhand seines API-Schlüssels inkl. Firmen- und Berechtigungsinfos.
	 *
	 * @param apiKey - API-Key des Benutzers
	 * @returns Benutzerobjekt
	 * @throws UserNotFoundException wenn kein Benutzer gefunden wurde
	 */
	async findOneByApiKey(apiKey: string): Promise<User> {
		const user = await this.userRepo.findOneByApiKeyWithCompanyAndPermissions(apiKey);

		if (!user) {
			throw new UserNotFoundException();
		}

		return user;
	}

	/**
	 * Funktion: getUserInfoById
	 *
	 * Gibt Informationen über einen Benutzer zurück – nur erlaubt, wenn gleiche Firma.
	 *
	 * @param id - Benutzer-ID
	 * @param reqUser - Der aktuell eingeloggte Benutzer (zur Prüfung der Berechtigung)
	 * @returns Benutzerinformationen
	 * @throws ForbiddenException wenn Benutzer nicht zur gleichen Firma gehört
	 */
	async getUserInfoById(id: number, reqUser: User): Promise<UserInfoDTO> {
		const user = await this.findOneById(id);

		if (user && user.companyId !== reqUser.companyId) {
			throw new ForbiddenException(Errors.FORBIDDEN);
		}

		return new UserInfoDTO(user);
	}

	/**
	 * Funktion: changePassword
	 *
	 * Ermöglicht es einem Benutzer, sein Passwort zu ändern.
	 * Validiert altes Passwort und die Übereinstimmung der neuen Passwörter.
	 *
	 * @param userId - Benutzer-ID
	 * @param oldPassword - Aktuelles Passwort
	 * @param password - Neues Passwort
	 * @param confirmPassword - Bestätigung des neuen Passworts
	 * @returns Benutzerinformationen
	 * @throws Exceptions bei Fehlern in Eingabe oder Authentifizierung
	 */
	async changePassword(
		userId: number,
		oldPassword: string,
		password: string,
		confirmPassword: string
	): Promise<UserInfoDTO> {
		const user = await this.userRepo.findById(userId);

		if (!user) {
			throw new UserNotFoundException();
		}

		if (!(await user.checkPassword(oldPassword))) {
			throw new IncorrectInputDataException(Errors.INVALID_PASSWORD);
		}

		if (password !== confirmPassword) {
			throw new IncorrectInputDataException(Errors.PASSWORD_MISMATCH);
		}

		user.password = password;
		const updatedUser = await this.userRepo.save(user);

		return new UserInfoDTO(updatedUser);
	}

	/**
	 * Funktion: acceptInvitation
	 *
	 * Akzeptiert eine Benutzer-Einladung basierend auf einem gültigen Token.
	 * Setzt Passwort, Vorname und Nachname des eingeladenen Benutzers.
	 *
	 * @param dto - Einladung mit Token, Passwort und Nutzerdaten
	 * @returns Login-Daten nach erfolgreicher Registrierung
	 */
	async acceptInvitation({
		token,
		password,
		purpose,
		firstName,
		lastName,
	}: AcceptInvitationDto): Promise<UserAuthResponseDTO> {
		const tokenRecord = await this.tokensService.findTokenWithPurpose(token, purpose);
		const status = await this.tokensService.getTokenStatus(tokenRecord);

		if ([ETokenStatus.INVALID, ETokenStatus.USED].includes(status)) {
			return { status };
		}

		const user = await this.userRepo.findById(tokenRecord.user.id);

		if (!user) {
			return { status: ETokenStatus.INVALID };
		}

		if (status === ETokenStatus.EXPIRED) {
			return { status, email: user.email };
		}

		user.password = password;
		user.firstName = firstName.trim();
		user.lastName = lastName.trim();

		await this.userRepo.save(user);
		await this.tokensService.markAsUsed(tokenRecord);

		return {
			status: ETokenStatus.USED,
			...this.authService.login(user),
		};
	}

	/**
	 * Funktion: resetUserPassword
	 *
	 * Löst das Zurücksetzen des Passworts für einen bestimmten Benutzer (z. B. durch Admin) aus.
	 *
	 * @param id - Benutzer-ID
	 * @returns Bestätigung der Aktion
	 */
	async resetUserPassword(id: number): Promise<BaseResponseDTO<null>> {
		const user = await this.userRepo.findById(id);

		if (!user) {
			throw new UserNotFoundException();
		}

		await this.sendEmailWithToken(user, ETokenPurpose.RESET_PASSWORD);

		return { status: "ok" };
	}

	/**
	 * Funktion: resetPassword
	 *
	 * Fordert eine Passwort-Zurücksetzen-E-Mail für eine E-Mail-Adresse an.
	 * Diese Methode wird z. B. im „Passwort vergessen“-Flow genutzt.
	 *
	 * @param email - E-Mail-Adresse des betroffenen Benutzers
	 * @returns Bestätigung der Aktion
	 */
	async resetPassword(email: string): Promise<BaseResponseDTO<null>> {
		const user = await this.userRepo.findOneByEmail(email);

		if (user) {
			await this.sendEmailWithToken(user, ETokenPurpose.FORGOTTEN_PASSWORD);
		}

		return { status: "ok" };
	}

	/**
	 * Funktion: updateUser
	 *
	 * Aktualisiert Benutzerdaten unter Beachtung von Rechteprüfungen.
	 * Nur Benutzer derselben Firma oder Admins mit entsprechender Berechtigung dürfen Änderungen vornehmen.
	 * Prüft zudem, ob die neue E-Mail bereits vergeben ist und leitet ggf. E-Mail-Änderungsprozess ein.
	 *
	 * @param userId - Die ID des zu aktualisierenden Benutzers
	 * @param executingUser - Der Benutzer, der die Änderung durchführt
	 * @param data - Felder, die aktualisiert werden sollen (inkl. optionaler E-Mail)
	 * @returns Aktualisierte Benutzerinformationen
	 */
	async updateUser(
		userId: number,
		executingUser: User,
		{ email, ...data }: Partial<UpdateUserDTO>
	): Promise<UserInfoDTO> {
		const user: User = await this.userRepo.findById(userId);

		if (!user) {
			throw new UserNotFoundException();
		}

		if (
			user.companyId !== executingUser.companyId &&
			(!hasPermission(executingUser, PermissionCodes.GLOBAL_ADMIN) ||
				!hasPermission(executingUser, PermissionCodes.ADMIN))
		) {
			throw new ForbiddenException(Errors.FORBIDDEN);
		}

		if (email) {
			const existingUserEmail: User = await this.userRepo.findOneByEmail(email);

			if (existingUserEmail) {
				throw new DuplicateUserException("Email is already taken.");
			}

			await this.triggerEmailChange(user, email);
		}

		const updatedUser = await this.userRepo.update(user, data);

		return new UserInfoDTO(updatedUser);
	}

	/**
	 * Funktion: update
	 *
	 * Vereinfacht das Aktualisieren eines Benutzers ohne Rechteprüfung.
	 * Wird vermutlich intern verwendet (z. B. durch Admin-Panel).
	 *
	 * @param userId - ID des Benutzers
	 * @param data - Neue Benutzerdaten (z. B. E-Mail, Namen, Rolle etc.)
	 * @returns Aktualisierter Benutzer
	 */
	async update(userId: number, { email, ...data }: Partial<UpdateUserDTO>): Promise<UserInfoDTO> {
		try {
			const user: User = await this.userRepo.findById(userId);

			if (!user) {
				throw new UserNotFoundException();
			}

			if (email) {
				const existingUserEmail: User = await this.userRepo.findOneByEmail(email);

				if (existingUserEmail) {
					throw new DuplicateUserException("Email is already taken.");
				}

				await this.triggerEmailChange(user, email);
			}

			const updatedUser = await this.userRepo.update(user, {
				...data,
			});

			return new UserInfoDTO(updatedUser);
		} catch (e) {
			this.logger.error(e.message, e.stack);
		}
	}

	/**
	 * Funktion: delete
	 *
	 * Löscht (soft delete) einen Benutzer. Der Benutzer wird markiert, aber nicht sofort entfernt.
	 * Nur Benutzer der gleichen Firma oder berechtigte Admins dürfen löschen.
	 *
	 * @param id - ID des zu löschenden Benutzers
	 * @param user - Der Benutzer, der den Löschvorgang ausführt
	 * @returns Objekt mit ID des gelöschten Benutzers
	 */
	async delete(id: number, user: User): Promise<DeleteUserDTO> {
		const foundUser = await this.userRepo.findById(id);

		if (!foundUser) {
			throw new UserNotFoundException();
		} else if (
			foundUser.companyId !== user.companyId &&
			(!hasPermission(user, PermissionCodes.GLOBAL_ADMIN) ||
				!hasPermission(user, PermissionCodes.ADMIN))
		) {
			throw new ForbiddenException(Errors.FORBIDDEN);
		}

		foundUser.deletedById = user.id;
		await foundUser.save();

		const affected = await this.userRepo.deleteById(id);

		if (affected) {
			return {
				userId: id,
			};
		} else {
			throw new UserNotFoundException();
		}
	}

	/**
	 * Funktion: set2FASecret
	 *
	 * Speichert den geheimen Schlüssel für die Zwei-Faktor-Authentifizierung.
	 *
	 * @param userId - Benutzer-ID
	 * @param secret - Geheimnis zur 2FA-Konfiguration
	 * @returns Statusmeldung
	 */
	async set2FASecret(userId: number, secret: string): Promise<{ status: string }> {
		await this.userRepo.updateById(userId, { twoFactorAuthSecret: secret });

		return {
			status: "ok",
		};
	}

	/**
	 * Funktion: disable2FA
	 *
	 * Deaktiviert die Zwei-Faktor-Authentifizierung für einen Benutzer.
	 *
	 * @param userId - ID des Benutzers
	 * @returns Aktualisierte Benutzerinformationen
	 */
	async disable2FA(userId: number): Promise<UserInfoDTO> {
		await this.userRepo.updateById(userId, { twoFactorAuthSecret: "", is2FAEnabled: false });

		const user = await this.findOneById(userId);

		return new UserInfoDTO(user);
	}

	/**
	 * Funktion: enable2FA
	 *
	 * Aktiviert die Zwei-Faktor-Authentifizierung für einen Benutzer.
	 *
	 * @param userId - ID des Benutzers
	 * @returns Benutzerinformationen mit aktivierter 2FA
	 */
	async enable2FA(userId: number): Promise<UserInfoDTO> {
		await this.userRepo.updateById(userId, { is2FAEnabled: true });

		const user = await this.findOneById(userId);

		return new UserInfoDTO(user);
	}

	/**
	 * Funktion: triggerEmailChange
	 *
	 * Interne Hilfsmethode zum Auslösen eines E-Mail-Änderungsprozesses.
	 *
	 * @param user - Der betroffene Benutzer
	 * @param email - Neue E-Mail-Adresse
	 */
	private async triggerEmailChange(user: User, email: string) {
		return this.sendEmailWithToken(user, ETokenPurpose.CHANGE_EMAIL, email);
	}

	/**
	 * Funktion: logout
	 *
	 * Meldet den Benutzer ab, indem das JWT-Token zur Blacklist hinzugefügt wird.
	 *
	 * @param req - Die HTTP-Anfrage mit Benutzer- und Tokeninformationen
	 * @returns Statusmeldung zur Bestätigung
	 */
	async logout(req: RequestWithUser): Promise<BaseResponseDTO<null>> {
		const token = req.headers["authorization"].split(" ")[1];

		await this.blacklistService.blacklistJwt(token);

		return {
			status: "ok",
		};
	}
}
