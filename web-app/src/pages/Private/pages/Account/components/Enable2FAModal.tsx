import { Dispatch, FunctionComponent, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { Box, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Modal } from "@/components";
import {
	useDisableTwoFactorMutation,
	useVerifyTwoFactorMutation,
} from "@/pages/Private/redux/account/account.api";
import {
	TwoFactorAuth,
	TwoFactorAuthSchema,
} from "@/pages/Public/pages/TwoFactorAuth/schema/twoFactorAuth";
import { ERROR_TYPE, getAllErrors, renderErrorMessages } from "@/utils";

interface Enable2FAModalProps {
	isOpen: boolean;
	qrCode: string;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	isLoading: boolean;
}

export const Enable2FAModal: FunctionComponent<Enable2FAModalProps> = ({
	isOpen,
	qrCode,
	setIsOpen,
	isLoading,
}) => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`account.${key}`);

	const [verify, { isLoading: isVerifying, error: verifyError }] = useVerifyTwoFactorMutation();
	const [disable, { isLoading: isDisabling, error: disableError }] = useDisableTwoFactorMutation();

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

	const formErrors = Object.values(errors).map((error) => error.message) as ERROR_TYPE[];

	const handleClose = () => {
		setIsOpen(false);
	};

	const onSubmit = async ({ code }: TwoFactorAuth) => {
		try {
			if (qrCode) {
				await verify({ code }).unwrap();
			} else {
				await disable({ code }).unwrap();
			}

			setIsOpen(false);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Modal
			handleClose={handleClose}
			handleSave={handleSubmit(onSubmit)}
			isLoading={isLoading || isVerifying || isDisabling}
			isOpened={isOpen}
			submitButtonText={t("basics.saveChanges")}
			title={ts("enableTwoFactorAuth")}
		>
			{qrCode && (
				<Stack alignItems="center" maxHeight={220}>
					<Box component="img" src={qrCode} />
				</Stack>
			)}

			<Box component="form">
				<TextField fullWidth label={t("basics.code")} {...register("code")} />
			</Box>

			{getAllErrors(verifyError || disableError, formErrors).length ? (
				<Box sx={{ mt: 2 }}>
					{renderErrorMessages(getAllErrors(verifyError || disableError, formErrors))}
				</Box>
			) : null}
		</Modal>
	);
};
