import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

import { authSelector } from "@/pages/Public/redux/auth.slice";
import { useAppSelector } from "@/redux/hooks";

export const DashboardOverview: FunctionComponent = () => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`dashboard.${key}`);
	const { user } = useAppSelector(authSelector);

	return (
		<div className="sm:block flex flex-col items-start justify-between mb-6">
			<div className="flex items-end justify-between w-full mb-8">
				<div className="flex-grow">
					<h3 className="mb-3">Cybersecurity Incident Basics</h3>
					<p className="text-gray-700 lg:max-w-[650px] text-xs pr-5">
						{user?.company?.name} {ts("workspace")}
					</p>
					<p className="text-gray-700 lg:max-w-[650px] text-xs pr-5">
						Hello {user?.firstName} {user?.lastName}
					</p>
				</div>
			</div>
		</div>
	);
};
