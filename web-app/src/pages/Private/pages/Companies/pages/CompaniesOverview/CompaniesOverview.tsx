import { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";

import { faPlus } from "@fortawesome/pro-light-svg-icons";

import { Icon, PermissionCheck } from "@/components";

import { PermissionRoles } from "@/enum";

import { ButtonColor, ButtonSize } from "@/components/Button/types";
import { Button } from "@/components/Button/Button";

import { usePageTitle } from "@/utils/usePageTitle";

import { CompaniesTable } from "../../components/CompaniesTable";
import { CreateCompaniesModal } from "../../components/CreateCompaniesModal";

export const CompaniesOverview: FunctionComponent = () => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`companies.${key}`);
	const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);

	usePageTitle(ts("title"));

	return (
		<div className="sm:block flex flex-col items-start justify-between p-4">
			<div className="flex items-end justify-end w-full mb-8">
				<div className="flex justify-end">
					<PermissionCheck requiredPermissions={[PermissionRoles.COMPANY]}>
						<Button
							color={ButtonColor.ACTION}
							image={
								<div className="mr-2">
									<Icon icon={faPlus} />
								</div>
							}
							size={ButtonSize.S}
							testId="new-user-button"
							title={ts("create.button")}
							onClick={() => setIsInviteModalOpen(true)}
						/>
					</PermissionCheck>
				</div>
			</div>

			{<CompaniesTable />}

			{isInviteModalOpen && (
				<CreateCompaniesModal isOpen={isInviteModalOpen} setIsOpen={setIsInviteModalOpen} />
			)}
		</div>
	);
};
