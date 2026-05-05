import { FunctionComponent, useState, MouseEvent, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Stack } from "@mui/system";
import {
	Button,
	Card,
	CardContent,
	Unstable_Grid2 as Grid,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	TextField,
	Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { faAngleDown, faCheck } from "@fortawesome/pro-regular-svg-icons";

import { useUpdateMeMutation } from "@/pages/Private/redux/account/account.api";
import { Avatar, FileUploader, Icon, Popup } from "@/components";

import { languages } from "@/constants";

import i18n from "@/i18n";

import { UserLanguage } from "@/enum/user.enum";

import {
	UpdateFirstName,
	UpdateFirstNameSchema,
	UpdateLastNameSchema,
	UpdateLastName,
} from "../schema/account";
import { ChangePasswordModal } from "./ChangePasswordModal";

type ProfileInformationProps = {
	firstName: string;
	lastName: string;
	userLanguage: UserLanguage;
};

enum FieldType {
	FIRSTNAME = "firstName",
	LASTNAME = "lastName",
	LINKEDINURL = "linkedinUrl",
}

type SubmitValues = {
	[FieldType.FIRSTNAME]?: string;
	[FieldType.LASTNAME]?: string;
	[FieldType.LINKEDINURL]?: string;
};

type FieldsConfig = {
	firstName: boolean;
	lastName: boolean;
	linkedinUrl: boolean;
	canSubmitField: FieldType | null;
};

export const ProfileInformation: FunctionComponent<ProfileInformationProps> = ({
	firstName,
	lastName,
	userLanguage,
}) => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`account.${key}`);

	const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);
	const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
	const [avatarSrc, setAvatarSrc] = useState<string>("");
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [showLanguagePopover, setShowLanguagePopover] = useState(false);
	const [canEdit, setCanEdit] = useState<FieldsConfig>({
		firstName: false,
		lastName: false,
		linkedinUrl: false,
		canSubmitField: null,
	});
	const [updateMe, { isLoading }] = useUpdateMeMutation();

	useEffect(() => {
		if (userLanguage) {
			i18n.changeLanguage(userLanguage.toLowerCase());
		}
	}, [userLanguage]);

	const onClose = () => {
		setAnchorEl(null);
		setShowLanguagePopover(false);
	};

	const handleLanguagePopoverOpen = (event: MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
		setShowLanguagePopover(true);
	};

	const handleLanguageChange = async (language: string) => {
		const languageCode = language.toUpperCase() as UserLanguage;

		await updateMe({
			userLanguage: languageCode,
		})
			.unwrap()
			.then(() => {
				window.location.reload();
			});
	};

	const {
		register: firstNameRegister,
		handleSubmit: firstNameHandleSubmit,
		formState: { errors: firstNameErrors, defaultValues: firstNameDefaultValues },
		setFocus: firstNameSetFocus,
		reset: firstNameReset,
	} = useForm<UpdateFirstName>({
		defaultValues: {
			firstName,
		},
		resolver: zodResolver(UpdateFirstNameSchema),
	});

	const {
		register: lastNameRegister,
		handleSubmit: lastNameHandleSubmit,
		formState: { errors: lastNameErrors, defaultValues: lastNameDefaultValues },
		setFocus: lastNameSetFocus,
		reset: lastNameReset,
	} = useForm<UpdateLastName>({
		defaultValues: {
			lastName,
		},
		resolver: zodResolver(UpdateLastNameSchema),
	});

	const onSubmit = async (values: SubmitValues) => {
		const submittedFieldName =
			canEdit.canSubmitField === FieldType.FIRSTNAME &&
			firstNameDefaultValues?.firstName !== (values as UpdateFirstName).firstName
				? FieldType.FIRSTNAME
				: canEdit.canSubmitField === FieldType.LASTNAME &&
				  lastNameDefaultValues?.lastName !== (values as UpdateLastName).lastName
				? FieldType.LASTNAME
				: null;

		if (submittedFieldName) {
			try {
				await updateMe({
					[submittedFieldName]: values[submittedFieldName],
				}).unwrap();

				setCanEdit({
					...canEdit,
					[submittedFieldName]: false,
				});

				if (submittedFieldName === FieldType.FIRSTNAME) {
					firstNameReset({ [submittedFieldName]: values[submittedFieldName] });
				} else if (submittedFieldName === FieldType.LASTNAME) {
					lastNameReset({ [submittedFieldName]: values[submittedFieldName] });
				}
			} catch (err) {
				console.error(err);
			}
		}
	};

	const onClickHandler = (field: FieldType) => {
		if (!canEdit[field]) {
			field === FieldType.FIRSTNAME
				? firstNameSetFocus(field)
				: field === FieldType.LASTNAME
				? lastNameSetFocus(field)
				: null;
		}

		setCanEdit({
			...canEdit,
			[field]: true,
			canSubmitField:
				field === FieldType.FIRSTNAME && canEdit.firstName
					? FieldType.FIRSTNAME
					: field === FieldType.LASTNAME && canEdit.lastName
					? FieldType.LASTNAME
					: null,
		});
	};

	return (
		<>
			<Card>
				<CardContent>
					<Grid container spacing={3}>
						<Grid md={4} xs={12}>
							<Typography variant="h6">{ts("profileInformation")}</Typography>
						</Grid>

						<Grid md={8} xs={12}>
							<Stack spacing={3}>
								<Box>
									<Stack direction="row" spacing={2}>
										<Box onClick={() => setShowAvatarModal(true)}>
											<Avatar imageSrc={avatarSrc} />
										</Box>

										<Button onClick={() => setShowAvatarModal(true)}>{t("basics.change")}</Button>

										<FileUploader
											handleClose={() => setShowAvatarModal(false)}
											handleFile={(file) => setAvatarSrc(URL.createObjectURL(file))}
											isOpened={showAvatarModal}
										/>
									</Stack>
								</Box>

								<Box component="form" onSubmit={firstNameHandleSubmit(onSubmit)}>
									<Stack alignItems="center" direction="row" spacing={2}>
										<TextField
											fullWidth
											error={!!firstNameErrors.firstName?.message}
											inputProps={{ readOnly: !canEdit.firstName }}
											label={t("basics.firstName")}
											variant="filled"
											{...firstNameRegister("firstName")}
										/>

										<LoadingButton
											disabled={!!firstNameErrors.firstName?.message}
											loading={canEdit.canSubmitField === FieldType.FIRSTNAME && isLoading}
											type="submit"
											onClick={() => onClickHandler(FieldType.FIRSTNAME)}
										>
											{canEdit.firstName ? t("basics.save") : t("basics.edit")}
										</LoadingButton>
									</Stack>
								</Box>

								<Box component="form" onSubmit={lastNameHandleSubmit(onSubmit)}>
									<Stack alignItems="center" direction="row" spacing={2}>
										<TextField
											fullWidth
											error={!!lastNameErrors.lastName?.message}
											inputProps={{ readOnly: !canEdit.lastName }}
											label={t("basics.lastName")}
											variant="filled"
											{...lastNameRegister("lastName")}
										/>

										<LoadingButton
											disabled={!!lastNameErrors.lastName?.message}
											loading={canEdit.canSubmitField === FieldType.LASTNAME && isLoading}
											type="submit"
											onClick={() => onClickHandler(FieldType.LASTNAME)}
										>
											{canEdit.lastName ? t("basics.save") : t("basics.edit")}
										</LoadingButton>
									</Stack>
								</Box>

								<Stack alignItems="center" direction="row" spacing={2}>
									<TextField
										fullWidth
										defaultValue="password"
										inputProps={{ readOnly: true }}
										label={t("basics.password")}
										type="password"
										variant="filled"
									/>

									<LoadingButton onClick={() => setShowPasswordModal(true)}>
										{t("basics.edit")}
									</LoadingButton>
								</Stack>
								<Stack
									alignItems="center"
									direction="row"
									gap={1}
									sx={{ color: "neutral.500", cursor: "pointer" }}
									onClick={handleLanguagePopoverOpen}
								>
									<Box
										component="img"
										src={languages.find((l) => l.code === i18n.language)?.image}
										sx={{
											width: "1.5rem",
											height: "1.5rem",
											borderRadius: "100%",
											objectFit: "cover",
										}}
									/>
									<Typography color="text.primary" variant="body2">
										{languages.find((l) => l.code === i18n.language)?.shortName}
									</Typography>
									<Box
										sx={{
											transform: `rotate(${showLanguagePopover ? 180 : 0}deg)`,
											transition: "transform 0.2s",
										}}
									>
										<Icon icon={faAngleDown} />
									</Box>
								</Stack>
								<Popup anchorEl={anchorEl} showPopover={showLanguagePopover} onClose={onClose}>
									{languages.map((language) => (
										<ListItem
											key={`language-${language.code}`}
											disablePadding
											secondaryAction={
												language.code === i18n.language ? <Icon icon={faCheck} /> : null
											}
											onClick={() => handleLanguageChange(language.code)}
										>
											<ListItemButton
												sx={{
													px: 2,
													py: 1,
												}}
											>
												<ListItemIcon sx={{ height: 24 }}>
													<Box component="img" src={language.image} />
												</ListItemIcon>
												<ListItemText
													primary={<Typography variant="body1">{language.name}</Typography>}
												/>
											</ListItemButton>
										</ListItem>
									))}
								</Popup>
							</Stack>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			{showPasswordModal && (
				<ChangePasswordModal
					handleClose={() => setShowPasswordModal(false)}
					isVisible={showPasswordModal}
				/>
			)}
		</>
	);
};
