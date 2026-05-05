import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@mui/material";
import { FunctionComponent, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { faEnvelope, faEye, faEyeSlash, faLock } from "@fortawesome/pro-regular-svg-icons";

import { NavLink } from "react-router-dom";

import { Icon } from "@/components";

import FormTextField from "@/pages/Private/pages/Account/components/FormTextField";

import FormContainer from "../../components/FormContainer";
import { useLoginMutation } from "../../redux/auth.api";
import { LoginSchema, LoginType } from "./schema/login";

export const Login: FunctionComponent = () => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`login.${key}`);
	const [passwordFieldType, setPasswordFieldType] = useState("password");

	const [login, { isLoading, error }] = useLoginMutation();

	const initialValues: LoginType = {
		email: "",
		password: "",
		isRememberMe: true,
	};

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<LoginType>({
		defaultValues: initialValues,
		resolver: zodResolver(LoginSchema),
	});

	const onSubmit = async (values: LoginType) => {
		try {
			await login(values).unwrap();
		} catch (err) {
			console.error(err);
		}
	};

	const isRememberMe = watch("isRememberMe");

	return (
		<div className="w-full h-full flex items-center justify-center">
			<FormContainer
				description={ts("description")}
				formError={error}
				formFooter={
					<div className="w-full flex justify-between items-center">
						<div className="flex items-center gap-2">
							<Checkbox checked={isRememberMe} {...register("isRememberMe")} sx={{ p: "0px" }} />
							<p className="text-[14px] text-primary-blue text-nowrap">{ts("remember-me")}</p>
						</div>
						<NavLink
							className="text-[14px] text-primary-blue-hover text-nowrap"
							to={"/forgot-password"}
						>
							{ts("forgotPasswordCta")}
						</NavLink>
					</div>
				}
				handleSubmit={handleSubmit(onSubmit)}
				isLoading={isLoading}
				submitButtonText={ts("loginCta")}
				title={ts("title")}
			>
				<FormTextField
					autoComplete="email"
					errorMessage={errors?.email?.message}
					formRegister={register("email")}
					label={t("basics.email")}
					startAdornment={
						<Icon className="w-4 h-4 mr-2 text-primary-gray-lighter" icon={faEnvelope} />
					}
					type="email"
				/>
				<FormTextField
					autoComplete="password"
					endAdornment={
						<button
							aria-label={passwordFieldType === "password" ? "Show password" : "Hide password"}
							type="button"
							onClick={() =>
								setPasswordFieldType(passwordFieldType === "password" ? "text" : "password")
							}
						>
							<Icon
								className="w-4 h-4 text-primary-gray-lighter"
								icon={passwordFieldType === "password" ? faEye : faEyeSlash}
							/>
						</button>
					}
					errorMessage={errors?.password?.message}
					formRegister={register("password")}
					label={t("basics.password")}
					startAdornment={<Icon className="w-4 h-4 mr-2 text-primary-gray-lighter" icon={faLock} />}
					type={passwordFieldType}
				/>
			</FormContainer>
		</div>
	);
};
