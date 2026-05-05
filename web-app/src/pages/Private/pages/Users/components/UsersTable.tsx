import { faMagnifyingGlass, faPenToSquare, faTrashCan } from "@fortawesome/pro-light-svg-icons";
import {
	Box,
	Card,
	InputAdornment,
	OutlinedInput,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { ChangeEvent, FunctionComponent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useNavigate, useParams } from "react-router-dom";

import { faRightToBracket } from "@fortawesome/pro-regular-svg-icons";

import {
	Avatar,
	Chip,
	Icon,
	LoadingOverlay,
	Modal,
	PermissionCheck,
	TableColumn,
	TableComponent,
} from "@/components";
import { PermissionRoles, UserStatus } from "@/enum";
import {
	useDeleteUserMutation,
	useGetUsersQuery,
	useLoginAsMutation,
	useResendInviteEmailMutation,
} from "@/pages/Private/redux/admin/admin.api";
import { User } from "@/pages/Public/pages/Login/schema/login";
import { useSearch } from "@/utils";

import { authSelector, setAuth } from "@/pages/Public/redux/auth.slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import { EditUserModal } from "./EditUserModal";

export const UsersTable: FunctionComponent = () => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`users.${key}`);

	const { id } = useParams();
	const dispatch = useAppDispatch();
	const userTokenObj = useAppSelector(authSelector);
	const navigate = useNavigate();
	const [showEditModal, setShowEditModal] = useState<boolean>(false);
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [loginAsUser] = useLoginAsMutation();
	const {
		page,
		setPage,
		limit,
		setLimit,
		filters,
		debouncedFilters,
		setFilters,
		query,
		sortOrder,
		sortColumn,
		setSorting,
	} = useSearch();

	const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({
		page: page,
		limit,
		searchValue: query,
		companyId: id ? +id : undefined,
		filters: debouncedFilters,
		sortBy: sortColumn,
		sortOrder: sortOrder,
	});
	const [deleteUser, { isLoading }] = useDeleteUserMutation();
	const [resendInviteEmail] = useResendInviteEmailMutation();

	const loginAs = async (user: User) => {
		localStorage.setItem("initialUser", JSON.stringify(userTokenObj));

		const newUser = await loginAsUser(user.id).unwrap();

		dispatch(setAuth(newUser));
		navigate("/");
	};

	const resendInvite = async (user: User) => {
		const userForResend = {
			email: user.email,
			roleId: user.role.id,
			firstName: user.firstName,
			lastName: user.lastName,
		};

		await resendInviteEmail(userForResend).unwrap();
	};

	const columns: TableColumn<User>[] = useMemo(
		() => [
			{
				label: t("basics.name"),
				minWidth: 474,
				format: (row) => (
					<Stack alignItems="center" direction="row" spacing={1}>
						<Avatar firstName={row.firstName} lastName={row.lastName} />
						<Stack direction="column" justifyContent="flex-start" ml={2}>
							{(row.firstName || row.lastName) && (
								<Typography className="text-gray-900" variant="subtitle2">
									{`${row.firstName} ${row.lastName}`}
								</Typography>
							)}

							<Typography className="text-gray-600" fontWeight="400" variant="body2">
								{row.email}
							</Typography>
						</Stack>
					</Stack>
				),
			},

			{
				label: t("basics.status"),
				minWidth: 100,
				format: (row) => {
					const ownerState =
						row.status === UserStatus.ACTIVE
							? "success"
							: row.status === UserStatus.BLOCKED
							? "error"
							: row.status === UserStatus.INVITED
							? "warning"
							: "secondary";

					return (
						<div className="flex flex-row items-center">
							<Chip color={ownerState} label={row.status.toLowerCase()} />
							{row.status === UserStatus.INVITED && (
								<Typography
									className="text-gray-600 cursor-pointer"
									fontWeight={600}
									ml={1}
									variant="body2"
									onClick={() => resendInvite(row)}
								>
									Resend Invite
								</Typography>
							)}
						</div>
					);
				},
			},
			{
				label: t("basics.role"),
				minWidth: 100,
				format: (row) => {
					return (
						<Box>
							<Typography variant="body2">{row.role.name}</Typography>
						</Box>
					);
				},
			},
			{
				align: "right",
				// label: t("basics.actions"),
				minWidth: 50,
				format: (row) => (
					<Stack direction="row" justifyContent="flex-end" spacing={2}>
						{id ? (
							<PermissionCheck requiredPermissions={[PermissionRoles.GLOBAL_ADMIN]}>
								<Box
									sx={{
										color: "neutral.500",
										"&:hover": {
											cursor: "pointer",
											color: "primary.main",
										},
									}}
									onClick={() => loginAs(row)}
								>
									<Icon icon={faRightToBracket} size="lg" />
								</Box>
							</PermissionCheck>
						) : (
							<></>
						)}
						<Box
							sx={{
								color: "neutral.500",
								"&:hover": {
									cursor: "pointer",
									color: "primary.main",
								},
							}}
							onClick={() => handleEditUser(row)}
						>
							<Icon icon={faPenToSquare} size="lg" />
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
							<Icon icon={faTrashCan} size="lg" />
						</Box>
					</Stack>
				),
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[id, t]
	);

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		setLimit(Number(event.target.value));
		setPage(0);
	};

	const handleEditUser = (row: User) => {
		setShowEditModal(true);
		setSelectedUser(row);
	};

	const handleDeleteModal = (row: User) => {
		setShowDeleteModal(true);
		setSelectedUser(row);
	};

	const handleDeleteUser = async () => {
		try {
			await deleteUser(selectedUser?.id ?? 0).unwrap();
			setShowDeleteModal(false);
		} catch (err) {
			console.error(err);
		}
	};

	const handleCloseEditModal = () => {
		setShowEditModal(false);
		setSelectedUser(null);
	};

	return !users && !isUsersLoading ? (
		<LoadingOverlay />
	) : (
		<Card>
			<Stack direction="row" gap={2} px={3} py={2}>
				<OutlinedInput
					fullWidth
					placeholder={t("basics.search", { something: ts("search") })}
					startAdornment={
						<InputAdornment position="start">
							<Icon icon={faMagnifyingGlass} />
						</InputAdornment>
					}
					value={filters["name"] ?? ""}
					onChange={(e) => setFilters({ name: e.target.value })}
				/>
			</Stack>
			<TableComponent
				columns={columns}
				data={users?.data || []}
				handleChangeLimit={handleChangeRowsPerPage}
				handleChangePage={(_: unknown, page: number) => setPage(page + 1)}
				itemCount={users?.meta?.itemCount ?? 0}
				limit={limit}
				page={page}
				setSortDirection={setSorting}
				sortColumn={sortColumn}
				sortDirection={sortOrder}
			/>

			{showEditModal && (
				<EditUserModal
					companyId={id ? +id : undefined}
					handleClose={handleCloseEditModal}
					isVisible={showEditModal}
					user={selectedUser}
				/>
			)}

			{showDeleteModal && (
				<Modal
					handleClose={() => setShowDeleteModal(false)}
					handleSave={handleDeleteUser}
					isLoading={isLoading}
					isOpened={showDeleteModal}
					submitButtonColor="error"
					submitButtonText={t("basics.delete")}
					title={t("modals.deleteUser.title")}
				>
					<TextField
						fullWidth
						defaultValue={selectedUser?.email}
						inputProps={{ readOnly: true }}
						label={t("basics.email")}
					/>
				</Modal>
			)}
		</Card>
	);
};
