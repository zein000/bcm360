import {
	SxProps,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
	Theme,
} from "@mui/material";
import { ChangeEvent, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { SortDirection } from "@/utils/useSearch";

import TableSort from "../TableSort/TableSort";

export interface TableColumn<DataType> {
	label?: string;
	minWidth?: number;
	width?: number | string;
	format: (row: DataType) => ReactNode;
	align?: "right" | "left" | "center";
	sx?: SxProps<Theme>;
	isSortable?: boolean;
	fieldName?: string;
}

interface TableComponentProps<
	DataType extends { id: string | number; type?: string } = { id: string | number; type?: string }
> {
	columns: TableColumn<DataType>[];
	data: DataType[];
	isLoading?: boolean;
	page: number;
	limit: number;
	itemCount: number;
	handleChangePage: (event: unknown, page: number) => void;
	handleChangeLimit: (event: ChangeEvent<HTMLInputElement>) => void;
	noDataText?: string;
	allowNavigation?: boolean;
	hidePagination?: boolean;
	hideHeader?: boolean;
	rowSx?: SxProps<Theme>;
	tableSx?: SxProps<Theme>;
	bodySx?: SxProps<Theme>;
	sortColumn?: string;
	sortDirection?: SortDirection;
	setSortDirection?: (fieldName: string, sortDirection?: SortDirection) => void;
}

export function TableComponent<DataType extends { id: string | number; type?: string }>({
	columns,
	data,
	page,
	limit,
	itemCount,
	handleChangePage,
	handleChangeLimit,
	noDataText,
	allowNavigation,
	hidePagination,
	hideHeader,
	bodySx = {},
	rowSx = {},
	tableSx = {},
	setSortDirection,
	sortDirection,
	sortColumn,
}: TableComponentProps<DataType>) {
	const { t } = useTranslation();
	const navigate = useNavigate();

	return (
		<>
			<Table stickyHeader aria-label="sticky table" sx={tableSx}>
				{hideHeader ? null : (
					<TableHead sx={{ bgcolor: "white" }}>
						<TableRow>
							{columns.map((column, index) => (
								<TableCell
									key={index}
									align={column.align}
									style={{ minWidth: column.minWidth, width: column.width }}
									// variant="head"
								>
									{column.label}
									{column?.isSortable && (
										<TableSort
											fieldName={column.fieldName}
											setSortDirection={setSortDirection}
											sortColumn={sortColumn}
											sortDirection={sortDirection}
										/>
									)}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
				)}

				<TableBody className="custom-scrollbar" sx={bodySx}>
					{data && data.length > 0 ? (
						data.map((row) => (
							<TableRow
								key={`${row.id}${row.type ?? ""}`}
								sx={{
									cursor: allowNavigation ? "pointer" : "",
									...rowSx,
								}}
								tabIndex={-1}
								onClick={() => (allowNavigation ? navigate(`${row.id}`) : null)}
							>
								{columns.map((column, index) => (
									<TableCell
										key={index}
										align={column.align}
										style={{
											minWidth: column.minWidth,
											whiteSpace: column.width === "fit-content" ? "nowrap" : "initial",
										}}
										sx={{
											...(column?.sx ?? {}),
										}}
									>
										{column.format(row)}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length}>{noDataText ?? t("basics.noData")}</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			{data && data.length > 0 && !hidePagination && (
				<TablePagination
					component="div"
					count={itemCount ?? 0}
					page={page - 1}
					rowsPerPage={limit}
					rowsPerPageOptions={[10, 25, 50, 100]}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeLimit}
				/>
			)}
		</>
	);
}
