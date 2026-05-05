import { ChangeEvent, FunctionComponent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MenuItem, Stack, TextField } from "@mui/material";

import { useGetRolesQuery, useUpdateUserMutation } from "@/pages/Private/redux/admin/admin.api";
import { Loader, Modal } from "@/components";
import { ERROR_TYPE, getAllErrors, hasPermission, renderErrorMessages } from "@/utils";
import { User } from "@/pages/Public/pages/Login/schema/login";
import { DEFAULT } from "@/constants";

import { FlagHeader } from "@/components/Modals/FlagHeader";

import { useAppSelector } from "@/redux/hooks";

import { PermissionRoles } from "@/enum";

import { UpdateUser, UpdateUserForm, UpdateUserFormSchema } from "../schema/update-user";

interface EditUserModalProps {
	user: User | null;
	isVisible: boolean;
	handleClose: () => void;
	companyId?: number;
}

export const EditUserModal: FunctionComponent<EditUserModalProps> = ({
	user,
	isVisible,
	handleClose,
}) => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`modals.editUser.${key}`);

	const [selectedUser, setSelectedUser] = useState<User | null>(user);
	const currentUserAuth = useAppSelector((state) => state.auth.user);
	const { data: roles } = useGetRolesQuery();
	const [updateUser, { isLoading, error }] = useUpdateUserMutation();

	const initialValues: UpdateUserForm = {
		firstName: user?.firstName ?? "",
		lastName: user?.lastName ?? "",
		email: user?.email ?? "",
		roleId: user?.role?.id ?? 0,
	};

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<UpdateUserForm>({
		defaultValues: initialValues,
		resolver: zodResolver(UpdateUserFormSchema),
	});

	const formErrors = Object.values(errors).map((error) => error?.message) as ERROR_TYPE[];

	const handleUserRoleChange = (event: ChangeEvent<{ value: unknown }>) => {
		if (roles && event?.target?.value) {
			const selectedRole = roles.data.find((item) => item.id === (event.target.value as number));

			if (selectedUser && selectedRole) {
				setSelectedUser({ ...selectedUser, role: selectedRole });
			}
		}

		setValue("roleId", event.target.value as number);
	};

	const onSubmit = async (values: UpdateUserForm) => {
		const body = {} as Partial<UpdateUser>;
		const { ...info } = values;

		for (const key in info) {
			const initialValue = initialValues[key as keyof UpdateUser];
			const currentValue = values[key as keyof UpdateUser];

			if (currentValue !== initialValue) {
				if (key === "roleId" && user?.role?.id !== currentValue) {
					body.roleId = currentValue as number;
				} else if (currentValue !== undefined && key !== "roleId") {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(body as any)[key] = currentValue;
				}
			}
		}

		try {
			if (Object.entries(body).length > 0) {
				await updateUser({ id: selectedUser?.id ?? 0, body });
			}

			handleClose();
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		if (user) {
			setSelectedUser(user);
		}
	}, [user]);

	const isEnoughPermissionForChangingRole = useMemo(() => {
		if (currentUserAuth && user?.role?.code) {
			return hasPermission(currentUserAuth, [user.role.code as PermissionRoles]);
		}

		return false;
	}, [currentUserAuth, user]);

	return (
		<Modal
			aboveHeader={<FlagHeader onClick={() => console.log("Flag icon clicked!")} />}
			handleClose={handleClose}
			handleSave={handleSubmit(onSubmit)}
			isLoading={isLoading}
			isOpened={isVisible}
			title={ts("title")}
		>
			{!roles ? (
				<Loader />
			) : (
				<>
					<Stack spacing={2}>
						<div className="flex flex-row gap-2">
							{" "}
							<TextField
								error={!!errors.firstName?.message}
								label={t("basics.firstName")}
								{...register("firstName")}
							/>
							<TextField
								error={!!errors.lastName?.message}
								label={t("basics.lastName")}
								{...register("lastName")}
							/>
						</div>

						<TextField
							error={!!errors.email?.message}
							inputProps={{ readOnly: true }}
							label={t("basics.email")}
							{...register("email")}
						/>
						<TextField
							select
							disabled={!isEnoughPermissionForChangingRole}
							error={!!errors.roleId?.message}
							label={t("basics.role")}
							value={selectedUser?.role?.id ?? DEFAULT}
							onChange={handleUserRoleChange}
						>
							{isEnoughPermissionForChangingRole ? (
								roles?.data?.map((role) => (
									<MenuItem key={role.id} value={role.id}>
										{role.name}
									</MenuItem>
								))
							) : (
								<MenuItem key={user?.role.id} value={user?.role.id}>
									{user?.role.name}
								</MenuItem>
							)}
						</TextField>

						{getAllErrors(error, formErrors).length
							? renderErrorMessages(getAllErrors(error, formErrors))
							: null}
					</Stack>
				</>
			)}
		</Modal>
	);
};
