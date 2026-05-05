/**
 * Klasse: UsersController
 *
 * Diese Controller-Klasse verwaltet sämtliche Endpunkte rund um Benutzerverwaltung:
 * Registrierung, Einladung, E-Mail-Bestätigung, Passwort-Setzung, u. v. m.
 * Sie schützt die Endpunkte mit Berechtigungen und nutzt Interceptors zur Ereignisprotokollierung.
 */

import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Logger,
	Param,
	Patch,
	Post,
	Query,
	Request,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";

import {
	ApiBadRequestResponse,
	ApiBody,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import RequestWithUser from "src/interfaces/request-with-user.interface";

import { ChangePasswordDTO } from "./dto/change-password.dto";
import { InviteUserDTO } from "./dto/invite-user.dto";
import { ResetPasswordDTO } from "./dto/reset-password.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";

import { UseJWTWithApiKeyAuthorization } from "../common/decorators/jwt-api-decorators.decorator";
import { BaseResponseDTO } from "../common/dto/base-response.dto";

import { AuthResponseDTO } from "../auth/dto/auth-response.dto";
import { ErrorResponseDTO } from "../auth/dto/error-response.dto";
import { EmailAuthGuard } from "../auth/guards/email-auth-guard.service";

import { JwtRefreshAuthGuard } from "../auth/guards/jwt-refresh-auth.guard";
import { ClearUserInfoCacheInterceptor } from "../caching/interceptors/clear-user-info.interceptor";
import { EventName } from "../enums/event-name.enum";
import { EventHistoryInterceptor } from "../event-history/interceptor/event-history.interceptor";
import { PermissionCodes } from "../permissions/enum/codes";
import { TwoFAEnabledDTO } from "./dto/2fa-enabled.dto";
import { AssignUnassignRolesDTO } from "./dto/assign-unassign-roles.dto";
import { UserAuthResponseDTO } from "./dto/auth-response.dto";
import { ConfirmEmailDTO } from "./dto/confirm-email.dto";
import { DeleteUserDTO } from "./dto/delete-user.dto";
import { LoginDTO } from "./dto/login.dto";
import { PaginatedUsersDTO } from "./dto/paginated-users.dto";
import { SetPasswordDTO } from "./dto/set-password.dto";
import { UserIdParamDTO } from "./dto/user-id-parm.dto";
import { UserInfoDTO } from "./dto/user-info.dto";
import { UserSearchParamsDTO } from "./dto/user-search-params.dto";
import { UsersService } from "./users.service";
import { AcceptInvitationDto } from "./dto/accept-invitation.dto";

@ApiTags("Users")
@Controller("users")
export class UsersController {
	private readonly logger = new Logger(UsersController.name);

	constructor(private readonly usersService: UsersService) {}

	/**
	 * Funktion: setPassword
	 *
	 * Diese Methode erlaubt es einem eingeladenen Benutzer, sein erstes Passwort zu setzen.
	 * Dies geschieht mithilfe eines Einladungstokens, das zuvor per E-Mail versendet wurde.
	 *
	 * @param body - Objekt mit Token, Passwort und optionalem Bestätigungswert
	 * @returns JWT-Zugangsdaten, wenn gültig, sonst Info zur erneuten Einladung
	 */
	@Post("set-password")
	@HttpCode(200)
	@UseInterceptors(EventHistoryInterceptor(EventName.REGISTRATION))
	@ApiOperation({
		description: "User sets password. Authenticates via invitation token",
		summary: "Setup password",
	})
	@ApiOkResponse({
		type: UserAuthResponseDTO,
		description: `Returns token status.
        If token is valid returns authorization token and account info for the user.
        If token is expired returns user email to use for resending invitation`,
	})
	@ApiBadRequestResponse({ type: ErrorResponseDTO, description: "Invalid request data." })
	async setPassword(@Body() body: SetPasswordDTO): Promise<UserAuthResponseDTO> {
		return this.usersService.setPassword(body);
	}

	/**
	 * Funktion: acceptInvitation
	 *
	 * Diese Methode verarbeitet die Annahme einer Benutzereinladung, z. B. durch Klick auf einen Einladungslink.
	 * Dabei wird der Benutzeraccount aktiviert und autorisiert.
	 *
	 * @param invitationData - Informationen aus der Einladung (Token, Benutzerdetails etc.)
	 * @returns JWT-Zugangsdaten für eingeloggten Benutzer
	 */
	@Post("accept-invitation")
	@ApiOperation({
		summary: "User accept invitation",
		description: `**PERMISSIONS: ${PermissionCodes.CHANGE_PASSWORD}**`,
	})
	@UseInterceptors(EventHistoryInterceptor(EventName.REGISTRATION))
	@ApiOkResponse({ type: UserInfoDTO, description: "User account information" })
	@ApiBadRequestResponse({
		type: ErrorResponseDTO,
		description: "Invalid request data",
	})
	async acceptInvitation(
		@Body() invitationData: AcceptInvitationDto
	): Promise<UserAuthResponseDTO> {
		return this.usersService.acceptInvitation(invitationData);
	}

	/**
	 * Funktion: confirmEmail
	 *
	 * Verarbeitet die Bestätigung einer neuen E-Mail-Adresse nach Änderungsanforderung.
	 * Der Benutzer bestätigt die Änderung über einen Token.
	 *
	 * @param body - Token zur Bestätigung der neuen E-Mail
	 * @returns void (Bestätigung erfolgreich)
	 */
	@Post("confirm-email")
	@HttpCode(200)
	@UseInterceptors(EventHistoryInterceptor(EventName.EMAIL_CONFIRMATION))
	@ApiOperation({
		description: "User confirms changed email. Authenticates via token",
		summary: "Confirm email",
	})
	@ApiOkResponse({
		type: UserAuthResponseDTO,
		description: `Returns void.`,
	})
	@ApiBadRequestResponse({ type: ErrorResponseDTO, description: "Invalid request data." })
	async confirmEmail(@Body() body: ConfirmEmailDTO): Promise<void> {
		return this.usersService.confirmEmail(body);
	}

	/**
	 * Funktion: invite
	 *
	 * Lädt neue Benutzer zum System ein, indem ihnen eine Einladung per E-Mail gesendet wird.
	 * Die Einladungen enthalten einen Tokenlink zur Registrierung.
	 *
	 * @param user - Der einladende Admin (aus dem Request-Kontext)
	 * @param body - Liste der einzuladenden Benutzer + optional companyId
	 * @returns Array von Benutzer-DTOs mit Accountinfos
	 */
	@Post("invite")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.INVITE_USER] })
	@ApiOperation({
		summary: "Admin invites user",
		description: `**PERMISSIONS: ${PermissionCodes.INVITE_USER}**`,
	})
	@ApiOkResponse({ type: UserInfoDTO, description: "Returns account info for the user." })
	@ApiBadRequestResponse({
		type: ErrorResponseDTO,
		description: "Invalid request data. Email already exists.",
	})
	async invite(
		@Request() { user }: RequestWithUser,
		@Body() body: { users: InviteUserDTO[]; companyId?: number }
	): Promise<UserInfoDTO[]> {
		return this.usersService.invite(body.users, user, body.companyId);
	}

	/**
	 * Funktion: resendInviteEmail
	 *
	 * Sendet eine bereits bestehende Einladung erneut an eine E-Mail-Adresse.
	 * Nützlich bei Verbindungsfehlern oder nicht erhaltenen Mails.
	 *
	 * @param body - Einladungsdaten (E-Mail etc.)
	 * @returns Benutzerinformationen, an den die Einladung ging
	 */
	@Post("resend-invite")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.INVITE_USER] })
	@ApiOperation({
		summary: "Admin invites user",
		description: `**PERMISSIONS: ${PermissionCodes.INVITE_USER}**`,
	})
	@ApiOkResponse({ type: UserInfoDTO, description: "Returns account info for the user." })
	@ApiBadRequestResponse({
		type: ErrorResponseDTO,
		description: "Invalid request data. Email already exists.",
	})
	async resendInviteEmail(@Body() body: InviteUserDTO): Promise<UserInfoDTO> {
		return this.usersService.resendInviteEmail(body);
	}

	/**
	 * Funktion: findAll
	 *
	 * Gibt eine paginierte Liste aller Benutzer mit optionalen Such- und Filterparametern zurück.
	 * Nur Admins mit entsprechender Berechtigung dürfen diese Abfrage durchführen.
	 *
	 * @param user - Aktuell angemeldeter Benutzer (aus dem Request)
	 * @param userSearchParamsDTO - Parameter für Suche, Filter und Paginierung
	 * @returns Paginiertes Ergebnis mit Benutzerinformationen und Metadaten
	 */
	@Get()
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.GET_USER] })
	@ApiOperation({
		description: `**PERMISSIONS: ${PermissionCodes.GET_USER}**\n\nAdmin gets all users`,
		summary: "Get all users",
	})
	@ApiOkResponse({
		type: PaginatedUsersDTO,
		description: "Paginated list of users with pagination metadata.",
	})
	@ApiBadRequestResponse({ type: ErrorResponseDTO, description: "Invalid request data." })
	findAll(
		@Request() { user }: RequestWithUser,
		@Query() userSearchParamsDTO: UserSearchParamsDTO
	): Promise<PaginatedUsersDTO> {
		this.logger.log(userSearchParamsDTO);
		return this.usersService.findAll(userSearchParamsDTO, user);
	}

	/**
	 * Funktion: findMe
	 *
	 * Gibt Informationen zum aktuell eingeloggten Benutzer zurück.
	 * Verwendet den im JWT enthaltenen Benutzerkontext.
	 *
	 * @param user - Aktueller Benutzer aus Request
	 * @returns Benutzerinformationen im DTO-Format
	 */
	@Get("me")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.GET_ME] })
	@ApiOperation({
		summary: "User gets self",
		description: `**PERMISSIONS: ${PermissionCodes.GET_ME}**`,
	})
	@ApiOkResponse({ type: UserInfoDTO, description: "My user account information" })
	findMe(@Request() { user }: RequestWithUser): UserInfoDTO {
		return new UserInfoDTO(user);
	}

	/**
	 * Funktion: findOneById
	 *
	 * Gibt die Informationen eines bestimmten Benutzers anhand seiner ID zurück.
	 *
	 * @param user - Admin-Benutzer aus dem Request
	 * @param id - Benutzer-ID aus URL
	 * @returns Benutzerinformationen als DTO
	 */
	@Get(":id")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.GET_USER] })
	@ApiOperation({
		summary: "Get user",
		description: `**PERMISSIONS: ${PermissionCodes.GET_USER}**\n\nAdmin gets user by Id`,
	})
	@ApiOkResponse({ type: UserInfoDTO, description: "User account information" })
	findOneById(
		@Request() { user }: RequestWithUser,
		@Param() { id }: UserIdParamDTO
	): Promise<UserInfoDTO> {
		return this.usersService.getUserInfoById(id, user);
	}

	/**
	 * Funktion: changePassword
	 *
	 * Erlaubt dem Benutzer, sein eigenes Passwort zu ändern.
	 * Es muss das aktuelle Passwort sowie ein neues + Bestätigung angegeben werden.
	 *
	 * @param user - Benutzer, der das Passwort ändern möchte
	 * @param oldPassword - aktuelles Passwort
	 * @param password - neues Passwort
	 * @param confirmPassword - Wiederholung des neuen Passworts
	 * @returns Aktuelle Benutzerinformationen nach Änderung
	 */
	@Patch("change-password")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.CHANGE_PASSWORD] })
	@ApiOperation({
		summary: "User changes password",
		description: `**PERMISSIONS: ${PermissionCodes.CHANGE_PASSWORD}**`,
	})
	@ApiOkResponse({ type: UserInfoDTO, description: "User account information" })
	@ApiBadRequestResponse({
		type: ErrorResponseDTO,
		description: "Invalid request data. Invalid old password. Password mismatch",
	})
	async changePassword(
		@Request() { user }: RequestWithUser,
		@Body() { oldPassword, password, confirmPassword }: ChangePasswordDTO
	): Promise<UserInfoDTO> {
		return this.usersService.changePassword(user.id, oldPassword, password, confirmPassword);
	}

	/**
	 * Funktion: resetPassword
	 *
	 * Startet den Prozess zum Zurücksetzen eines Passworts.
	 * Der Benutzer erhält eine E-Mail mit einem Link zur Passwortänderung.
	 *
	 * @param email - E-Mail-Adresse des Benutzers
	 * @returns Bestätigung, dass der Vorgang ausgelöst wurde
	 */
	@Post("reset-password")
	@ApiOperation({
		summary: "User resets password",
	})
	@ApiCreatedResponse({ type: BaseResponseDTO<null> })
	@ApiBadRequestResponse({ type: ErrorResponseDTO, description: "Invalid request data." })
	async resetPassword(@Body() { email }: ResetPasswordDTO): Promise<BaseResponseDTO<null>> {
		return this.usersService.resetPassword(email);
	}

	/**
	 * Funktion: updateMe
	 *
	 * Ermöglicht dem aktuell angemeldeten Benutzer die Änderung seiner eigenen Profildaten.
	 *
	 * @param user - Aktueller Benutzer
	 * @param data - Neue Profildaten
	 * @returns Aktualisierte Benutzerinformationen
	 */
	@Patch()
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.UPDATE_ME] })
	@UseInterceptors(ClearUserInfoCacheInterceptor)
	@ApiOperation({
		summary: "User changes self",
		description: `**PERMISSIONS: ${PermissionCodes.UPDATE_ME}**`,
	})
	@ApiOkResponse({ type: UserInfoDTO, description: "User account information" })
	@ApiBadRequestResponse({ type: ErrorResponseDTO, description: "Invalid request data." })
	updateMe(
		@Request() { user }: RequestWithUser,
		@Body() data: UpdateUserDTO
	): Promise<UserInfoDTO> {
		this.logger.log(data);
		return this.usersService.update(user.id, data);
	}

	/**
	 * Funktion: resetUserPassword
	 *
	 * Löst das Zurücksetzen des Passworts für einen bestimmten Benutzer aus (durch Admin).
	 *
	 * @param id - Benutzer-ID
	 * @returns Bestätigung, dass die Aktion ausgeführt wurde
	 */
	@Post(":id/reset-password")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.UPDATE_USER] })
	@ApiOperation({
		summary: "Admin sends reset password to user",
	})
	@ApiCreatedResponse({ type: BaseResponseDTO<null> })
	@ApiBadRequestResponse({ type: ErrorResponseDTO, description: "Invalid request data." })
	async resetUserPassword(@Param() { id }: UserIdParamDTO): Promise<BaseResponseDTO<null>> {
		return this.usersService.resetUserPassword(id);
	}

	/**
	 * Funktion: updateUser
	 *
	 * Erlaubt es Admins, Benutzerdaten für andere Benutzer zu aktualisieren.
	 *
	 * @param data - Neue Benutzerdaten
	 * @param user - Admin-Benutzer, der die Änderung vornimmt
	 * @param id - ID des Zielbenutzers
	 * @returns Aktualisierte Benutzerinformationen
	 */
	@Patch(":id")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.UPDATE_USER] })
	@UseInterceptors(ClearUserInfoCacheInterceptor)
	@ApiOperation({
		summary: "User changes another user",
		description: `**PERMISSIONS: ${PermissionCodes.UPDATE_USER}**`,
	})
	@ApiOkResponse({ type: UserInfoDTO, description: "User account information" })
	@ApiBadRequestResponse({ type: ErrorResponseDTO, description: "Invalid request data." })
	updateUser(
		@Body() data: UpdateUserDTO,
		@Request() { user }: RequestWithUser,
		@Param() { id }: UserIdParamDTO
	): Promise<UserInfoDTO> {
		return this.usersService.updateUser(id, user, data);
	}

	/**
	 * Funktion: loginAs
	 *
	 * Erlaubt es einem Benutzer mit der Berechtigung `GLOBAL_ADMIN`, sich als ein anderer Benutzer einzuloggen.
	 * Wird häufig für Support- oder Debugging-Zwecke verwendet.
	 *
	 * @param id - Die Benutzer-ID, in deren Namen eingeloggt werden soll
	 * @returns JWT Token(s) und Benutzerinformationen
	 */
	@Post("loginAs")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.GLOBAL_ADMIN] })
	@ApiOperation({
		summary: "User logs in",
	})
	@ApiCreatedResponse({
		type: AuthResponseDTO,
		description: "Returns authorization tokens and account info for the user.",
	})
	@ApiUnauthorizedResponse({ description: "Invalid credentials" })
	@ApiBody({ type: LoginDTO })
	async loginAs(@Body() { id }: { id: number }): Promise<AuthResponseDTO | TwoFAEnabledDTO> {
		return this.usersService.loginAs(id);
	}

	/**
	 * Funktion: login
	 *
	 * Authentifiziert einen Benutzer über seine E-Mail und sein Passwort.
	 * Unterstützt Zwei-Faktor-Authentifizierung und speichert Anmeldeereignis in Event-History.
	 *
	 * @param req - Request mit dem authentifizierten Benutzer
	 * @param body - Login-Daten (E-Mail, Passwort, isRememberMe)
	 * @returns JWT Token(s) und Benutzerinformationen oder 2FA-Status
	 */
	@Post("login")
	@HttpCode(200)
	@UseGuards(EmailAuthGuard)
	@UseInterceptors(EventHistoryInterceptor(EventName.LOGIN))
	@ApiOperation({
		summary: "User logs in",
	})
	@ApiCreatedResponse({
		type: AuthResponseDTO,
		description: "Returns authorization tokens and account info for the user.",
	})
	@ApiUnauthorizedResponse({ description: "Invalid credentials" })
	@ApiBody({ type: LoginDTO })
	async login(
		@Request() req: RequestWithUser,
		@Body() body: LoginDTO
	): Promise<AuthResponseDTO | TwoFAEnabledDTO> {
		return this.usersService.login(req.user, body?.isRememberMe ?? false);
	}

	/**
	 * Funktion: refreshToken
	 *
	 * Generiert neue Zugangstoken auf Basis eines gültigen Refresh-Tokens.
	 * Wird verwendet, um Session ohne erneuten Login zu verlängern.
	 *
	 * @param req - Request mit dem Benutzer und gültigem Refresh-Token
	 * @returns Neue JWT-Token(s) und Benutzerinformationen
	 */
	@Post("refresh-token")
	@HttpCode(200)
	@UseGuards(JwtRefreshAuthGuard)
	@ApiOperation({
		summary: "Refresh JWT token",
	})
	@ApiCreatedResponse({
		type: AuthResponseDTO,
		description: "Returns authorization tokens and account info for the user.",
	})
	@ApiUnauthorizedResponse({ description: "Invalid credentials" })
	async refreshToken(@Request() req: RequestWithUser): Promise<AuthResponseDTO> {
		return this.usersService.refreshToken(req.user);
	}

	/**
	 * Funktion: deleteUser
	 *
	 * Löscht einen Benutzer anhand seiner ID (Soft Delete).
	 * Nur Admins mit entsprechender Berechtigung dürfen dies durchführen.
	 *
	 * @param user - Aktueller Admin-Benutzer aus dem Request
	 * @param id - ID des zu löschenden Benutzers
	 * @returns Informationen zum gelöschten Benutzer
	 */
	@Delete(":id")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.DELETE_USER] })
	@ApiOperation({
		summary: "Deletes user by id",
		description: `**PERMISSIONS: ${PermissionCodes.DELETE_USER}**`,
	})
	@ApiOkResponse({ type: DeleteUserDTO, description: "User information" })
	@ApiBadRequestResponse({ type: ErrorResponseDTO, description: "Invalid request data." })
	deleteUser(
		@Request() { user }: RequestWithUser,
		@Param() { id }: UserIdParamDTO
	): Promise<DeleteUserDTO> {
		return this.usersService.delete(id, user);
	}

	/**
	 * Funktion: logout
	 *
	 * Meldet den Benutzer ab und setzt das aktuell verwendete JWT auf eine Blacklist,
	 * um zukünftige Nutzung zu verhindern.
	 *
	 * @param req - Request mit Benutzerinformationen und verwendetem JWT
	 * @returns OK-Bestätigung nach erfolgreichem Logout
	 */
	@Post("logout")
	@HttpCode(200)
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.LOGOUT] })
	@ApiOperation({
		summary: "Logout the user and blacklist their jwt",
	})
	@ApiCreatedResponse({
		description: "Returns ok and saves the currently used token as blacklisted.",
	})
	@ApiUnauthorizedResponse({ description: "Invalid credentials" })
	async logout(@Request() req: RequestWithUser) {
		return this.usersService.logout(req);
	}
}
