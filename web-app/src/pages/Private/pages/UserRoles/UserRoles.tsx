import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Button, Card, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { faPenToSquare, faTrashCan, faPlus } from "@fortawesome/pro-light-svg-icons";

import { Icon, LoadingOverlay, Modal, TableColumn, TableComponent } from "@/components";
import { useSearch } from "@/utils";

import { useDeleteRoleMutation, useGetRolesQuery } from "../../redux/admin/admin.api";
import { CreateUserRoleModal } from "./components/CreateUserRoleModal";
import { EditUserRoleModal } from "./components/EditUserRoleModal";
import { UserRole } from "./schema/roles";

export const UserRoles = () => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`userRoles.${key}`);

	const { page, limit } = useSearch();
	const { data: roles, isLoading } = useGetRolesQuery();

	const [showCreateRoleModalOpen, setShowCreateRoleModalOpen] = useState<boolean>(false);
	const [showEditRoleModalOpen, setShowEditRoleModalOpen] = useState<boolean>(false);
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
	const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();

	const handleEditRole = (role: UserRole) => {
		setSelectedRole(role);
		setShowEditRoleModalOpen(true);
	};

	const handleDeleteModal = (role: UserRole) => {
		setSelectedRole(role);
		setShowDeleteModal(true);
	};

	const handleDeleteRole = async () => {
		try {
			await deleteRole(selectedRole?.id ?? 0).unwrap();
			setShowDeleteModal(false);
		} catch (err) {
			console.error(err);
		}
	};

	const columns: TableColumn<UserRole>[] = useMemo(
		() => [
			{
				label: t("basics.name"),
				format: (row) => <Typography variant="body2">{row.name}</Typography>,
			},
			{
				label: t("basics.code"),
				format: (row) => <Typography variant="body2">{row.code}</Typography>,
			},
			{
				label: t("basics.description"),
				format: (row) => <Typography variant="body2">{row.description}</Typography>,
			},
			{
				label: t("basics.permissions"),
				format: (row) => (
					<Tooltip
						placement="bottom-start"
						title={row.permissions.map((permission) => (
							<Typography key={permission.id} fontSize={10}>
								{permission.name}
							</Typography>
						))}
					>
						<Typography sx={{ cursor: "default" }}>
							{`${row.permissions.length} ${t("basics.permissions").toLowerCase()}`}
						</Typography>
					</Tooltip>
				),
			},
			{
				align: "right",
				label: t("basics.actions"),
				format: (row) => (
					<Stack direction="row" justifyContent="flex-end" spacing={2}>
						<Box
							sx={{
								color: "neutral.500",
								"&:hover": {
									cursor: "pointer",
									color: "primary.main",
								},
							}}
							onClick={() => handleEditRole(row)}
						>
							<Icon icon={faPenToSquare} size="xl" />
						</Box>
						<Box
							sx={{
								color: "neutral.500",
								"&:hover": {
									cursor: "pointer",
									color: "primary.main",
								},
							}}
							onClick={() => handleDeleteModal(row)}
						>
							<Icon icon={faTrashCan} size="xl" />
						</Box>
					</Stack>
				),
			},
		],
		[t]
	);

	return (
		<>
			<Stack direction="row" justifyContent="space-between" mb={4}>
				<Typography variant="h2">{ts("title")}</Typography>

				<Button
					size="small"
					startIcon={<Icon icon={faPlus} />}
					variant="contained"
					onClick={() => setShowCreateRoleModalOpen(true)}
				>
					{t("basics.createSomething", { something: t("basics.role") })}
				</Button>
			</Stack>

			{isLoading ? (
				<LoadingOverlay />
			) : (
				<Card>
					<TableComponent
						hidePagination
						columns={columns}
						data={roles?.data ?? []}
						handleChangeLimit={() => null}
						handleChangePage={() => null}
						itemCount={roles?.meta.itemCount ?? 0}
						limit={limit}
						page={page}
					/>
				</Card>
			)}

			{showCreateRoleModalOpen && (
				<CreateUserRoleModal
					isOpen={showCreateRoleModalOpen}
					setIsOpen={setShowCreateRoleModalOpen}
				/>
			)}

			{showEditRoleModalOpen && (
				<EditUserRoleModal
					isOpen={showEditRoleModalOpen}
					role={selectedRole}
					setIsOpen={setShowEditRoleModalOpen}
				/>
			)}

			{showDeleteModal && (
				<Modal
					handleClose={() => setShowDeleteModal(false)}
					handleSave={handleDeleteRole}
					isLoading={isDeleting}
					isOpened={showDeleteModal}
					submitButtonColor="error"
					submitButtonText={t("basics.delete")}
					title={t("modals.deleteRole.title")}
				>
					<TextField
						fullWidth
						defaultValue={selectedRole?.name}
						inputProps={{ readOnly: true }}
						label={t("basics.role")}
					/>
				</Modal>
			)}
		</>
	);
};
