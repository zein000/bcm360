import { Model } from "sequelize-typescript";
import User from "../../users/models/user.model";
export default class UserBlacklist extends Model {
    id: number;
    value: string;
    expiresAt: Date;
    issuedAt: Date;
    userId?: number;
    user?: User;
    updatedAt: Date;
    createdAt: Date;
}
