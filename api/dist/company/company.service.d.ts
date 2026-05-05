import User from "src/users/models/user.model";
import { UserInfoCachingService } from "src/caching/services/user-info-caching.service";
import { PageDTO, PageOptionsDTO } from "src/common/dto";
import { CompanyAdminInfoDTO } from "./dto/company-admin-info.dto";
import Company from "./models/company.model";
import { CompanyRepository } from "./repositories/company.repository";
export declare class CompanyService {
    private readonly model;
    private readonly userInfoCachingService;
    private readonly companyRepository;
    private readonly logger;
    constructor(model: typeof Company, userInfoCachingService: UserInfoCachingService, companyRepository: CompanyRepository);
    create(data: Partial<Company>): Promise<CompanyAdminInfoDTO>;
    updateAsAdmin(id: number, data: Partial<Company>): Promise<number>;
    update(data: Partial<Company>, user: User): Promise<number>;
    saveApiKeys(data: Partial<Company>, user: User): Promise<number>;
    findOne(id: number): Promise<CompanyAdminInfoDTO>;
    findAll(pageOptions: PageOptionsDTO): Promise<PageDTO<CompanyAdminInfoDTO>>;
    delete(id: number, user: User): Promise<number>;
    hardDeleteCompaniesThatWereDeleted30DaysAgo(): Promise<void>;
}
