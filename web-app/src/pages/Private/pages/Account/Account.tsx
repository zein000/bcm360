import { Box, Button, InputAdornment } from "@mui/material";
import { FunctionComponent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { EmailOutlined } from "@mui/icons-material";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { authSelector } from "@/pages/Public/redux/auth.slice";
import { useAppSelector } from "@/redux/hooks";

import { usePageTitle } from "@/utils/usePageTitle";

import { useUpdateMeMutation } from "../../redux/account/account.api";
import { ChangePasswordModal } from "./components/ChangePasswordModal";
import FormTextField from "./components/FormTextField";
import { UpdateMyProfileInformation, UpdateMyProfileInformationSchema } from "./schema/account";

export const Account: FunctionComponent = () => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`account.${key}`);
	const [updateMe, { isLoading }] = useUpdateMeMutation();
	const { user } = useAppSelector(authSelector);
	const [showPasswordModal, setShowPasswordModal] = useState(false);
	const initialValues: UpdateMyProfileInformation = useMemo(
		() => ({
			firstName: user?.firstName ?? "",
			lastName: user?.lastName ?? "",
			email: user?.email ?? "",
		}),
		[user]
	);

	usePageTitle(ts("title"));

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<UpdateMyProfileInformation>({
		defaultValues: initialValues,
		resolver: zodResolver(UpdateMyProfileInformationSchema),
	});

	const onSubmit = async (values: UpdateMyProfileInformation) => {
		const body = {} as Partial<UpdateMyProfileInformation>;
		const { ...info } = values;

		for (const key in info) {
			const initialValue = initialValues[key as keyof UpdateMyProfileInformation];
			const currentValue = values[key as keyof UpdateMyProfileInformation];

			if (currentValue !== initialValue) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(body as any)[key] = currentValue;
			}
		}

		try {
			if (Object.entries(body).length > 0) {
				await updateMe({ ...body });
			}
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<>
			<Box
				noValidate
				autoComplete="off"
				component="form"
				sx={{
					paddingTop: "24px",
					paddingBottom: "16px",
					gap: "12px",
					maxWidth: 640,
					borderWidth: "1px",
					m: "32px",
					borderRadius: "12px",
					borderColor: "#EAECF0",
					backgroundColor: "#F9FAFB",
					boxShadow: "0px 1px 2px 0px #1018280D",
				}}
			>
				<Box sx={{ paddingX: "24px", mb: "12px" }}>
					<div className="flex flex-col justify-between md:flex-row md:gap-6">
						<FormTextField
							errorMessage={errors?.firstName?.message}
							formRegister={register("firstName")}
							label={t("basics.firstName")}
						/>
						<FormTextField
							errorMessage={errors?.lastName?.message}
							formRegister={register("lastName")}
							label={t("basics.lastName")}
						/>
					</div>
					<FormTextField
						errorMessage={errors?.email?.message}
						formRegister={register("email")}
						label={t("basics.email")}
						startAdornment={
							<InputAdornment position="start">
								<EmailOutlined />
							</InputAdornment>
						}
					/>
				</Box>

				<Box
					sx={{
						display: "flex",
						alignContent: "end",
						justifyContent: "space-between",
						borderTopWidth: 1,
						borderTopColor: "#EAECF0",
						paddingTop: "17px",
						paddingX: "24px",
					}}
				>
					<Button
						sx={{
							backgroundColor: "#fff",
							borderRadius: "8px",
							textTransform: "initial",
							color: "#344054",
							paddingX: "16px",
							paddingY: "10px",
							fontWeight: "600",
							fontSize: "14px",
							borderWidth: "1px",
							borderColor: "#D0D5DD",
							borderStyle: "solid",
							"&:hover": {
								backgroundColor: "#fff60",
							},
						}}
						onClick={() => {
							setShowPasswordModal(true);
						}}
					>
						{ts("changePassword")}
					</Button>
					<Box
						sx={{
							display: "flex",
							gap: "12px",
						}}
					>
						<Button
							sx={{
								backgroundColor: "#fff",
								borderRadius: "8px",
								textTransform: "initial",
								color: "#344054",
								paddingX: "16px",
								paddingY: "10px",
								fontWeight: "600",
								fontSize: "14px",
								borderWidth: "1px",
								borderColor: "#D0D5DD",
								borderStyle: "solid",
								"&:hover": {
									backgroundColor: "#fff60",
								},
							}}
							onClick={() => {
								reset(initialValues);
							}}
						>
							{ts("cancel")}
						</Button>
						<Button
							sx={{
								backgroundColor: "#3E4784",
								borderRadius: "8px",
								textTransform: "initial",
								color: "#fff",
								paddingX: "16px",
								paddingY: "10px",
								fontWeight: "600",
								fontSize: "14px",
								"&:hover": {
									backgroundColor: "#3E478480",
								},
							}}
							onClick={handleSubmit(onSubmit)}
						>
							{isLoading ? ts("saving") : ts("save")}
						</Button>
					</Box>
				</Box>
			</Box>
			{showPasswordModal && (
				<ChangePasswordModal
					handleClose={() => setShowPasswordModal(false)}
					isVisible={showPasswordModal}
				/>
			)}
		</>
	);
};
