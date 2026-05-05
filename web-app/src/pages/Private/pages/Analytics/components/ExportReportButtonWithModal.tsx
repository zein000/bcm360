import { faCheck, faDownload } from "@fortawesome/pro-regular-svg-icons";

import { useEffect, useRef, useState } from "react";

import { MenuItem, TextField } from "@mui/material";

import { useTranslation } from "react-i18next";

import { Icon } from "@/components";
import { Button } from "@/components/Button/Button";
import { ButtonColor, ButtonSize } from "@/components/Button/types";

import { useExportCourseProgressMutation } from "@/pages/Private/redux/course-progress/course-progress.api";

import { CourseProgress } from "../schema/course-progress";

export enum ExportFormat {
	ONLY_PROTOCOL = "only-the-protocol",
	PROTOCOL_WITH_REVEALED_CONTENT = "protocol-with-related-content",
}

export enum ExportFileTypes {
	PDF = "PDF",
	MD = "MD",
}

interface ExportReportButtonWithModalProps {
	courseProgressInfo: CourseProgress;
}

export default function ExportReportButtonWithModal({
	courseProgressInfo,
}: ExportReportButtonWithModalProps) {
	const { t } = useTranslation();
	const ts = (key: string) => t(`analytics.${key}`);
	const [isModalShown, setIsModalShown] = useState(false);
	const [format, setFormat] = useState<ExportFormat>(ExportFormat.ONLY_PROTOCOL);
	const [fileType, setFileType] = useState<ExportFileTypes>(ExportFileTypes.PDF);
	const closeTimeout = useRef<NodeJS.Timeout | null>(null);
	const [exportScenarioReport, { isLoading, error }] = useExportCourseProgressMutation();

	const handleReportExport = async () => {
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const result: any = await exportScenarioReport({
				id: courseProgressInfo?.id,
				fileType,
				format,
			});

			if (result?.data) {
				const isPdf = fileType === "PDF";
				const mimeType = isPdf ? "application/pdf" : "text/markdown";
				const fileExtension = isPdf ? "pdf" : "md";

				const blob = new Blob([result.data], { type: mimeType });
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement("a");

				a.href = url;
				a.download = `report-${courseProgressInfo?.id}${
					format === ExportFormat.PROTOCOL_WITH_REVEALED_CONTENT ? "-expanded" : ""
				}.${fileExtension}`;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);

				window.URL.revokeObjectURL(url);
			}
		} catch (e) {
			console.log("Error exporting report", e);
		}
	};

	const onMouseLeave = () => {
		closeTimeout.current = setTimeout(() => {
			setIsModalShown(false);
		}, 300);
	};

	const onModalShownClick = () => {
		if (closeTimeout.current) {
			clearTimeout(closeTimeout.current);
		}

		setIsModalShown(true);
	};

	useEffect(() => {
		return () => {
			if (closeTimeout.current) {
				clearTimeout(closeTimeout.current);
			}
		};
	}, []);

	return (
		<div className="relative" onMouseLeave={onMouseLeave}>
			<Button
				className="!w-[44px] !h-[44px] !p-0 !text-white hover:!bg-primary-blue-hover !rounded-xl"
				color={ButtonColor.ACTION}
				image={<Icon className="w-5 h-5" icon={faDownload} />}
				size={ButtonSize.ML}
				title=""
				onClick={onModalShownClick}
			/>
			{isModalShown && (
				<div
					className="absolute right-0 top-full w-[410px] mt-1 space-y-4 border border-[#E6E6EC] p-4 bg-white shadow-lg rounded-16 z-10"
					onMouseEnter={() => {
						if (closeTimeout.current) {
							clearTimeout(closeTimeout.current);
						}
					}}
				>
					<h3 className="text-[18px] text-primary-gray font-medium">{ts("export")}</h3>
					<div className="flex gap-2 w-full relative">
						<TextField
							select
							SelectProps={{
								renderValue: (selected) => <>{ts(selected as string)}</>,
								MenuProps: {
									PaperProps: {
										sx: {
											marginTop: "4px",
											borderRadius: "12px",
											border: "1px solid #E6E6EC",
											"& .MuiMenuItem-root": {
												display: "flex",
												alignItems: "center",
												justifyContent: "space-between",
												fontSize: "14px",
												color: "#1D243C",
												"&.Mui-selected": {
													color: "#4680FC",
													bgcolor: "#fff",
												},
											},
										},
									},
								},
							}}
							disabled={isLoading}
							inputProps={{
								style: {
									display: "flex",
									alignItems: "center",
									fontSize: "14px",
									color: "#1D243C",
								},
							}}
							sx={{
								flex: 1,
								borderRadius: "12px",
								"& .MuiSelect-select": {
									alignSelf: "flex-end",
									padding: "12px",
									fontSize: "14px",
									color: "#1D243C",
								},
								"& .MuiInputBase-root": {
									marginBottom: "0px",
									borderRadius: "12px",
									fontSize: "14px",
									color: "#1D243C",
								},
							}}
							value={format}
							onChange={(e) => setFormat(e?.target?.value as ExportFormat)}
						>
							{Object.values(ExportFormat).map((formatValue, index) => (
								<MenuItem key={index} value={formatValue}>
									{ts(formatValue)}
									{format === formatValue && <Icon className="w-5 h-5" icon={faCheck} />}
								</MenuItem>
							))}
						</TextField>
						<TextField
							select
							SelectProps={{
								renderValue: (selected) => <>{selected}</>,
								MenuProps: {
									PaperProps: {
										sx: {
											"& .MuiMenuItem-root": {
												display: "flex",
												alignItems: "center",
												fontSize: "14px",
												"&.Mui-selected": {
													color: "#4680FC",
												},
											},
										},
									},
								},
							}}
							disabled={isLoading}
							inputProps={{
								style: {
									display: "flex",
									alignItems: "center",
									fontSize: "14px",
								},
							}}
							sx={{
								borderRadius: "12px",
								width: "80px",
								"& .MuiSelect-select": {
									alignSelf: "flex-end",
									padding: "12px",
									fontSize: "14px",
								},
								"& .MuiInputBase-root": {
									marginBottom: "0px",
									borderRadius: "12px",
									fontSize: "14px",
								},
							}}
							value={fileType}
							onChange={(e) => setFileType(e?.target?.value as ExportFileTypes)}
						>
							{Object.values(ExportFileTypes).map((type, index) => (
								<MenuItem key={index} value={type}>
									{type}
									{type === fileType && <Icon className="ml-2 w-5 h-5" icon={faCheck} />}
								</MenuItem>
							))}
						</TextField>
						{error ? (
							<p className="absolute left-2 -bottom-4 text-[12px] text-[#FF1034]">
								{ts("file-export-error")}
							</p>
						) : (
							<></>
						)}
					</div>
					<Button
						className="!h-[44px] !p-0 !text-white !rounded-xl"
						color={ButtonColor.ACTION}
						isLoading={isLoading}
						size={ButtonSize.ML}
						title="Export"
						onClick={handleReportExport}
					/>
				</div>
			)}
		</div>
	);
}
