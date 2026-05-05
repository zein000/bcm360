import { zodResolver } from "@hookform/resolvers/zod";
import { Typography } from "@mui/material";
import { FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";

import { useResetPasswordMutation } from "@/pages/Public/redux/auth.api";

import FormTextField from "@/pages/Private/pages/Account/components/FormTextField";

import FormContainer from "../../components/FormContainer";
import { ForgotPasswordSchema, ForgotPasswordType } from "./schema/forgot-password";

export const ForgotPassword: FunctionComponent = () => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`forgotPassword.${key}`);
	const [resetPassword, { isLoading, isSuccess, error }] = useResetPasswordMutation();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ForgotPasswordType>({
		defaultValues: {
			email: "",
		},
		resolver: zodResolver(ForgotPasswordSchema),
	});

	const onSubmit = async (values: ForgotPasswordType) => {
		try {
			await resetPassword(values).unwrap();
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="w-full h-full flex items-center justify-center">
			<FormContainer
				description={ts("description")}
				formError={error}
				handleSubmit={handleSubmit(onSubmit)}
				isLoading={isLoading}
				secondaryButtonAction={() => navigate("/login")}
				secondaryButtonText={ts("back-to-login")}
				submitButtonText={!isSuccess ? ts("send") : ""}
				title={ts("title")}
			>
				{!isSuccess && (
					<FormTextField
						autoComplete="email"
						errorMessage={errors?.email?.message}
						formRegister={register("email")}
						label={t("basics.email")}
						type="email"
					/>
				)}
				{isSuccess && (
					<Typography component="p" mb={4} variant="body2">
						{t("forgotPassword.submittedFeedbackMessage")}
					</Typography>
				)}
			</FormContainer>
		</div>
	);
};
