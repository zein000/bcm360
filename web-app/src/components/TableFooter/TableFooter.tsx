import { FunctionComponent, useCallback, useEffect, useState } from "react";

import { Typography } from "@mui/material";

import { useTranslation } from "react-i18next";

import { ReactComponent as TrashIcon } from "@assets/icons/create-list/trash.svg";

import { classNames } from "@/utils/classNames";

import { ReactComponent as ExportIcon } from "@assets/icons/table/export.svg";
import { ReactComponent as ArchiveIcon } from "@assets/icons/table/archive.svg";

import { SvgIcon } from "../Icon/SvgIcon";
import { Spinner } from "../Spinner/Spinner";

interface TableFooterProps {
	rowsPerPage: number;
	overallCount?: number;
	columns: number;
	coulumsShown: number;
	handleExport?: () => void;
	showFooterFunctions?: boolean;
	handleArchive?: () => void;
	handleDelete?: () => void;
	currentlyDownloadingSelected?: boolean;
	hideColumnsCount?: boolean;
}

export const TableFooter: FunctionComponent<TableFooterProps> = ({
	rowsPerPage,
	overallCount,
	columns,
	coulumsShown,
	handleExport,
	showFooterFunctions,
	handleArchive,
	handleDelete,
	currentlyDownloadingSelected,
	hideColumnsCount,
}) => {
	const { t } = useTranslation();
	const ts = useCallback((key: string) => t(`basics.${key}`), [t]);

	const [footerWidth, setFooterWidth] = useState<number>(0);

	useEffect(() => {
		const handleResize = () => {
			const outletElement = document.getElementById("outlet-container");

			if (outletElement) {
				setFooterWidth(outletElement.offsetWidth);
			}
		};

		// Set initial width
		handleResize();

		// Update width on resize
		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div
			className=" fixed mt-14 flex flex-row justify-between items-center w-auto border-t border-t-border px-8 py-[14px] rounded-16 bottom-0 right-0 z-20 bg-white"
			style={{ width: footerWidth }}
		>
			<div className="flex flex-row gap-3">
				{showFooterFunctions && handleExport && (
					<div>
						{currentlyDownloadingSelected ? (
							<div className="flex items-center justify-center">
								<Spinner color="#6B7280" />
								<Typography className="ml-3 text-gray-700" variant="body2">
									{ts("wait")}
								</Typography>
							</div>
						) : (
							<div
								className="self-right items-center flex gap-2 cursor-pointer"
								onClick={() => handleExport()}
							>
								<SvgIcon className="w-[24px] h-[24px] text-gray-700" svgIcon={ExportIcon} />
								<Typography className="text-gray-700" variant="body2">
									{ts("export")}
								</Typography>
							</div>
						)}
					</div>
				)}
				{showFooterFunctions && handleArchive && (
					<div
						className="self-right items-center flex gap-2 cursor-pointer"
						onClick={() => handleArchive()}
					>
						<SvgIcon className="w-[24px] h-[24px] text-gray-700" svgIcon={ArchiveIcon} />
						<Typography className="text-gray-700" variant="body2">
							{ts("archive")}
						</Typography>
					</div>
				)}
				{showFooterFunctions && handleDelete && (
					<div
						className="self-right items-center flex gap-2 cursor-pointer"
						onClick={() => handleDelete()}
					>
						<SvgIcon className="w-[24px] h-[24px] text-gray-700" svgIcon={TrashIcon} />
						<Typography className="text-gray-700" variant="body2">
							{ts("delete")}
						</Typography>
					</div>
				)}
			</div>

			<div className="flex flex-row self-left items-center">
				<div
					className={classNames(
						"mr-3 pl-4 flex justify-start flex-grow flex-shrink border-l border-l-border"
					)}
				>
					<div className={classNames("text-sm flex items-center justify-end", "text-gray-700 ")}>
						{ts("rows")}:{" "}
						<span className="text-black">
							{rowsPerPage}
							{overallCount && <>/{overallCount}</>}
						</span>
					</div>
				</div>
				{!hideColumnsCount && (
					<div className={classNames("flex justify-end flex-grow flex-shrink")}>
						<div className={classNames("text-sm flex items-center justify-end", "text-gray-700 ")}>
							{ts("columnsShown")}:{" "}
							<span className="text-black">
								{coulumsShown}/{columns}
							</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
