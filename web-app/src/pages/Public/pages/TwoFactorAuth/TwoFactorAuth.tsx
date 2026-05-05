import { zodResolver } from "@hookform/resolvers/zod";
import { FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "@/redux/hooks";

import FormTextField from "@/pages/Private/pages/Account/components/FormTextField";

import FormContainer from "../../components/FormContainer";
import { useAuthTwoFactorCodeMutation } from "../../redux/auth.api";
import { authSelector } from "../../redux/auth.slice";
import { TwoFactorAuthSchema } from "./schema/twoFactorAuth";

export const TwoFactorAuth: FunctionComponent = () => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`twoFA.${key}`);

	const { otpToken } = useAppSelector(authSelector);

	const [auth, { isLoading }] = useAuthTwoFactorCodeMutation();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			code: "",
		},
		resolver: zodResolver(TwoFactorAuthSchema),
	});

	const onSubmit = async ({ code }: { code: string }) => {
		try {
			await auth({ code, token: otpToken ?? "" }).unwrap();
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="w-full h-full flex items-center justify-center">
			<FormContainer
				description={ts("description")}
				handleSubmit={handleSubmit(onSubmit)}
				isLoading={isLoading}
				submitButtonText={ts("cta")}
				title={ts("title")}
			>
				<FormTextField
					autoComplete="off"
					errorMessage={errors?.code?.message}
					formRegister={register("code")}
					label={ts("code")}
				/>
			</FormContainer>
		</div>
	);
};
