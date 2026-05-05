import Role from "src/roles/models/role.model";
import User from "../models/user.model";
export declare class UserRepository {
    private model;
    private roleModel;
    private readonly logger;
    private readonly eagerLoadToken;
    constructor(model: typeof User, roleModel: typeof Role);
    findOneByEmail(email: string, includeDeleted?: boolean): Promise<User>;
    findAllAndCount(limit: number, skip: number, fieldName?: string, value?: string, companyId?: number, filters?: Record<string, string | string[]>, sortBy?: string, sortOrder?: "ASC" | "DESC"): Promise<{
        rows: User[];
        count: number;
    }>;
    findById(id: number): Promise<User>;
    updateRoleById(user: User, id: number): Promise<void>;
    findOneByEmailWithCompany(email: string): Promise<User>;
    findOneByEmailWithCompanyAndPermissions(email: string): Promise<User>;
    findOneByIdWithCompanyAndPermissions(id: number): Promise<User>;
    findOneByApiKeyWithCompanyAndPermissions(apiKey: string): Promise<User>;
    save(user: User): Promise<User>;
    update(user: User, data: Partial<User>): Promise<User>;
    updateById(id: number, data: Partial<User>): Promise<[affectedCount: number]>;
    deleteById(id: number): Promise<number>;
    create(user: Partial<User>): User;
    private buildMatchQuery;
    private toPartialSearch;
    private toFullWordSearch;
    private cleanupWords;
}
