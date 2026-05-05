import { CanActivate, Type } from "@nestjs/common";
import { PermissionCodes } from "src/permissions/enum/codes";
export declare const PermissionGuard: (permissions: PermissionCodes[]) => Type<CanActivate>;
