import { PageMetaParametersDTO } from "../interfaces";
export declare class PageMetaDTO {
    readonly page: number;
    readonly limit: number;
    readonly itemCount: number;
    readonly pageCount: number;
    readonly hasPreviousPage: boolean;
    readonly hasNextPage: boolean;
    constructor({ pageOptions, itemCount }: PageMetaParametersDTO);
}
