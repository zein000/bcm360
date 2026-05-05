import { PageMetaDTO } from "./page-meta.dto";
export declare class PageDTO<T> {
    readonly data: T[];
    readonly meta: PageMetaDTO;
    constructor(data: T[], meta: PageMetaDTO);
}
