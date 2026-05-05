import { Injectable } from "@nestjs/common";
import { InternalServerErrorException } from "@nestjs/common/exceptions";

import { Errors } from "src/enums/errors.enum";
import User from "src/users/models/user.model";
import { ERole } from "src/enums/role.enum";
import { hasPermission } from "src/common/user.util";
import { PermissionCodes } from "src/permissions/enum/codes";

import { PageDTO, PageMetaDTO, PageOptionsDTO } from "../common/dto";
import { CreateRoleDTO } from "./dto/create-role.dto";
import { RoleInfoDTO } from "./dto/role-info.dto";
import { UpdateRoleDTO } from "./dto/update-role.dto";
import { RoleNotFoundException } from "./exceptions/role.exceptions";
import { RoleRepository } from "./repositories/role.repository";

import Permission from "../permissions/models/permission.model";
import { PermissionRepository } from "../permissions/repositories/permission.repository";
import { AssignUnassignPermissionsDTO } from "./dto/assign-unassign-permissions.dto";
import Role from "./models/role.model";

/**
 * Klasse: RolesService
 *
 * Dieser Service kapselt die Geschäftslogik rund um die Verwaltung von Rollen (Roles) im System.
 * Er ermöglicht die Erstellung, Bearbeitung, Löschung und Zuweisung von Berechtigungen zu Rollen.
 *
 * Verwendungszweck:
 * - Anbindung an Controller und Repository
 * - Rollenspezifische Berechtigungslogik
 * - Paginierung und Filterung von Rollen abhängig vom Benutzerkontext
 */
@Injectable()
export class RolesService {
	constructor(
		private readonly roleRepo: RoleRepository,
		private readonly permissionRepo: PermissionRepository
	) {}

	/**
	 * Erstellt eine neue Rolle mit optionalen Berechtigungen.
	 */
	async create(data: CreateRoleDTO): Promise<RoleInfoDTO> {
		const { permissions, ...roleData } = data;
		const role = this.roleRepo.build(roleData);
		const result = await this.roleRepo.save(role);

		if (permissions?.length) {
			const permissionResult = await this.permissionRepo.findByCodes(permissions);
			await result.$add("permissions", permissionResult);
		}

		const newResult = await role.reload({ include: Permission });
		return new RoleInfoDTO(newResult);
	}

	/**
	 * Gibt alle sichtbaren Rollen für einen Benutzer zurück.
	 */
	async findAll(user: User, pageOptions: PageOptionsDTO): Promise<PageDTO<RoleInfoDTO>> {
		const types = [ERole.USER];

		if (hasPermission(user, PermissionCodes.GLOBAL_ADMIN)) {
			types.push(ERole.GLOBAL_ADMIN);
		}
		if (hasPermission(user, PermissionCodes.ADMIN)) {
			types.push(ERole.ADMIN);
		}

		const { rows, count } = await this.roleRepo.findAllAndCount(
			pageOptions.limit,
			pageOptions.skip,
			types
		);

		const pageMeta = new PageMetaDTO({ itemCount: count, pageOptions });
		return new PageDTO(rows.map((role) => new RoleInfoDTO(role)), pageMeta);
	}

	/**
	 * Gibt eine einzelne Rolle anhand ihrer ID zurück.
	 */
	async findOneById(id: number): Promise<RoleInfoDTO> {
		const role: Role = await this.roleRepo.findById(id);
		if (!role) throw new RoleNotFoundException();
		return new RoleInfoDTO(role);
	}

	/**
	 * Gibt eine interne `Role` Instanz zurück.
	 */
	async findOneRoleById(id: number): Promise<Role> {
		const role = await this.roleRepo.findById(id);
		if (!role) throw new RoleNotFoundException();
		return role;
	}

	/**
	 * Sucht eine Rolle anhand ihres Codes.
	 */
	async findOneByCode(code: string): Promise<Role> {
		const role = await this.roleRepo.findOneByCode(code);
		if (!role) throw new RoleNotFoundException();
		return role;
	}

	/**
	 * Sucht mehrere Rollen anhand einer Liste von Codes.
	 */
	async findManyByCode(codes: string[]): Promise<Role[]> {
		const roles = await this.roleRepo.findManyByCode(codes);
		if (!roles.length) throw new RoleNotFoundException();
		return roles;
	}

	/**
	 * Aktualisiert eine Rolle und ggf. deren Berechtigungen.
	 */
	async update(id: number, data: UpdateRoleDTO): Promise<RoleInfoDTO> {
		const role = await this.roleRepo.findById(id);
		if (!role) throw new RoleNotFoundException();

		const { permissions, ...roleData } = data;
		await this.roleRepo.update(role.id, roleData);

		if (permissions?.length) {
			const permissionResult = await this.permissionRepo.findByCodes(permissions);
			await role.$set("permissions", permissionResult);
		}

		const newResult = await role.reload({ include: Permission });
		return new RoleInfoDTO(newResult);
	}

	/**
	 * Fügt einer bestehenden Rolle neue Berechtigungen hinzu.
	 */
	async assignPermissions(id: number, data: AssignUnassignPermissionsDTO): Promise<RoleInfoDTO> {
		const role = await this.roleRepo.findById(id);
		if (!role) throw new RoleNotFoundException();

		const allCodes = [...(role.permissions?.map((p) => p.code) ?? []), ...data.permissions];
		const permissionResult = await this.permissionRepo.findByCodes(allCodes);

		await role.$add("permissions", permissionResult);
		const updatedRole = await this.roleRepo.findById(role.id);
		return new RoleInfoDTO(updatedRole);
	}

	/**
	 * Entfernt bestimmte Berechtigungen aus einer Rolle.
	 */
	async unassignPermissions(id: number, data: AssignUnassignPermissionsDTO): Promise<RoleInfoDTO> {
		const role = await this.roleRepo.findById(id);
		if (!role) throw new RoleNotFoundException();

		const remainingPermissions = role.permissions.filter(
			(p) => !data.permissions.includes(p.code)
		);

		const remainingPermissionEntities = await this.permissionRepo.findByIds(
			remainingPermissions.map((p) => p.id)
		);

		await role.$set("permissions", remainingPermissionEntities);
		const updatedRole = await this.roleRepo.findById(role.id);
		return new RoleInfoDTO(updatedRole);
	}

	/**
	 * Löscht eine Rolle aus dem System.
	 */
	async delete(id: number): Promise<{ roleId: number }> {
		const role = await this.roleRepo.findById(id);
		if (!role) throw new RoleNotFoundException();

		try {
			await this.roleRepo.delete(role);
			return { roleId: id };
		} catch (error) {
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR, "Failed to remove the role.");
		}
	}
}
