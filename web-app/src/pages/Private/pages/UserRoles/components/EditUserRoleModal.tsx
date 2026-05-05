import { ChangeEvent, Dispatch, FunctionComponent, SetStateAction, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { MenuItem, TextField } from "@mui/material";
import { Stack } from "@mui/system";

import {
	useAssignPermissionsMutation,
	useGetPermissionsQuery,
	useUnassignPermissionsMutation,
	useUpdateRoleMutation,
} from "@/pages/Private/redux/admin/admin.api";
import { ChipsList, Loader, Modal } from "@/components";
import {
	ERROR_TYPE,
	getAllErrors,
	getAllRolePermissions,
	getUserPermissionsDiff,
	renderErrorMessages,
} from "@/utils";
import { DEFAULT } from "@/constants";

import {
	UserRolePartialForm,
	UpdateRoleForm,
	UpdateRoleFormSchema,
	UserRole,
} from "../schema/roles";

interface EditUserRoleModalProps {
	role: UserRole | null;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const EditUserRoleModal: FunctionComponent<EditUserRoleModalProps> = ({
	role,
	isOpen,
	setIsOpen,
}) => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`userRoles.modal.${key}`);

	const { data: permissions, isLoading: isLoadingPermissions } = useGetPermissionsQuery();
	const [updateRole, { isLoading, error }] = useUpdateRoleMutation();
	const [assignPermissions, { isLoading: isAssignPermissionsLoading }] =
		useAssignPermissionsMutation();
	const [unassignPermissions, { isLoading: isUnassignPermissionsLoading }] =
		useUnassignPermissionsMutation();

	const initialValues: UpdateRoleForm = {
		name: role?.name ?? "",
		code: role?.code ?? "",
		description: role?.description ?? "",
		permissions: getAllRolePermissions(role?.permissions || []) ?? [],
	};

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UpdateRoleForm>({
		defaultValues: initialValues,
		resolver: zodResolver(UpdateRoleFormSchema),
	});

	const formErrors = Object.values(errors).map((error) => error?.message) as ERROR_TYPE[];

	const {
		fields: userPermissions,
		remove,
		append,
	} = useFieldArray({
		control,
		name: "permissions",
	});

	const permissionsOptions = useMemo(() => {
		return (permissions?.data ?? []).filter(
			(permission) =>
				!userPermissions.some((userPermission) => userPermission.identifier === permission.code)
		);
	}, [permissions, userPermissions]);

	const handleRolePermissionsChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const selectedPermission = permissions?.data.find(
			(permission) => permission.code === event.target.value
		);

		if (selectedPermission) {
			append(getAllRolePermissions([selectedPermission]));
		}
	};

	const handleUnselectPermission = (code: string) => {
		const indexOfRemovedPermission = userPermissions.findIndex(
			(permission) => permission.identifier === code
		);

		remove(indexOfRemovedPermission);
	};

	const onSubmit = async (values: UpdateRoleForm) => {
		if (role) {
			const { id } = role;
			const body = {} as UserRolePartialForm;
			const { permissions: selectedPermissions, ...info } = values;

			for (const key in info) {
				const initialValue = initialValues[key as keyof UserRolePartialForm];
				const currentValue = values[key as keyof UserRolePartialForm];

				if (currentValue !== initialValue) {
					body[key as keyof UserRolePartialForm] = currentValue;
				}
			}

			try {
				if (Object.entries(body).length > 0) {
					await updateRole({ id, body });
				}

				if (permissions) {
					const { addedPermissions, removedPermissions } = getUserPermissionsDiff(
						role?.permissions.map((item) => item.code) ?? [],
						selectedPermissions?.map((permission) => `${permission.identifier}`) ?? []
					);

					if (addedPermissions.length) {
						await assignPermissions({
							id,
							body: { permissions: addedPermissions },
						}).unwrap();
					}

					if (removedPermissions.length) {
						await unassignPermissions({
							id,
							body: { permissions: removedPermissions },
						}).unwrap();
					}
				}

				setIsOpen(false);
			} catch (err) {
				console.error(err);
			}
		}
	};

	return (
		<Modal
			handleClose={() => setIsOpen(false)}
			handleSave={handleSubmit(onSubmit)}
			isLoading={isLoading || isAssignPermissionsLoading || isUnassignPermissionsLoading}
			isOpened={isOpen}
			submitButtonText={t("basics.confirm")}
			title={ts("edit.title")}
		>
			{isLoadingPermissions ? (
				<Loader />
			) : (
				<Stack spacing={2}>
					<TextField
						error={!!errors.name?.message}
						label={t("basics.name")}
						placeholder={t("basics.enterSomething", { something: t("basics.name") })}
						{...register("name")}
					/>

					<TextField
						error={!!errors.code?.message}
						label={t("basics.code")}
						placeholder={t("basics.enterSomething", { something: t("basics.code") })}
						{...register("code")}
					/>

					<TextField
						error={!!errors.description?.message}
						label={t("basics.description")}
						placeholder={t("basics.enterSomething", { something: t("basics.description") })}
						{...register("description")}
					/>

					<TextField
						select
						error={!!errors.permissions?.message}
						label={t("basics.permissions")}
						value={DEFAULT}
						onChange={handleRolePermissionsChange}
					>
						<MenuItem disabled value={DEFAULT}>
							{ts("create.permissionPlaceholder")}
						</MenuItem>

						{permissionsOptions.map((permission) => (
							<MenuItem key={permission.id} value={permission.code}>
								{permission.name}
							</MenuItem>
						))}
					</TextField>

					<ChipsList handleDelete={handleUnselectPermission} selectedItems={userPermissions} />

					{getAllErrors(error, formErrors).length
						? renderErrorMessages(getAllErrors(error, formErrors))
						: null}
				</Stack>
			)}
		</Modal>
	);
};
