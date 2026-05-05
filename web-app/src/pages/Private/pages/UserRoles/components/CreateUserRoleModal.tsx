import { ChangeEvent, Dispatch, FunctionComponent, SetStateAction, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { MenuItem, TextField } from "@mui/material";

import { Stack } from "@mui/system";

import {
	useCreateRoleMutation,
	useGetPermissionsQuery,
} from "@/pages/Private/redux/admin/admin.api";
import { ERROR_TYPE, getAllErrors, getAllRolePermissions, renderErrorMessages } from "@/utils";
import { Loader, Modal, ChipsList } from "@/components";
import { DEFAULT } from "@/constants";

import { CreateRoleForm, CreateRoleFormSchema } from "../schema/roles";

interface CreateUserRoleModalProps {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const CreateUserRoleModal: FunctionComponent<CreateUserRoleModalProps> = ({
	isOpen,
	setIsOpen,
}) => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`userRoles.modal.create.${key}`);

	const [createRole, { isLoading, error }] = useCreateRoleMutation();
	const { data: permissions, isLoading: isLoadingPermissions } = useGetPermissionsQuery();

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateRoleForm>({
		defaultValues: {
			name: "",
			code: "",
			description: "",
			permissions: [],
		},
		resolver: zodResolver(CreateRoleFormSchema),
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

	const onSubmit = async (values: CreateRoleForm) => {
		try {
			await createRole({
				...values,
				permissions: userPermissions.map((permission) => permission.identifier),
			}).unwrap();
			setIsOpen(false);
		} catch (err) {
			console.error(err);
		}
	};

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

	return (
		<Modal
			handleClose={() => setIsOpen(false)}
			handleSave={handleSubmit(onSubmit)}
			isLoading={isLoading}
			isOpened={isOpen}
			submitButtonText={t("basics.confirm")}
			title={ts("title")}
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
							{ts("permissionPlaceholder")}
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
