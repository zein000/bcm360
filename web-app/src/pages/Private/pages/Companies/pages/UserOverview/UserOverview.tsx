/* eslint-disable import/order */
import { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";

import { useParams } from "react-router-dom";

import { Icon } from "@/components";

import { UsersTable } from "../../../Users/components/UsersTable";
import { InviteUserModal } from "../../../Users/components/InviteUserModal";
import { authSelector } from "@/pages/Public/redux/auth.slice";
import { useAppSelector } from "@/redux/hooks";
import { useGetCompanyQuery } from "@/pages/Private/redux/companies/companies.api";
import { Button } from "@/components/Button/Button";
import { ButtonSize } from "@/components/Button/types";

export const UserOverview: FunctionComponent = () => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`users.${key}`);
	const { id } = useParams();
	const { user } = useAppSelector(authSelector);
	const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);

	const { data: company } = useGetCompanyQuery(id ? +id : user?.company?.id || 0);

	return (
		<>
			<div className="flex flex-row mb-4">
				<div className="flex items-end justify-between w-full mb-4">
					<div className="flex-grow">
						<h3 className="mb-2 text-lg font-semibold leading-7">{ts("title")}</h3>
						<h3 className="mb-3 text-sm font-normal">{company?.name}</h3>
					</div>
				</div>

				<div>
					<Button
						image={<Icon className="mr-2" icon={faPlus} />}
						size={ButtonSize.M}
						title={t("inviteUser.button")}
						onClick={() => setIsInviteModalOpen(true)}
					/>
				</div>
			</div>

			<UsersTable />

			{isInviteModalOpen && (
				<InviteUserModal
					companyId={id ? +id : undefined}
					isOpen={isInviteModalOpen}
					setIsOpen={setIsInviteModalOpen}
				/>
			)}
		</>
	);
};
