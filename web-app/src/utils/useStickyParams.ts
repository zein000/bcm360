import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

export const useStickyParams = (
	param: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	setSearchValue: (val: any) => void,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	searchValue: any
) => {
	const [searchParams, setSearchParams] = useSearchParams();

	const ref = useRef<NodeJS.Timeout>();

	useEffect(() => {
		if (ref.current) {
			clearTimeout(ref.current);
		}

		ref.current = setTimeout(() => {
			if (searchParams.has(param)) {
				const currentVal = searchParams.get(param) || "";

				setSearchValue(currentVal);
			}
		}, 100);
	}, [searchParams, setSearchValue, param]);

	useEffect(() => {
		if (searchValue) {
			if (searchParams.has(param)) {
				searchParams.set(param, searchValue);
			} else {
				searchParams.append(param, searchValue);
			}
		} else if (searchParams.has(param) && !searchValue) {
			searchParams.delete(param);
		}

		setSearchParams(searchParams);
	}, [searchParams, searchValue, setSearchParams, param]);
};
