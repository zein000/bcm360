import { faCheck, faCircleExclamation } from "@fortawesome/pro-regular-svg-icons";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";

import { Icon, PermissionCheck } from "@/components";
import { CourseProgressEnum } from "@/enum/course-progress.enum";

import { Button } from "@/components/Button/Button";
import { ButtonSize } from "@/components/Button/types";
import { PermissionRoles } from "@/enum";

import { ROUTE_CONFIG } from "@/routes/config";

import { IEndSessionData } from "../interfaces/IEndSessionData.interface";

const { ANALYTICS, COURSES } = ROUTE_CONFIG;

interface IEndSessionProps {
	data: IEndSessionData;
}

export default function EndSession({ data }: IEndSessionProps) {
	const { t, i18n } = useTranslation();
	const ts = (key: string, options = {}) =>
		i18n.exists(`courses.end.${key}`) ? t(`courses.end.${key}`, options) : key;
	const { scenarioName, status, additionalStatusInfo } = data;
	const navigate = useNavigate();

	const iconAccordingToStatus = useMemo(() => {
		switch (status) {
			case CourseProgressEnum.Success:
				return (
					<Icon className="w-3 h-3 rounded-full bg-primary-blue text-white p-1" icon={faCheck} />
				);
			case CourseProgressEnum.Failed:
				return <Icon className="w-4 h-4 rounded-full text-red-500" icon={faCircleExclamation} />;
			default:
				return <Icon className="w-4 h-4 rounded-full text-red-500" icon={faCircleExclamation} />;
		}
	}, [status]);

	const statusMessage = useMemo(() => {
		switch (status) {
			case CourseProgressEnum.Success:
				return ts("congratulations");
			case CourseProgressEnum.Failed:
				return ts("unfortunately");
			default:
				return ts("unfortunately");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [status]);

	return (
		<div className="w-full h-full flex items-center justify-center relative">
			<div className="absolute w-[400px] h-[500px] -mt-[150px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-white to-[#4680FC] rounded-full blur-3xl opacity-30" />
			<div
				className={`p-1 relative -mt-36 bg-[#F7F8FB] z-20 font-urbanist rounded-[20px] w-[600px] border border-[#E6E6EC] flex flex-col gap-4`}
			>
				<div className="bg-white p-6 shadow-sm rounded-16">
					<div className="mb-4 w-[44px] bg-white z-30 relative shadow-medium h-[44px] flex items-center justify-center rounded-xl border-[0.28px] border-[#E6E6EC]">
						{iconAccordingToStatus}
					</div>
					<h2 className="mb-[6px] text-primary-gray text-[28px] leading-[34px] font-bold">
						{statusMessage}
					</h2>
					<p className="text-primary-gray-lighter text-[14px] leading-[20px]">
						{ts(status, { scenarioName: scenarioName ?? "" })}
					</p>
					{additionalStatusInfo && (
						<p className="text-primary-gray-lighter text-[14px] leading-[20px]">
							{ts(additionalStatusInfo)}
						</p>
					)}
				</div>
				<PermissionCheck requiredPermissions={[PermissionRoles.GLOBAL_ADMIN]}>
					<div className="px-3 mb-4">
						<Button
							className="!h-[44px]"
							size={ButtonSize.ML}
							title={ts("view-all-finished-scenarios")}
							type="submit"
							onClick={() => navigate(ANALYTICS)}
						/>
					</div>
				</PermissionCheck>
				<PermissionCheck
					deniedPermissions={[PermissionRoles.GLOBAL_ADMIN]}
					requiredPermissions={[PermissionRoles.USER]}
				>
					<div className="px-3 mb-4">
						<Button
							className="!h-[44px]"
							size={ButtonSize.ML}
							title={ts("go-to-scenarios-dashboard")}
							type="submit"
							onClick={() => navigate(COURSES)}
						/>
					</div>
				</PermissionCheck>
			</div>
		</div>
	);
}
