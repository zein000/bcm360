import { faChevronDown, faChevronUp } from "@fortawesome/pro-regular-svg-icons";

import { SortDirection } from "@/utils/useSearch";

import { Icon } from "../Icon/Icon";

interface TableSortProps {
	sortDirection?: SortDirection;
	fieldName?: string;
	sortColumn?: string;
	setSortDirection?: (fieldName: string, sortDirection?: SortDirection) => void;
}

export default function TableSort({
	sortDirection,
	setSortDirection,
	fieldName,
	sortColumn,
}: TableSortProps) {
	if (!setSortDirection || !fieldName) {
		return <></>;
	}

	const handleChangeDirection = () => {
		if (sortColumn !== fieldName) {
			setSortDirection(fieldName, SortDirection.DESC);

			return;
		} else if (!sortDirection) {
			setSortDirection(fieldName, SortDirection.ASC);

			return;
		} else if (sortDirection === SortDirection.ASC) {
			setSortDirection(fieldName, SortDirection.DESC);

			return;
		} else {
			setSortDirection(fieldName, undefined);

			return;
		}
	};

	return (
		<button className="ml-2 absolute top-1/2 -translate-y-1/2" onClick={handleChangeDirection}>
			<div className="flex flex-col h-6">
				{(!sortDirection ||
					sortColumn !== fieldName ||
					(sortDirection === SortDirection.ASC && sortColumn === fieldName)) && (
					<Icon className="w-3 h-3 mb-auto" icon={faChevronUp} />
				)}
				{(!sortDirection ||
					sortColumn !== fieldName ||
					(sortDirection === SortDirection.DESC && sortColumn === fieldName)) && (
					<Icon className="w-3 h-3 mt-auto" icon={faChevronDown} />
				)}
			</div>
		</button>
	);
}
