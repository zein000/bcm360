export interface PaginationMeta {
	page: number;
	limit: number;
	itemCount: number;
	pageCount: number;
	hasPreviousPage: boolean;
	hasNextPage: boolean;
}
export interface SortParams {
	sortBy: string;
	sortOrder: Order;
}

export interface PaginationParams {
	page: number;
	sortParams?: SortParams;
}

export interface PaginationSortParams {
	page: number;
	sortParams: SortParams;
}

export enum Order {
	ASC = "ASC",
	DESC = "DESC",
}
