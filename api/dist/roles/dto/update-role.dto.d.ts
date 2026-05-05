import { CreateRoleDTO } from "./create-role.dto";
export declare class UpdateRoleDTO extends CreateRoleDTO {
    name: string;
    code: string;
    description?: string;
}
