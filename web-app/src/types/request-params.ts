import { SortDirection } from "@/utils/useSearch";

import { SortParams } from "./types";

export interface RequestPaginationParams {
	page: number;
	limit: number;
	fieldName?: string;
	searchValue?: string;
	campaignFilter?: string;
	companySearch?: string;
	campaignId?: number;
	sorting?: SortParams;
	active?: boolean;
	archived?: boolean;
	sourceType?: string;
	companyId?: number;
	signalsIn?: string;
	filters?: Record<string, string | string[]>;
	sortBy?: string;
	sortOrder?: SortDirection;
}
