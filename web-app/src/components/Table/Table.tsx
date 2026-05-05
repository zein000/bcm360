import { Fragment, FunctionComponent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IconDefinition } from "@fortawesome/pro-regular-svg-icons";

import { Order, SortParams } from "@/types/types";
import { classNames } from "@/utils/classNames";

import { ReactComponent as ArrowDown } from "@assets/icons/table/arrow-down-sort.svg";
import { ReactComponent as ArrowUp } from "@assets/icons/table/arrow-up-sort.svg";

import { ButtonColor, ButtonSize } from "../Button/types";
import { Icon } from "../Icon/Icon";

import { Button } from "../Button/Button";

import "./table.css";
import { SvgIcon } from "../Icon/SvgIcon";
import { TableFooter } from "../TableFooter/TableFooter";
import { Spinner } from "../Spinner/Spinner";
import { TablePagination } from "../TablePagination/TablePagination";

export interface TableColumn {
	title: string;
	render: (item: any, index?: number) => JSX.Element; //eslint-disable-line
	width?: number | string;
	minWidth?: number | string;
	maxWidth?: number | string;
	align?: "left" | "right";
	allowExpanding?: boolean;
	orderTitle?: string;
	orderStatus?: number;
	icon?: IconDefinition;
	svgIcon?: string;
	show?: boolean;
	onHeaderClick?: (category: string) => void;
	uid?: string;
	allowExclude?: boolean;
	locked?: string;
	hideable?: boolean;
	moveable?: boolean;
}

interface TableProps {
	data: any[]; //eslint-disable-line
	overallCount?: number;
	isLoading?: boolean;
	isFetching?: boolean;
	columns: TableColumn[];
	page?: number;
	handleSorting?: (category: SortParams) => void;
	noDataText?: string;
	noDataCta?: {
		title: string;
		action: () => void;
	};
	testId?: string;
	hideFooter?: boolean;
	showFooterFunctions?: boolean;
	handleExport?: () => void;
	handleArchive?: () => void;
	handleDelete?: () => void;
	currentlyDownloadingSelected?: boolean;
	hideColumnsCount?: boolean;
	handleFetchMore?: () => void;
	totalPages?: number;
	handleFetchPage?: (page: number) => void;
	handleChangeRowsPerPage?: (rowsPerPage: number) => void;
	limit?: number;
	hidePagination?: boolean;
	handleRowClick?: (id: number) => void; //eslint-disable-line
	listBuilder?: boolean;
}

