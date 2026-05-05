import { ETokenPurpose } from "../enums/token-purpose.enum";
import Token from "../models/token.model";
export declare class TokenRepository {
    private model;
    private readonly logger;
    constructor(model: typeof Token);
    findById(id: number): Promise<Token>;
    createToken(token: Token): Promise<Token>;
    findToken(token: string): Promise<Token>;
    findTokenWithPurpose(token: string, purpose: ETokenPurpose): Promise<Token>;
    findTokenWithChangeRequest(token: string, purpose: ETokenPurpose): Promise<Token>;
    findNewerTokens({ token, user, createdAt, purpose }: Token): Promise<Token[]>;
    updateById(id: number, data: Partial<Token>): Promise<[affectedCount: number]>;
}
