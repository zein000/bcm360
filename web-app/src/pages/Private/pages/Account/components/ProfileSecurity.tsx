import { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Box,
	Card,
	CardContent,
	Unstable_Grid2 as Grid,
	Stack,
	Switch,
	Typography,
} from "@mui/material";

import { useGenerateTwoFactorCodeMutation } from "@/pages/Private/redux/account/account.api";

import { Enable2FAModal } from "./Enable2FAModal";

export const ProfileSecurity: FunctionComponent<{ is2FAEnabled: boolean }> = ({ is2FAEnabled }) => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`account.${key}`);

	const [generate, { data: qrCode, isLoading }] = useGenerateTwoFactorCodeMutation();

	const [is2FAEnableModalOpen, setIs2FAEnableModalOpen] = useState<boolean>(false);

	const handle2FactAuthChange = async () => {
		setIs2FAEnableModalOpen(true);

		if (!is2FAEnabled) {
			await generate();
		}
	};

	return (
		<>
			<Card>
				<CardContent>
					<Grid container spacing={3}>
						<Grid md={4} xs={12}>
							<Typography variant="h6">{ts("profileSecurity")}</Typography>
						</Grid>

						<Grid md={8} xs={12}>
							<Stack spacing={3}>
								<Stack alignItems="center" direction="row" spacing={2}>
									<Box width="100%">
										<Typography variant="subtitle1">{ts("enableTwoFactorAuth")}</Typography>

										<Typography color="neutral.500" variant="body1">
											{ts("enableTwoFactorAuthDescription")}
										</Typography>
									</Box>

									<Switch checked={is2FAEnabled} color="primary" onChange={handle2FactAuthChange} />
								</Stack>
							</Stack>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			{is2FAEnableModalOpen && (
				<Enable2FAModal
					isLoading={isLoading}
					isOpen={is2FAEnableModalOpen}
					qrCode={is2FAEnabled ? "" : (qrCode as string)}
					setIsOpen={setIs2FAEnableModalOpen}
				/>
			)}
		</>
	);
};
