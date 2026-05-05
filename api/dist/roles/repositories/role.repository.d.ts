import { ERole } from "src/enums/role.enum";
import Role from "../models/role.model";
export declare class RoleRepository {
    private model;
    private readonly logger;
    constructor(model: typeof Role);
    findAllAndCount(limit: number, skip: number, types: ERole[]): Promise<{
        rows: Role[];
        count: number;
    }>;
    findById(id: number): Promise<Role>;
    findOneByCode(code: string): Promise<Role>;
    findManyByCode(codes: string[]): Promise<Role[]>;
    build(role: Partial<Role>): Role;
    update(id: number, role: Partial<Role>): Promise<[affectedCount: number]>;
    save(role: Role): Promise<Role>;
    delete(role: Role): Promise<void>;
}
