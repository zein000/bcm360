import { InclusionFilterStatus } from "src/enums/list.enum";
export interface FilterUnassignedTable {
    name?: string;
    email?: string;
    linkedinUrl?: string;
    country?: string;
    city?: string;
    state?: string;
    company?: string;
    companyCountry?: string;
    companyState?: string;
    companyCity?: string;
    companyLinkedinUrl?: string;
    title?: string;
    seniority?: string;
    inclusionStatus?: InclusionFilterStatus;
    event?: {
        name: string;
        id: number;
    }[];
}
