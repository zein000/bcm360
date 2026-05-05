import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Checkbox, Typography } from "@mui/material";
import { FunctionComponent, useState } from "react";
import { useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

import { TokenPurpose } from "@/enum";

import { ROUTE_CONFIG } from "@/routes/config";

import FormTextField from "@/pages/Private/pages/Account/components/FormTextField";

import { ETokenStatus } from "@/enum/ETokenStatus";

import FormContainer from "../../components/FormContainer";
import { useAcceptInvitationMutation } from "../../redux/auth.api";
import { AcceptInvitationSchema, AcceptInvitationType } from "./schema/set-password";

export const AcceptInvitation: FunctionComponent = () => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`basics.${key}`);
	const [error, setError] = useState<string | null>(null);

	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const [acceptInvitation, { isLoading, error: reqError }] = useAcceptInvitationMutation();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<AcceptInvitationType>({
		defaultValues: {
			firstName: "",
			lastName: "",
			password: "",
			confirmPassword: "",
			termsAndConditions: false,
		},
		resolver: zodResolver(AcceptInvitationSchema),
	});

	const onSubmit = async (values: AcceptInvitationType) => {
		try {
			const result = await acceptInvitation({
				token: searchParams.get("token") || "",
				purpose: TokenPurpose.INVITATION,
				password: values.password,
				confirmPassword: values.confirmPassword,
				firstName: values.firstName,
				lastName: values.lastName,
			}).unwrap();

			if (result?.status) {
				if (result.status === ETokenStatus.USED) {
					if (result?.user) {
						navigate(ROUTE_CONFIG.LOGIN);
					} else {
						setError(ts("invitation-already-accepted"));
					}
				} else if (result.status === ETokenStatus.EXPIRED) {
					setError(ts("invitation-expired"));
				} else if (result.status === ETokenStatus.INVALID) {
					setError(ts("invitation-token-invalid"));
				}
			}
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="w-full h-full flex items-center justify-center">
			<FormContainer
				description={ts("confirm-invite-description")}
				formError={reqError ?? error}
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
				title={ts("accepting-invitation")}
			>
				<FormTextField
					autoComplete="firstName"
					errorMessage={errors?.firstName?.message}
					formRegister={register("firstName")}
					label={ts("firstName")}
				/>
				<FormTextField
					autoComplete="lastName"
					errorMessage={errors?.lastName?.message}
					formRegister={register("lastName")}
					label={ts("lastName")}
				/>
				<FormTextField
					autoComplete="password"
					errorMessage={errors?.password?.message}
					formRegister={register("password")}
					label={ts("password")}
					type="password"
				/>
				<FormTextField
					autoComplete="confirmPassword"
					errorMessage={errors?.confirmPassword?.message}
					formRegister={register("confirmPassword")}
					label={ts("confirmPassword")}
					type="password"
				/>
			</FormContainer>
		</div>
	);
};
