import UserBlacklist from "../models/user-blacklist.model";
export declare class UserBlacklistRepo {
    private model;
    private readonly logger;
    constructor(model: typeof UserBlacklist);
    create(blacklist: Partial<UserBlacklist>): Promise<UserBlacklist>;
    save(blacklist: UserBlacklist): Promise<UserBlacklist>;
    findOneByValue(value: string): Promise<UserBlacklist>;
    findAll(): Promise<UserBlacklist[]>;
    deleteExpired(): Promise<UserBlacklist[]>;
}
