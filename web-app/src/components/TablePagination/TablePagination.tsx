import { faArrowLeft, faArrowRight } from "@fortawesome/pro-regular-svg-icons";
import { FunctionComponent } from "react";

import { classNames } from "@/utils/classNames";

import { Icon } from "../Icon/Icon";
import { AutoCompleteItem } from "../Dropdown/Dropdown";
import { FilterDropdown } from "../FilterDropdown.tsx/FilterDropdown";

interface TablePaginationProps {
	currentPage: number;
	handleNavigateToPage: (page: number) => void;
	maxPage: number;
	limit: number;
	handleChangeRowsPerPage?: (rowsPerPage: number) => void;
	className?: string;
}

export const TablePagination: FunctionComponent<TablePaginationProps> = ({
	currentPage,
	handleNavigateToPage,
	handleChangeRowsPerPage,
	limit,
	maxPage,
	className,
}) => {
	const renderPages = () => {
		const allPages: { page: number; text: number | string }[] = [];
		const pageButtons: JSX.Element[] = [];

		for (let i = 1; i <= maxPage; i++) {
			allPages.push({ page: i, text: i });
		}

		if (maxPage > 7) {
			if (currentPage <= 4) {
				const itemsToBeDeleted = maxPage - 7;

				allPages.splice(6, itemsToBeDeleted, { page: 7, text: "..." });
			} else if (currentPage >= maxPage - 3) {
				const itemsToBeDeleted = maxPage - 7;

				allPages.splice(1, itemsToBeDeleted, { page: maxPage - 6, text: "..." });
			} else {
				allPages.splice(1, maxPage - 2);
				allPages.splice(
					1,
					0,
					...[
						{ page: currentPage - 2, text: "..." },
						{ page: currentPage - 1, text: currentPage - 1 },
						{ page: currentPage, text: currentPage },
						{ page: currentPage + 1, text: currentPage + 1 },
						{ page: currentPage + 2, text: "..." },
					]
				);
			}
		}

		allPages.forEach((pageItem) => {
			const { page, text } = pageItem;

			pageButtons.push(
				<div
					key={`pagination-page-${page}`}
					className={classNames(
						"sm:px-2 text-sm pt-4 px-4 border-t-[2px] -mt-[1px] cursor-pointer",
						currentPage === page
							? "border-t-action text-blue-action"
							: "border-t-transparent text-gray-700"
					)}
					onClick={() => {
						handleNavigateToPage(page);
					}}
				>
					{text}
				</div>
			);
		});

		return pageButtons;
	};

	const handleGoToPage = (page: number) => {
		if (page === 0 || page > maxPage) {
			return;
		}

		handleNavigateToPage(page);
	};

	return (
		<div className={classNames("inline-flex items-center w-full	pb-40", className)}>
			{handleChangeRowsPerPage && (
				<div className="mr-10 self-right">
					<FilterDropdown
						data={[
							{
								title: "15 per page",
								id: 15,
							},
							{
								title: "25 per page",
								id: 25,
							},
							{
								title: "50 per page",
								id: 50,
							},
							{
								title: "100 per page",
								id: 100,
							},
						]}
						floating={true}
						handleSelect={(value: AutoCompleteItem) => {
							if (value.id !== limit) {
								handleChangeRowsPerPage?.(value.id as number);
							}
						}}
						value={{ title: `${limit} per page`, id: limit }}
					/>
				</div>
			)}
			<div className="inline-flex items-center border-t border-t-border">
				<div className={classNames("mr-auto flex justify-start pt-4 flex-grow flex-shrink")}>
					<div
						className={classNames(
							"text-sm flex items-center justify-end",
							currentPage === 1 ? "text-gray-200" : "text-gray-700 cursor-pointer"
						)}
						onClick={() => handleGoToPage(currentPage - 1)}
					>
						<Icon className="ml-3.5" icon={faArrowLeft} />
					</div>
				</div>
				<div className="flex justify-center flex-grow">{renderPages()}</div>
				<div className={classNames("ml-auto flex justify-end pt-4 flex-grow flex-shrink")}>
					<div
						className={classNames(
							"text-sm flex items-center justify-end",
							currentPage >= maxPage ? "text-gray-200" : "text-gray-700 cursor-pointer"
						)}
						onClick={() => handleGoToPage(currentPage + 1)}
					>
						<Icon className="ml-3.5" icon={faArrowRight} />
					</div>
				</div>
			</div>
		</div>
	);
};
