import { ChangeEvent, useMemo } from "react";

import { faClock, faImage, faTrash, faUsers } from "@fortawesome/pro-regular-svg-icons";

import { useSearch } from "@/utils";

import { Icon, TableColumn, TableComponent } from "@/components";

import { useGetCourseProgressesQuery } from "@/pages/Private/redux/course-progress/course-progress.api";

import { truncateText } from "@/utils/truncateText";

import { formatDateRange } from "@/utils/formateDateRange";

import { Button } from "@/components/Button/Button";

import { ButtonColor, ButtonSize } from "@/components/Button/types";

import UserIcon, { UserIconSize } from "../../Course/components/UserIcon";
import CourseTag from "../../Courses/components/CourseList/CourseTag";
import { FileAssignment } from "../../Courses/enums/FileAssignment.enum";
import { CourseProgress } from "../schema/course-progress";
import ExportReportButtonWithModal from "./ExportReportButtonWithModal";
import TableRowLabel from "./TableRowLabel";

interface CourseProgressTableProps {
	handleCourseProgressDelete: (courseProgress: CourseProgress) => void;
}

export default function CourseProgressTable({
	handleCourseProgressDelete,
}: CourseProgressTableProps) {
	const { page, setPage, limit, setLimit, query } = useSearch();
	const { data } = useGetCourseProgressesQuery({
		page,
		limit,
		searchValue: query,
	});

	const columns: TableColumn<CourseProgress>[] = useMemo(
		() => [
			{
				sx: { "border-bottom": "0px", padding: "0px" },
				format: (row) => {
					const thumbnailUrl = row.course?.courseFiles?.find(
						(file) => file.fileAssignment === FileAssignment?.Thumbnail
					)?.fullFilePath;

					if (thumbnailUrl) {
						return (
							<img
								alt="thumbnail"
								className="w-[100px] h-[90px] rounded-xl  object-cover"
								src={thumbnailUrl}
							/>
						);
					} else {
						return (
							<Icon
								className="w-[100px] h-[90px] rounded-xl object-cover text-primary-gray-lighter/70"
								icon={faImage}
							/>
						);
					}
				},
			},
			{
				sx: { flex: 1, "border-bottom": "0px", padding: "0px" },
				format: (row) => (
					<>
						<CourseTag tag={row.course?.tag?.name} />
						<div className="mt-3">
							<h5 className="font-semibold text-[14px]">{truncateText(row.course?.name, 100)}</h5>
							<p className="text-[12px] text-primary-gray-lighter">
								{truncateText(row.course?.description)}
							</p>
						</div>
					</>
				),
			},
			{
				sx: { "border-bottom": "0px", padding: "0px" },
				format: (row) => (
					<TableRowLabel
						img={
							<UserIcon
								isStatusHidden
								containerClassName="!rounded-md !bg-primary-blue !text-white !min-w-[20px]"
								firstName={row.user?.firstName}
								lastName={row.user?.lastName}
								size={UserIconSize.SuperSmall}
							/>
						}
						title={`${row.user?.firstName} ${row.user?.lastName}`}
					/>
				),
			},
			{
				sx: { "border-bottom": "0px", padding: "0px" },
				format: (row) => (
					<TableRowLabel
						img={<Icon className="w-5 h-5" icon={faUsers} />}
						title={`${row.users.length} Participants`}
					/>
				),
			},
			{
				sx: { "border-bottom": "0px", padding: "0px" },
				format: (row) => (
					<TableRowLabel
						img={<Icon className="w-5 h-5" icon={faClock} />}
						title={`${formatDateRange(row.createdAt, row?.finishDate ?? new Date())}`}
					/>
				),
			},
			{
				sx: { "border-bottom": "0px", padding: "0px" },
				format: (row) => (
					<Button
						className="!w-[44px] !h-[44px] !p-0 !text-white hover:!bg-primary-blue-hover !rounded-xl"
						color={ButtonColor.ACTION}
						image={<Icon className="w-5 h-5" icon={faTrash} />}
						size={ButtonSize.ML}
						title=""
						onClick={() => handleCourseProgressDelete(row)}
					/>
				),
			},
			{
				sx: { "border-bottom": "0px", padding: "0px" },
				format: (row) => <ExportReportButtonWithModal courseProgressInfo={row} />,
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		setLimit(Number(event.target.value));
		setPage(1);
	};

	return (
		<TableComponent
			bodySx={{
				display: "flex",
				flexDirection: "column",
				gap: "12px",
				height: "calc(100vh - 97px - 48px - 54px)",
				overflowY: "auto",
				borderRadius: "20px",
			}}
			columns={columns}
			data={data?.data || []}
			handleChangeLimit={handleChangeRowsPerPage}
			handleChangePage={(_: unknown, page: number) => setPage(page + 1)}
			hideHeader={true}
			itemCount={data?.meta.itemCount ?? 0}
			limit={limit}
			page={page}
			rowSx={{
				display: "flex",
				padding: "16px",
				borderRadius: "20px",
				border: "1px solid #E6E6EC",
				boxShadow: "0px 1px 2px 0px #1C274C1F",
				alignItems: "center",
				gap: "16px",
			}}
			tableSx={{
				padding: "24px",
				width: "100%",
			}}
		/>
	);
}
