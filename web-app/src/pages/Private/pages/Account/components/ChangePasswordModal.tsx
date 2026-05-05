import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@mui/material";
import { Box, Stack } from "@mui/system";

import { Modal } from "@/components";
import { useChangePasswordMutation } from "@/pages/Private/redux/account/account.api";
import { ERROR_TYPE, getAllErrors, renderErrorMessages } from "@/utils";

import { ChangePassword, ChangePasswordSchema } from "../schema/account";

interface ChangePasswordModalProps {
	isVisible: boolean;
	handleClose: () => void;
}

export const ChangePasswordModal: FunctionComponent<ChangePasswordModalProps> = ({
	isVisible,
	handleClose,
}) => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`account.${key}`);

	const [changePassword, { isLoading, error }] = useChangePasswordMutation();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<ChangePassword>({
		defaultValues: {
			oldPassword: "",
			password: "",
			confirmPassword: "",
		},
		resolver: zodResolver(ChangePasswordSchema),
	});

	const formErrors = Object.values(errors).map((error) => error?.message) as ERROR_TYPE[];

	const onSubmit = async (values: ChangePassword) => {
		try {
			await changePassword(values).unwrap();
			reset();
			handleClose();
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Modal
			handleClose={handleClose}
			handleSave={handleSubmit(onSubmit)}
			isLoading={isLoading}
			isOpened={isVisible}
			title={ts("changePassword")}
		>
			<Box component="form">
				<Stack mt="2" spacing={2}>
					<TextField
						error={!!errors.oldPassword?.message}
						label={ts("currentPassword")}
						placeholder={ts("currentPassword")}
						type="password"
						{...register("oldPassword")}
					/>

					<TextField
						error={!!errors.password?.message}
						label={ts("newPassword")}
						placeholder={ts("newPassword")}
						type="password"
						{...register("password")}
					/>

					<TextField
						error={!!errors.confirmPassword?.message}
						label={ts("repeatPassword")}
						placeholder={ts("repeatPassword")}
						type="password"
						{...register("confirmPassword")}
					/>

					{getAllErrors(error, formErrors).length
						? renderErrorMessages(getAllErrors(error, formErrors))
						: null}
				</Stack>
			</Box>
		</Modal>
	);
};
