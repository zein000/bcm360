import { ChangeEvent, FunctionComponent, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Link, Stack, TextField, Typography } from "@mui/material";

import { faTrashCan, faPen, faRocket } from "@fortawesome/pro-regular-svg-icons";

import { useNavigate } from "react-router-dom";

import {
	useDeleteCoursesMutation,
	useGetCoursesQuery,
} from "@/pages/Private/redux/courses/courses.api";

import {
	Icon,
	LoadingOverlay,
	Modal,
	PermissionCheck,
	TableColumn,
	TableComponent,
} from "@/components";
import { useSearch } from "@/utils";

import { PermissionRoles } from "@/enum";

import { InputField } from "@/components/InputField/InputField";

import { SvgIcon } from "@/components/Icon/SvgIcon";

import { ReactComponent as BookCourse } from "@assets/icons/book-course.svg";

import { Courses } from "../schema/courses";
import { UpdateCoursesModal } from "./UpdateCoursesModal";

interface ICourseTable {
	onStartTrainingHandler: (trainingInfo: Courses) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CoursesTable: FunctionComponent<ICourseTable> = ({ onStartTrainingHandler }) => {
	const { t } = useTranslation();
	const ts = useCallback((key: string) => t(`courses.${key}`), [t]);
	const navigate = useNavigate();
	const [showEditModal, setShowEditModal] = useState<boolean>(false);
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const [selectedCourses, setSelectedCourses] = useState<Courses | null>(null);
	const { page, setPage, limit, setLimit, searchValue, setSearchValue, query } = useSearch();
	const [deleteCourses, { isLoading: isDeleteLoading }] = useDeleteCoursesMutation();

	const { data, isLoading } = useGetCoursesQuery({
		page,
		limit,
		searchValue: query,
	});

	const columns: TableColumn<Courses>[] = useMemo(
		() => [
			{
				label: ts("name"),
				format: (row) => (
					<Stack alignItems={"flex-start"} direction="row" justifyContent="flex-start">
						<Link href={`/app/courses/${row?.id}`}>
							<Stack
								alignItems="center"
								direction="column"
								display="flex"
								flexDirection="row"
								justifyContent="flex-start"
							>
								<div className="flex flex-row items-center w-fit ali">
									<span className="relative w-[26px] h-[26px] text-xs text-center border border-gray-400 text-white rounded-full bg-white leading-[26px]">
										<SvgIcon
											className="absolute top-[5px] right-[5px] w-[14px] h-[14px] text-gray-500"
											svgIcon={BookCourse}
										/>
									</span>
								</div>
								<Stack direction="column" justifyContent="flex-start" ml={2}>
									<Typography className="text-gray-900" fontWeight={600} mb={0} variant="h4">
										{row?.name}
									</Typography>
								</Stack>
							</Stack>
						</Link>
					</Stack>
				),
			},
			{
				align: "right",
				label: "",
				minWidth: 20,
				format: (row) => (
					<Stack direction="row" justifyContent="flex-end" spacing={2}>
						<PermissionCheck requiredPermissions={[PermissionRoles.MANAGE_COURSES]}>
							<>
								<Box
									sx={{
										color: "neutral.500",
										"&:hover": {
											color: "primary.main",
											cursor: "pointer",
										},
									}}
									onClick={() => navigate(`/app/courses/edit/${row.id}`)}
								>
									<Icon icon={faPen} size="xl" />
								</Box>
								<Box
									sx={{
										color: "neutral.500",
										"&:hover": {
											color: "primary.main",
											cursor: "pointer",
										},
									}}
									onClick={() => handleDeleteModal(row)}
								>
									<Icon icon={faTrashCan} size="xl" />
								</Box>
								<Box
									sx={{
										color: "neutral.500",
										"&:hover": {
											color: "primary.main",
											cursor: "pointer",
										},
									}}
									onClick={() => onStartTrainingHandler(row)}
								>
									<Icon icon={faRocket} size="xl" />
								</Box>
							</>
						</PermissionCheck>
					</Stack>
				),
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ts]
	);

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		setLimit(Number(event.target.value));
		setPage(1);
	};

	const handleDeleteModal = (row: Courses) => {
		setShowDeleteModal(true);
		setSelectedCourses(row);
	};

	const handleDeleteCourses = async () => {
		try {
			await deleteCourses(selectedCourses?.id ?? 0).unwrap();
			setShowDeleteModal(false);
		} catch (err) {
			console.error(err);
		}
	};

	return !data && !isLoading ? (
		<LoadingOverlay />
	) : (
		<div className="w-full">
			<div className="flex items-end align-baseline justify-between w-full mb-8">
				<div className="flex-grow mr-4 ">
					<InputField
						handleChange={(e: ChangeEvent<HTMLInputElement>) => {
							setSearchValue(e.target.value);
						}}
						label={ts("search")}
						name={"search"}
						placeholder="Search..."
						value={searchValue}
					/>
				</div>
			</div>
			<div className="w-full bg-white">
				<TableComponent
					columns={columns}
					data={data?.data || []}
					handleChangeLimit={handleChangeRowsPerPage}
					handleChangePage={(_: unknown, page: number) => setPage(page + 1)}
					hideHeader={true}
					itemCount={data?.meta.itemCount ?? 0}
					limit={limit}
					page={page}
				/>
			</div>
			{showDeleteModal && (
				<Modal
					handleClose={() => setShowDeleteModal(false)}
					handleSave={handleDeleteCourses}
					isLoading={isDeleteLoading}
					isOpened={showDeleteModal}
					submitButtonColor="error"
					submitButtonText={t("basics.delete")}
					title={ts("delete.title")}
				>
					<TextField
						fullWidth
						defaultValue={selectedCourses?.name}
						inputProps={{ readOnly: true }}
						label={ts("name")}
					/>
				</Modal>
			)}
			{showEditModal && selectedCourses && (
				<UpdateCoursesModal
					courses={selectedCourses}
					isOpen={showEditModal}
					setIsOpen={setShowEditModal}
				/>
			)}
		</div>
	);
};