export const Table: FunctionComponent<TableProps> = ({
	data,
	overallCount,
	isLoading = false,
	isFetching = false,
	columns,
	handleSorting,
	handleFetchMore,
	page,
	noDataText,
	noDataCta,
	testId,
	hideFooter,
	showFooterFunctions,
	handleExport,
	handleArchive,
	handleDelete,
	currentlyDownloadingSelected,
	hideColumnsCount,
	totalPages = 1,
	handleFetchPage,
	handleChangeRowsPerPage,
	limit = 15,
	hidePagination,
	handleRowClick,
	listBuilder,
}) => {
	const { t } = useTranslation();

	const [sortedColumn, setSortedColumn] = useState<null | number>(0);
	const [columnData, setColumnData] = useState(columns);
	const [currentPage, setCurrentPage] = useState(page || 1);

	useEffect(() => {
		if (JSON.stringify(columns) !== JSON.stringify(columnData)) {
			columns.forEach((column, index) => {
				if (column?.uid === columnData[index]?.uid) {
					column.orderStatus = columnData[index].orderStatus;
				}
			});
			setColumnData(columns);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [columns]);

	const setPage = (page: number) => {
		if (handleFetchPage) {
			handleFetchPage(page);
		}

		setCurrentPage(page);
	};

	const startIndex = (currentPage - 1) * limit;

	const renderSkeleton = () => {
		const rows: JSX.Element[] = [];

		for (let i = 1; i <= 10; i++) {
			const el: JSX.Element = (
				<tr key={`skeleton-row-${i}`}>
					{columns
						.filter((c) => c.show === true || c.show === undefined)
						.map((item, colindex) => (
							<td
								key={`skeleton-${i}-${colindex}`}
								className="px-2 py-[10px] text-sm font-normal leading-6 duration-200 border-t border-t-border"
							>
								<div className="relative h-5 overflow-hidden">
									<div className="c-animated-background" />
								</div>
							</td>
						))}
				</tr>
			);

			rows.push(el);
		}

		return rows;
	};

	const loadMoreData = useCallback(() => {
		if (handleFetchMore && !isFetching && currentPage < totalPages) {
			handleFetchMore();
		}
	}, [currentPage, handleFetchMore, isFetching, totalPages]);

	useEffect(() => {
		const tableContainer = document.querySelector("#table-block");

		const isLastElementVisible = () => {
			const tableBody = document.querySelector("#outlet-container tbody");
			const lastRow = tableBody?.lastElementChild;

			if (lastRow && tableContainer) {
				const containerRect = tableContainer.getBoundingClientRect();
				const lastRowRect = lastRow.getBoundingClientRect();

				if (lastRowRect.bottom <= containerRect.bottom) {
					loadMoreData();
				}
			}
		};

		const handleScroll = () => {
			isLastElementVisible();
		};

		tableContainer?.addEventListener("scroll", handleScroll);

		isLastElementVisible();

		return () => {
			tableContainer?.removeEventListener("scroll", handleScroll);
		};
	}, [loadMoreData]);

	const handleSortColumn = (index: number, category: string) => {
		const newColumnData = [...columnData];

		if (index === sortedColumn) {
			newColumnData[index].orderStatus = (newColumnData[index].orderStatus! + 1) % 3;
		} else {
			newColumnData[index].orderStatus = 1;
		}

		setColumnData(newColumnData);

		let sortOrder = Order.ASC;

		if (newColumnData[index].orderStatus === 2) {
			sortOrder = Order.DESC;
		}

		const sortParams: SortParams = {
			sortBy: category,
			sortOrder: sortOrder,
		};

		if (handleSorting) {
			handleSorting(sortParams);
		}

		setSortedColumn(index);
	};

	return (
		<div className="w-full sticky">
			<div className={`overflow-y-auto w-full sticky top-[0]`} id="table-block">
				<table
					className="w-full mb-8 text-left rounded-lg border-separate border-white "
					data-test={testId}
				>
					<colgroup>
						{columns
							.filter((c) => c.show || c.show === undefined)
							.map(({ width, minWidth, maxWidth, locked }, index) => {
								return (
									<col
										key={"col-" + index}
										className={classNames(
											"border-white",
											width === "fit-content" ? "whitespace-nowrap" : "",
											minWidth ? `min-w-[${minWidth}]` : "",
											maxWidth ? `max-w-[${maxWidth}]` : "",
											locked ? `sticky ${locked}` : ""
										)}
										style={{
											width: width || "auto",
											minWidth: minWidth || "auto",
											maxWidth: maxWidth || "auto",
											left: locked || "auto",
										}}
									/>
								);
							})}
					</colgroup>
					<thead>
						<tr className="">
							{columnData
								.filter((c) => c.show || c.show === undefined)
								.map((column, index) => {
									const { align = "left", orderTitle, orderStatus, onHeaderClick, locked } = column;

									return (
										<th
											key={`th-${index}`}
											className={classNames(
												"px-2 py-3 text-xs font-medium text-table-header border-white",
												listBuilder ? "sticky top-0 z-10 bg-white" : "",
												align === "left" ? "text-left" : "text-right",
												columns[index]?.width === "fit-content" ? "whitespace-nowrap" : "",
												columns[index]?.minWidth ? `min-w-${column.minWidth}` : "",
												columns[index]?.maxWidth ? `max-w-${column.maxWidth}` : "",
												locked ? `sticky ${locked}` : ""
											)}
										>
											{onHeaderClick ? (
												<div
													className="flex items-center cursor-pointer flex-row "
													onClick={() => onHeaderClick(column.title)}
												>
													<div className="flex-grow flex ">
														{column.icon && <Icon icon={column.icon} />}{" "}
														{column.svgIcon && (
															<img
																className="text-gray-500 w-[16px] h-[16px] mr-2"
																src={column.svgIcon}
															/>
														)}
														{column.title}
													</div>
													<div
														className={classNames(
															"flex-shrink-0 flex flex-col duration-200 text-gray-500 ml-4"
														)}
													>
														<SvgIcon
															className={`w-[20px] h-[20px] ${
																orderStatus === 1 ? "text-gray-700" : "text-gray-500"
															}`}
															svgIcon={ArrowUp}
														/>
														<SvgIcon
															className={`w-[20px] h-[20px] ${
																orderStatus === 2 ? "text-gray-700" : "text-gray-500"
															} `}
															svgIcon={ArrowDown}
														/>
													</div>
												</div>
											) : orderTitle ? (
												<div
													className="flex items-center cursor-pointer"
													onClick={() =>
														handleSortColumn(
															columns.map((el) => el.orderTitle).indexOf(orderTitle),
															orderTitle
														)
													}
												>
													<div className="flex-grow flex">
														{column.title}{" "}
														{column.icon && (
															<Icon className="ml-2" color="#9CA3AF" icon={column.icon} />
														)}
														{column.svgIcon && (
															<img className="ml-2 h-[18px] text-gray-500" src={column.svgIcon} />
														)}
													</div>
													<div
														className={classNames("flex-shrink-0 flex flex-col duration-200  ml-4")}
													>
														{/* <Icon icon={faChevronDown} /> */}
														<SvgIcon
															className={`w-[22px] h-[22px] ${
																orderStatus === 1 ? "text-gray-700" : "text-gray-500"
															}`}
															svgIcon={ArrowUp}
														/>
														<SvgIcon
															className={`w-[22px] h-[22px] ${
																orderStatus === 2 ? "text-gray-700" : "text-gray-500"
															} `}
															svgIcon={ArrowDown}
														/>
													</div>
												</div>
											) : (
												column.title
											)}
										</th>
									);
								})}
						</tr>
					</thead>
					<tbody>
						{isLoading ? (
							renderSkeleton()
						) : !data.length ? (
							<tr className="h-[496px] text-gray-700 text-sm">
								<td
									className="text-center bg-white border-t border-t-border"
									colSpan={columns.length}
								>
									<div className="flex flex-col items-center">
										{noDataText ? noDataText : t("basics.noData")}
										{noDataCta && (
											<div className="w-auto mt-4">
												<Button
													color={ButtonColor.ACTION}
													size={ButtonSize.S}
													title={noDataCta.title}
													onClick={noDataCta.action}
												/>
											</div>
										)}
									</div>
								</td>
							</tr>
						) : (
							data.map((item, rowIndex) => {
								const displayIndex = startIndex + rowIndex;

								return (
									<Fragment key={`row-${rowIndex}`}>
										<tr
											className="bg-white hover:bg-gray-100"
											onClick={handleRowClick ? () => handleRowClick(item.id) : () => null}
										>
											{columns
												.filter((c) => c.show || c.show === undefined)
												.map((column, index) => {
													const { render } = column;
													const content =
														typeof render === "string" ? (
															<span
																key={`column-${rowIndex}-${index}`}
																className={classNames("text-sm leading-6 truncate ...")}
															>
																{item[render] || "-"}
															</span>
														) : (
															render(item, displayIndex)
														);
													const { align = "left" } = column;

													return (
														<td
															key={`item-${rowIndex}-${index}`}
															className={classNames(
																" px-2 py-4 text-sm font-normal leading-6 duration-200 border-white",
																align === "left" ? "text-left" : "text-right",
																column.width === "fit-content" ? "whitespace-nowrap" : "",
																column.minWidth ? `min-w-[${column.minWidth}]` : "",
																column.maxWidth ? `max-w-[${column.maxWidth}]` : "",
																column.locked ? `sticky ${column.locked}` : "",
																column.locked && !columns[index + 1]?.locked
																	? "border-r !border-gray-200"
																	: ""
															)}
														>
															{content}
														</td>
													);
												})}
										</tr>
									</Fragment>
								);
							})
						)}
					</tbody>
				</table>
			</div>
			{isFetching && !isLoading && (
				<div className="flex items-center justify-center">
					<Spinner color="#6B7280" />
				</div>
			)}
			{!hidePagination && (
				<TablePagination
					currentPage={currentPage}
					handleChangeRowsPerPage={handleChangeRowsPerPage}
					handleNavigateToPage={setPage}
					limit={limit}
					maxPage={totalPages}
				/>
			)}
			{!hideFooter && (
				<TableFooter
					columns={columns.length}
					coulumsShown={columns.filter((c) => c.show || c.show === undefined).length}
					currentlyDownloadingSelected={currentlyDownloadingSelected}
					handleArchive={handleArchive}
					handleDelete={handleDelete}
					handleExport={handleExport}
					hideColumnsCount={hideColumnsCount}
					overallCount={overallCount ?? undefined}
					rowsPerPage={data.length}
					showFooterFunctions={showFooterFunctions}
				/>
			)}
		</div>
	);
};
