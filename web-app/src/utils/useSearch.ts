import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

export enum SortDirection {
	ASC = "ASC",
	DESC = "DESC",
}
export const useSearch = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const paramPageValue = Number(searchParams.get("page")) || 1;
	const paramLimitValue = Number(searchParams.get("limit")) || 10;
	const paramSortColumn = searchParams.get("sortColumn") || "";
	const paramSortOrder = searchParams.get("sortOrder") as SortDirection | undefined;

	const [searchValue, setSearchValue] = useState<string>("");
	const [query, setQuery] = useState<string>("");
	const [page, setPage] = useState<number>(paramPageValue);
	const [limit, setLimit] = useState<number>(paramLimitValue);
	const [sortColumn, setSortColumn] = useState<string>(paramSortColumn);
	const [sortOrder, setSortOrder] = useState<SortDirection | undefined>(paramSortOrder);

	const [filters, setFilters] = useState<Record<string, string | string[]>>({});
	const [debouncedFilters, setDebouncedFilters] = useState<Record<string, string | string[]>>({});

	const searchTimer = useRef<NodeJS.Timeout | null>(null);
	const filterTimer = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		const newFilters: Record<string, string | string[]> = {};

		searchParams.forEach((value, key) => {
			if (!["page", "limit", "search", "sortColumn", "sortOrder"].includes(key)) {
				if (newFilters[key]) {
					newFilters[key] = Array.isArray(newFilters[key])
						? [...(newFilters[key] as string[]), value]
						: [newFilters[key] as string, value];
				} else {
					newFilters[key] = value;
				}
			}
		});

		setFilters(newFilters);
		setDebouncedFilters(newFilters);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (searchTimer.current) {
			clearTimeout(searchTimer.current);
		}

		searchTimer.current = setTimeout(() => {
			setQuery(searchValue);
			setSearchParams((prevParams) => {
				const newParams = new URLSearchParams(prevParams);

				if (searchValue) {
					newParams.set("search", searchValue);
				} else {
					newParams.delete("search");
				}

				return newParams;
			});
		}, 800);

		return () => {
			if (searchTimer.current) {
				clearTimeout(searchTimer.current);
			}

			if (filterTimer.current) {
				clearTimeout(filterTimer.current);
			}
		};
	}, [searchValue, setSearchParams]);

	const handleSetPage = (pageParam: number) => {
		if (pageParam !== page) {
			setPage(pageParam);
			setSearchParams((prevParams) => {
				const newParams = new URLSearchParams(prevParams);

				newParams.set("page", pageParam.toString());

				return newParams;
			});
		}
	};

	const handleSetFilters = (newFilters: Record<string, string | string[]>) => {
		setFilters((prevFilters) => {
			const updatedFilters = { ...prevFilters, ...newFilters };

			Object.keys(updatedFilters).forEach((key) => {
				const value = updatedFilters[key];

				if (Array.isArray(value) ? value.length === 0 : !value) {
					delete updatedFilters[key];
				}
			});

			return updatedFilters;
		});

		if (filterTimer.current) {
			clearTimeout(filterTimer.current);
		}

		filterTimer.current = setTimeout(() => {
			setDebouncedFilters((prevFilters) => {
				const updatedFilters = { ...prevFilters, ...newFilters };

				Object.keys(updatedFilters).forEach((key) => {
					const value = updatedFilters[key];

					if (Array.isArray(value) ? value.length === 0 : !value) {
						delete updatedFilters[key];
					}
				});

				return updatedFilters;
			});

			setSearchParams((prevParams) => {
				const newParams = new URLSearchParams(prevParams);

				Object.keys(newFilters).forEach((key) => newParams.delete(key));

				Object.entries(newFilters).forEach(([key, value]) => {
					if (Array.isArray(value)) {
						value.filter((v) => !!v).forEach((v) => newParams.append(key, v));
					} else if (!!value) {
						newParams.set(key, value);
					}
				});

				return newParams;
			});
		}, 800);
	};

	const handleSetSorting = (fieldName: string, direction?: SortDirection) => {
		setSortColumn(fieldName);
		setSortOrder(direction);

		setSearchParams((prevParams) => {
			const newParams = new URLSearchParams(prevParams);

			if (direction) {
				newParams.set("sortColumn", fieldName);
				newParams.set("sortOrder", direction);
			} else {
				newParams.delete("sortColumn");
				newParams.delete("sortOrder");
			}

			return newParams;
		});
	};

	return {
		searchValue,
		setSearchValue,
		query,
		page,
		setPage: handleSetPage,
		limit,
		setLimit,
		filters,
		debouncedFilters,
		setFilters: handleSetFilters,
		sortColumn,
		sortOrder,
		setSorting: handleSetSorting,
		searchParams,
		setSearchParams,
	};
};
