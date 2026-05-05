import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

import { usePageTitle } from "@/utils/usePageTitle";

import { CompanyType } from "../schema/company";
import { UsersTable } from "../../Users/components/UsersTable";
import { InviteUserForm } from "../../Users/components/InviteUserForm";

type CompanyDetailsProps = {
	company?: CompanyType;
};

export const CompanyDetails: FunctionComponent<CompanyDetailsProps> = ({}) => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`company.${key}`);

	usePageTitle(ts("title"));

	return (
		<div className="sm:block flex flex-col items-start justify-between mb-6">
			<InviteUserForm />

			<div className="flex flex-row justify-between w-full border-t px-4 py-6 border-divider">
				<div className="flex-grow w-[25%]">
					<h3 className="mb-3">{ts("company-members")}</h3>
					<p className="text-gray-700 lg:max-w-[650px] text-xs pr-5">
						{ts("company-members-description")}
					</p>
				</div>
				<div className="flex-grow w-[75%]">{<UsersTable />}</div>
			</div>
		</div>
	);
};
