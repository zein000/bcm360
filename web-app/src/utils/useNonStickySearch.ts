import { useEffect, useRef, useState } from "react";

export const useNonStickySearch = () => {
	const [searchValue, setSearchValue] = useState<string>("");
	const [query, setQuery] = useState<string>("");
	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(10);

	const handleSetPage = (page: number) => {
		setPage(page);
	};

	const searchTimer = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (searchTimer.current) {
			clearTimeout(searchTimer.current);
		}

		searchTimer.current = setTimeout(() => {
			setQuery(searchValue);
		}, 800);
	}, [searchValue]);

	return {
		searchValue,
		setSearchValue,
		query,
		page,
		setPage: handleSetPage,
		limit,
		setLimit,
	};
};
