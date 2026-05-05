import Permission from "../models/permission.model";
export declare class PermissionRepository {
    private model;
    private readonly logger;
    constructor(model: typeof Permission);
    findAllAndCount(limit: number, skip: number): Promise<{
        rows: Permission[];
        count: number;
    }>;
    findById(id: number): Promise<Permission>;
    findByIds(ids: number[]): Promise<Permission[]>;
    findByCodes(codes: string[]): Promise<Permission[]>;
    updateById(id: number, data: Partial<Permission>): Promise<[affectedCount: number]>;
    deleteById(id: number): Promise<number>;
}
