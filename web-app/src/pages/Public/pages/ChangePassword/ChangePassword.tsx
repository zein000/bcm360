import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Checkbox, Typography } from "@mui/material";
import { FunctionComponent, useState } from "react";
import { useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

import { faEye, faLock } from "@fortawesome/pro-regular-svg-icons";

import { Icon } from "@/components";
import { TokenPurpose } from "@/enum";

import { ROUTE_CONFIG } from "@/routes/config";

import FormTextField from "@/pages/Private/pages/Account/components/FormTextField";

import FormContainer from "../../components/FormContainer";
import { useSetPasswordMutation } from "../../redux/auth.api";
import { SetPasswordSchema, SetPasswordType } from "./schema/set-password";

export const ChangePassword: FunctionComponent = () => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`basics.${key}`);

	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [passwordFieldType, setPasswordFieldType] = useState("password");

	const [setPassword, { isLoading, error }] = useSetPasswordMutation();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SetPasswordType>({
		defaultValues: {
			password: "",
			confirmPassword: "",
			termsAndConditions: false,
		},
		resolver: zodResolver(SetPasswordSchema),
	});

	const onSubmit = async (values: SetPasswordType) => {
		try {
			await setPassword({
				token: searchParams.get("token") || "",
				purpose: TokenPurpose.FORGOTTEN_PASSWORD,
				password: values.password,
				confirmPassword: values.confirmPassword,
			}).unwrap();
			navigate(ROUTE_CONFIG.LOGIN);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="w-full h-full flex items-center justify-center">
			<FormContainer
				description={ts("update-pass-description")}
				formError={error}
				formFooter={
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<Checkbox
							sx={errors?.termsAndConditions?.message ? { color: "red" } : {}}
							{...register("termsAndConditions")}
						/>

						<Trans
							components={{
								noLink: (
									<Typography color="text.secondary" component="p" ml={0.5} variant="body2" />
								),
								link1: (
									<Typography
										color="primary"
										component="a"
										href="https://www.google.bg"
										rel="noreferrer"
										sx={{ ml: 0.5, textDecoration: "none" }}
										target="_blank"
										variant="subtitle2"
									/>
								),
							}}
							i18nKey="basics.termsAndConditions"
						/>
					</Box>
				}
				handleSubmit={handleSubmit(onSubmit)}
				isLoading={isLoading}
				submitButtonText={ts("confirm")}
				title={ts("setPassword")}
			>
				<FormTextField
					autoComplete="password"
					endAdornment={
						<button
							type="button"
							onClick={() =>
								setPasswordFieldType(passwordFieldType === "password" ? "text" : "password")
							}
						>
							<Icon className="w-4 h-4 text-primary-gray-lighter" icon={faEye} />
						</button>
					}
					errorMessage={errors?.password?.message}
					formRegister={register("password")}
					label={ts("password")}
					startAdornment={<Icon className="w-4 h-4 mr-2 text-primary-gray-lighter" icon={faLock} />}
					type="password"
				/>
				<FormTextField
					autoComplete="confirmPassword"
					endAdornment={
						<button
							type="button"
							onClick={() =>
								setPasswordFieldType(passwordFieldType === "password" ? "text" : "password")
							}
						>
							<Icon className="w-4 h-4 text-primary-gray-lighter" icon={faEye} />
						</button>
					}
					errorMessage={errors?.confirmPassword?.message}
					formRegister={register("confirmPassword")}
					label={ts("confirmPassword")}
					startAdornment={<Icon className="w-4 h-4 mr-2 text-primary-gray-lighter" icon={faLock} />}
					type="password"
				/>
			</FormContainer>
		</div>
	);
};
