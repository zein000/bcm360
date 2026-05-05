import { Model } from "sequelize-typescript";
import ChangeRequest from "./change-request.model";
import User from "../../users/models/user.model";
import { ETokenPurpose } from "../enums/token-purpose.enum";
export default class Token extends Model {
    id: number;
    userId?: number;
    user?: User;
    purpose: ETokenPurpose;
    token: string;
    isUsed: boolean;
    updatedAt: Date;
    createdAt: Date;
    changeRequest?: ChangeRequest;
}
