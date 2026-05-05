import { Injectable } from "@nestjs/common";

import { PageDTO, PageMetaDTO, PageOptionsDTO } from "../common/dto";
import { PermissionRepository } from "./repositories/permission.repository";

import { PermissionInfoDTO } from "./dto/permission-info.dto";
import { UpdatePermissionDTO } from "./dto/update-permission.dto";
import { PermissionNotFoundException } from "./exceptions/permission.exceptions";
import Permission from "./models/permission.model";

/**
 * Klasse: PermissionsService
 *
 * Dieser Service kapselt die Geschäftslogik für den Umgang mit Berechtigungen (Permissions).
 * Er stellt Funktionen zum Abrufen, Aktualisieren und Löschen von Berechtigungen bereit
 * und kommuniziert dabei mit dem `PermissionRepository` für Datenbankoperationen.
 *
 * Verwendungszweck:
 * - Zentrale Logikschicht zwischen Controller und Datenbank
 * - Paginierung, Fehlerbehandlung und DTO-Mapping für Permissions
 */
@Injectable()
export class PermissionsService {
	constructor(private readonly permissionRepo: PermissionRepository) {}

	/**
	 * Funktion: findAll
	 *
	 * Gibt eine paginierte Liste aller Berechtigungen zurück.
	 *
	 * @param pageOptions - Optionen zur Steuerung von Limit, Offset, Sortierung etc.
	 * @returns PageDTO mit Liste von PermissionInfoDTOs und Metainformationen
	 */
	async findAll(pageOptions: PageOptionsDTO): Promise<PageDTO<PermissionInfoDTO>> {
		const { rows, count } = await this.permissionRepo.findAllAndCount(
			pageOptions.limit || 1000,
			pageOptions.skip
		);

		const pageMeta = new PageMetaDTO({ itemCount: count, pageOptions });

		return new PageDTO(
			rows.map((permission) => new PermissionInfoDTO(permission)),
			pageMeta
		);
	}

	/**
	 * Funktion: findOneById
	 *
	 * Findet eine Berechtigung anhand der ID und gibt sie als DTO zurück.
	 *
	 * @param id - ID der Berechtigung
	 * @throws PermissionNotFoundException, wenn keine Berechtigung gefunden wurde
	 * @returns PermissionInfoDTO mit den Details zur Berechtigung
	 */
	async findOneById(id: number): Promise<PermissionInfoDTO> {
		const permission: Permission = await this.permissionRepo.findById(id);

		if (permission) {
			return new PermissionInfoDTO(permission);
		} else {
			throw new PermissionNotFoundException();
		}
	}

	/**
	 * Funktion: update
	 *
	 * Aktualisiert eine vorhandene Berechtigung mit neuen Werten.
	 *
	 * @param id - ID der zu aktualisierenden Berechtigung
	 * @param data - Teilweise neue Werte für die Berechtigung (z. B. Name, Beschreibung)
	 * @throws PermissionNotFoundException, wenn die Berechtigung nicht existiert
	 * @returns Aktualisierte Berechtigung als DTO
	 */
	async update(id: number, data: Partial<UpdatePermissionDTO>): Promise<PermissionInfoDTO> {
		const permission: Permission = await this.permissionRepo.findById(id);

		if (!permission) {
			throw new PermissionNotFoundException();
		}

		await this.permissionRepo.updateById(id, data);

		const updatedPermission: Permission = await this.permissionRepo.findById(permission.id);

		return new PermissionInfoDTO(updatedPermission);
	}

	/**
	 * Funktion: delete
	 *
	 * Löscht eine Berechtigung anhand der ID.
	 *
	 * @param id - ID der zu löschenden Berechtigung
	 * @throws PermissionNotFoundException, wenn keine Berechtigung gelöscht wurde
	 * @returns Objekt mit der ID der gelöschten Berechtigung
	 */
	async delete(id: number): Promise<{ permissionId: number }> {
		const affectedCount = await this.permissionRepo.deleteById(id);

		if (affectedCount) {
			return {
				permissionId: id,
			};
		} else {
			throw new PermissionNotFoundException();
		}
	}
}
