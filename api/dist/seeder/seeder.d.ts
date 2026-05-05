import { UsersSeeder } from "src/users/users.seeder";
import { CompanySeeder } from "src/company/company.seeder";
import { FeaturesSeeder } from "src/features/features.seeder";
import { PermissionsSeeder } from "src/permissions/permissions.seeder";
import { RolesSeeder } from "src/roles/roles.seeder";
import { CourseSeeder } from "src/courses/course.seeder";
export declare class Seeder {
    private readonly permissionsSeeder;
    private readonly rolesSeeder;
    private readonly usersSeeder;
    private readonly companySeeder;
    private readonly coursesSeeder;
    private readonly featuresSeeder;
    private readonly logger;
    constructor(permissionsSeeder: PermissionsSeeder, rolesSeeder: RolesSeeder, usersSeeder: UsersSeeder, companySeeder: CompanySeeder, coursesSeeder: CourseSeeder, featuresSeeder: FeaturesSeeder);
    onModuleInit(): void;
    productionSeed(): Promise<void>;
    seed(): Promise<void>;
}
