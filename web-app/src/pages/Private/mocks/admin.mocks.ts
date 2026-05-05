import { GetAllRolesResponse } from "@/types/admin";

export const rolesMock: GetAllRolesResponse = {
	data: [],
	meta: {
		page: 1,
		limit: 10,
		itemCount: 2,
		pageCount: 1,
		hasPreviousPage: false,
		hasNextPage: false,
	},
};
