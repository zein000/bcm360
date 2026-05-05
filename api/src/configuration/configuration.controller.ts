import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Request } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { UseJWTWithApiKeyAuthorization } from "../common/decorators/jwt-api-decorators.decorator";
import RequestWithUser from "../interfaces/request-with-user.interface";
import { PermissionCodes } from "../permissions/enum/codes";
import { ConfigurationService } from "./configuration.service";
import { AddConfigurationRequestDTO } from "./dtos/add-configuration-request.dto";
import { ConfigurationParamRequestDTO } from "./dtos/configuration-param-request.dto";
import { ConfigurationResponseDTO } from "./dtos/configuration-response.dto";
import { UpdateConfigurationRequestDTO } from "./dtos/update-configuration-request.dto";

/**
 * Klasse: ConfigurationController
 *
 * Dieser Controller stellt API-Endpunkte zur Verwaltung von systemweiten Konfigurationen bereit.
 * Zugriff ist nur mit gültigem JWT-Token und entsprechender Berechtigung (MANAGE_CONFIGURATION) möglich.
 *
 * Funktionen:
 * - Konfigurationen auslesen (alle oder einzeln)
 * - Neue Konfigurationen erstellen
 * - Bestehende aktualisieren oder löschen
 * - Upsert (create or update)
 */
@ApiTags("Configurations")
@Controller("configurations")
export class ConfigurationController {
	constructor(private readonly configService: ConfigurationService) {}

	/**
	 * Funktion: findAll
	 *
	 * Gibt eine Liste aller Konfigurationen zurück, die im System vorhanden sind.
	 * Nur für Admins mit entsprechender Berechtigung.
	 *
	 * @returns Array von Konfigurationsobjekten
	 */
	@Get()
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.MANAGE_CONFIGURATION] })
	@ApiOperation({
		description: "Admin gets all configurations",
		summary: "Get all configurations",
	})
	@ApiOkResponse({
		type: ConfigurationResponseDTO,
		isArray: true,
		description: "Configuration data",
	})
	findAll() {
		return this.configService.findAll();
	}

	/**
	 * Funktion: find
	 *
	 * Gibt eine einzelne Konfiguration anhand ihres Namens zurück.
	 * Die Konfiguration wird firmenspezifisch geladen.
	 *
	 * @param name - Der eindeutige Name der Konfiguration (aus URL-Parametern)
	 * @param user - Der aktuelle Benutzer (enthält z. B. die companyId)
	 * @returns Das Konfigurationsobjekt
	 */
	@Get(":name")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.MANAGE_CONFIGURATION] })
	@ApiOperation({
		description: "Admin gets configuration by name",
		summary: "Get configuration by name",
	})
	@ApiOkResponse({ type: ConfigurationResponseDTO, description: "Configuration data" })
	find(@Param() { name }: ConfigurationParamRequestDTO, @Request() { user }: RequestWithUser) {
		return this.configService.find(name, user.companyId);
	}

	/**
	 * Funktion: createConfig
	 *
	 * Erstellt eine neue Konfiguration für das System.
	 *
	 * @param user - Der Benutzer, der die Konfiguration erstellt
	 * @param name - Name der Konfiguration
	 * @param value - Wert der Konfiguration
	 * @returns Das erstellte Konfigurationsobjekt
	 */
	@Post()
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.MANAGE_CONFIGURATION] })
	@ApiOperation({
		description: "Admin creates configuration",
		summary: "Create configuration",
	})
	@ApiCreatedResponse({ type: ConfigurationResponseDTO, description: "Configuration data" })
	createConfig(
		@Request() { user }: RequestWithUser,
		@Body() { name, value }: AddConfigurationRequestDTO
	) {
		return this.configService.create(user, name, value);
	}

	/**
	 * Funktion: upsertConfig
	 *
	 * Erstellt oder aktualisiert eine Konfiguration, je nachdem ob sie bereits existiert.
	 *
	 * @param name - Name der Konfiguration
	 * @param user - Der Benutzer, der die Änderung vornimmt
	 * @param value - Neuer Wert der Konfiguration
	 * @returns Das erstellte oder aktualisierte Konfigurationsobjekt
	 */
	@Put(":name")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.MANAGE_CONFIGURATION] })
	@ApiOperation({
		description: "Admin creates or updates configuration",
		summary: "Create or update configuration",
	})
	@ApiOkResponse({ type: ConfigurationResponseDTO, description: "Configuration data" })
	upsertConfig(
		@Param() { name }: ConfigurationParamRequestDTO,
		@Request() { user }: RequestWithUser,
		@Body() { value }: UpdateConfigurationRequestDTO
	) {
		return this.configService.upsert(user, name, value);
	}

	/**
	 * Funktion: updateConfig
	 *
	 * Aktualisiert nur den Wert einer bestehenden Konfiguration.
	 *
	 * @param name - Name der Konfiguration
	 * @param user - Der Benutzer, der die Änderung vornimmt
	 * @param value - Neuer Wert der Konfiguration
	 * @returns Das aktualisierte Konfigurationsobjekt
	 */
	@Patch(":name")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.MANAGE_CONFIGURATION] })
	@ApiOperation({
		description: "Admin updates configuration",
		summary: "Update configuration",
	})
	@ApiOkResponse({ type: ConfigurationResponseDTO, description: "Configuration data" })
	updateConfig(
		@Param() { name }: ConfigurationParamRequestDTO,
		@Request() { user }: RequestWithUser,
		@Body() { value }: UpdateConfigurationRequestDTO
	) {
		return this.configService.update(user, name, value);
	}

	/**
	 * Funktion: deleteConfig
	 *
	 * Löscht eine Konfiguration anhand ihres Namens.
	 *
	 * @param name - Name der zu löschenden Konfiguration
	 * @param user - Der Benutzer, der die Löschung anstößt
	 * @returns Das gelöschte Konfigurationsobjekt
	 */
	@Delete(":name")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.MANAGE_CONFIGURATION] })
	@ApiOperation({
		description: "Admin deletes configuration",
		summary: "Delete configuration",
	})
	@ApiOkResponse({ type: ConfigurationResponseDTO, description: "Configuration data" })
	deleteConfig(
		@Param() { name }: ConfigurationParamRequestDTO,
		@Request() { user }: RequestWithUser
	) {
		return this.configService.delete(user, name);
	}
}
