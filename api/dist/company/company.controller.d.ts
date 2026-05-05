import RequestWithUser from "src/interfaces/request-with-user.interface";
import { PageDTO, PageOptionsDTO } from "src/common/dto";
import { CompanyService } from "./company.service";
import { CompanyAdminInfoDTO } from "./dto/company-admin-info.dto";
import { CreateCompanyDTO } from "./dto/create-company.dto";
import { UpdateCompanyDTO } from "./dto/update-company.dto";
export declare class CompanyController {
    private readonly companyService;
    private readonly logger;
    constructor(companyService: CompanyService);
    createPerson(data: CreateCompanyDTO): Promise<CompanyAdminInfoDTO>;
    getAll(pageOptions: PageOptionsDTO): Promise<PageDTO<CompanyAdminInfoDTO>>;
    findOne(id: string): Promise<CompanyAdminInfoDTO>;
    update(params: {
        id: number;
    }, data: UpdateCompanyDTO): Promise<number>;
    upload({ user }: RequestWithUser, data: UpdateCompanyDTO): Promise<number>;
    delete(params: {
        id: number;
    }, { user }: RequestWithUser): Promise<number>;
}
