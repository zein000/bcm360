import { ChangeEvent, FunctionComponent, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Link, Stack, TextField, Typography } from "@mui/material";

import { faTrashCan, faPen } from "@fortawesome/pro-regular-svg-icons";

import {
	useDeleteCompaniesMutation,
	useGetCompaniesQuery,
} from "@/pages/Private/redux/companies/companies.api";

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

import { Companies } from "../schema/companies";
import { UpdateCompaniesModal } from "./UpdateCompaniesModal";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CompaniesTable: FunctionComponent = () => {
	const { t } = useTranslation();
	const ts = useCallback((key: string) => t(`companies.${key}`), [t]);
	const [showEditModal, setShowEditModal] = useState<boolean>(false);
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const [selectedCompanies, setSelectedCompanies] = useState<Companies | null>(null);
	const { page, setPage, limit, setLimit, debouncedFilters, query, filters, setFilters } =
		useSearch();
	const [deleteCompanies, { isLoading: isDeleteLoading }] = useDeleteCompaniesMutation();

	const { data, isLoading } = useGetCompaniesQuery({
		page,
		limit,
		searchValue: query,
		filters: debouncedFilters,
	});

	const columns: TableColumn<Companies>[] = useMemo(
		() => [
			{
				label: ts("name"),
				format: (row) => (
					<Stack alignItems={"flex-start"} direction="row" justifyContent="flex-start">
						<Link href={`/app/companies/${row?.id}`}>
							<Stack
								alignItems="center"
								direction="column"
								display="flex"
								flexDirection="row"
								justifyContent="flex-start"
							>
								<div className="flex flex-row items-center w-fit ali">
									<span className="w-[26px] h-[26px] text-xs text-center text-white rounded-full bg-primary-blue leading-[26px]">
										{row?.name[0]}
									</span>
								</div>
								<Stack direction="column" justifyContent="flex-start" ml={2}>
									<Typography className="text-gray-900" fontWeight={600} mb={0} variant="body2">
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
						<PermissionCheck requiredPermissions={[PermissionRoles.COOKIE]}>
							<>
								<Box
									sx={{
										color: "neutral.500",
										"&:hover": {
											color: "primary.main",
											cursor: "pointer",
										},
									}}
									onClick={() => handleEditCompanies(row)}
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
							</>
						</PermissionCheck>
					</Stack>
				),
			},
		],
		[ts]
	);

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		setLimit(Number(event.target.value));
		setPage(1);
	};

	const handleEditCompanies = (row: Companies) => {
		setShowEditModal(true);
		setSelectedCompanies(row);
	};

	const handleDeleteModal = (row: Companies) => {
		setShowDeleteModal(true);
		setSelectedCompanies(row);
	};

	const handleDeleteCompanies = async () => {
		try {
			await deleteCompanies(selectedCompanies?.id ?? 0).unwrap();
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
						handleChange={(e) => setFilters({ name: e.target.value })}
						label={ts("search")}
						name={"search"}
						placeholder={`${ts("search")}...`}
						value={Array.isArray(filters["name"]) ? filters["name"]?.[0] : filters["name"] ?? ""}
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
					handleSave={handleDeleteCompanies}
					isLoading={isDeleteLoading}
					isOpened={showDeleteModal}
					submitButtonColor="error"
					submitButtonText={t("basics.delete")}
					title={ts("delete.title")}
				>
					<TextField
						fullWidth
						defaultValue={selectedCompanies?.name}
						inputProps={{ readOnly: true }}
						label={ts("name")}
					/>
				</Modal>
			)}
			{showEditModal && selectedCompanies && (
				<UpdateCompaniesModal
					companies={selectedCompanies}
					isOpen={showEditModal}
					setIsOpen={setShowEditModal}
				/>
			)}
		</div>
	);
};
