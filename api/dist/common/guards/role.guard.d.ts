import { CanActivate, Type } from "@nestjs/common";
import { ERole } from "src/enums/role.enum";
export declare const RoleGuard: (roles: ERole[]) => Type<CanActivate>;
