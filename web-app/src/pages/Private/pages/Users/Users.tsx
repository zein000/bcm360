import { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Stack, Typography } from "@mui/material";

import { Button } from "@/components/Button/Button";

import { ButtonColor, ButtonSize } from "@/components/Button/types";

import { InviteUserModal } from "./components/InviteUserModal";
import { UsersTable } from "./components/UsersTable";

export const Users: FunctionComponent = () => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`users.${key}`);

	const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);

	return (
		<>
			<Stack direction="row" justifyContent="space-between" mb={4}>
				<Typography variant="h2">{ts("title")}</Typography>
				<div className="w-[200px]">
					<Button
						color={ButtonColor.ACTION}
						size={ButtonSize.S}
						testId="new-user-button"
						title={t("inviteUser.button")}
						onClick={() => setIsInviteModalOpen(true)}
					/>
				</div>
			</Stack>

			<UsersTable />

			{isInviteModalOpen && (
				<InviteUserModal isOpen={isInviteModalOpen} setIsOpen={setIsInviteModalOpen} />
			)}
		</>
	);
};
