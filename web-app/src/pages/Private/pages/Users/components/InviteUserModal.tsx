import { ChangeEvent, Dispatch, FunctionComponent, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MenuItem, TextField } from "@mui/material";
import { Stack } from "@mui/system";

import { useParams } from "react-router-dom";

import { Loader, Modal } from "@/components";
import { ERROR_TYPE, getAllErrors, renderErrorMessages } from "@/utils";
import { useGetRolesQuery, useInviteUserMutation } from "@/pages/Private/redux/admin/admin.api";
import { DEFAULT } from "@/constants";

import { InviteForm, InviteFormSchema } from "../schema/invite-user";

interface InviteUserModalProps {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	companyId?: number;
}

export const InviteUserModal: FunctionComponent<InviteUserModalProps> = ({
	isOpen,
	setIsOpen,
	companyId,
}) => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`inviteUser.modal.${key}`);

	const { id } = useParams();
	const { data: roles } = useGetRolesQuery();
	const [invite, { isLoading, error }] = useInviteUserMutation();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<InviteForm>({
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			roleId: 0,
			companyId,
		},
		resolver: zodResolver(InviteFormSchema),
	});

	const formErrors = Object.values(errors).map((error) => error?.message) as ERROR_TYPE[];

	const onSubmit = async (values: InviteForm) => {
		const requestBody = {
			users: [values],
			companyId: id ? +id : undefined,
		};

		try {
			await invite(requestBody).unwrap();
			setIsOpen(false);
		} catch (err) {
			console.error(err);
		}
	};

	const handleUserRoleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const value = Number(event.target.value);

		if (!isNaN(value)) {
			setValue("roleId", value);
		}
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
			{!roles ? (
				<Loader />
			) : (
				<Stack spacing={2}>
					<TextField
						error={!!errors.firstName?.message}
						label={t("basics.firstName")}
						placeholder={t("basics.firstName")}
						{...register("firstName")}
					/>

					<TextField
						error={!!errors.lastName?.message}
						label={t("basics.lastName")}
						placeholder={t("basics.lastName")}
						{...register("lastName")}
					/>

					<TextField
						error={!!errors.email?.message}
						label={t("basics.email")}
						placeholder={t("basics.email")}
						{...register("email")}
					/>

					<TextField
						select
						error={!!errors.roleId?.message}
						label={t("basics.role")}
						value={DEFAULT}
						onChange={handleUserRoleChange}
					>
						<MenuItem disabled value={DEFAULT}>
							{ts("rolePlaceholder")}
						</MenuItem>

						{roles?.data?.map((role) => (
							<MenuItem key={role.id} value={role.id}>
								{role.name}
							</MenuItem>
						))}
					</TextField>

					{getAllErrors(error, formErrors).length
						? renderErrorMessages(getAllErrors(error, formErrors))
						: null}
				</Stack>
			)}
		</Modal>
	);
};
