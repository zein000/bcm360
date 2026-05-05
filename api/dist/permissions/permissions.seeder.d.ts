import Permission from "./models/permission.model";
export declare class PermissionsSeeder {
    private model;
    private readonly logger;
    constructor(model: typeof Permission);
    seed(): Promise<void>;
}
