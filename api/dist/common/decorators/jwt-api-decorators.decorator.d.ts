import { PermissionCodes } from "src/permissions/enum/codes";
import { FeaturesCodes } from "src/features/enum/codes";
import { ERole } from "../../enums/role.enum";
export declare const UseJWTWithApiKeyAuthorization: ({ roles, permissions, description, feature, }: {
    roles?: ERole[];
    permissions?: PermissionCodes[];
    description?: string;
    feature?: FeaturesCodes;
}) => <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
