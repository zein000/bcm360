import { PermissionRoles } from "@/enum";

export interface IConnectedUser {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	isActive: boolean;
	isAccepted?: boolean;
	permissions?: PermissionRoles[];
	isRemoved?: boolean;
}
