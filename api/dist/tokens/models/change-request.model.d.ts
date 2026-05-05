import { Model } from "sequelize-typescript";
import Token from "../../tokens/models/token.model";
export default class ChangeRequest extends Model {
    id: number;
    tokenId?: number;
    token?: Token;
    changeFrom: Record<string, unknown>;
    changeTo: Record<string, unknown>;
    isAccepted?: boolean;
    updatedAt: Date;
    createdAt: Date;
}
