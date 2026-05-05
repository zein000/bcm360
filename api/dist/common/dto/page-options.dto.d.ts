import { RequestsFilterType } from "src/enums/requests.enum";
export declare class PageOptionsDTO {
    readonly page?: number;
    readonly limit?: number;
    readonly searchValue?: string;
    get skip(): number;
    readonly sortBy?: string;
    readonly sortOrder?: "ASC" | "DESC";
    readonly active?: boolean;
    filters?: Record<string, string | string[]>;
}
export declare class RequestsPageOptionsDTO extends PageOptionsDTO {
    readonly filterType?: RequestsFilterType;
}
export declare class BlacklistPageOptionsDTO extends PageOptionsDTO {
    readonly isGlobal?: boolean;
}
