import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";

import { faPlus } from "@fortawesome/pro-regular-svg-icons";

import { Icon, PermissionCheck } from "@/components";

import { PermissionRoles } from "@/enum";

import { usePageTitle } from "@/utils/usePageTitle";

import { Button } from "@/components/Button/Button";
import { ButtonColor, ButtonSize } from "@/components/Button/types";

import CoursesList from "../../components/CourseList";

export const CoursesOverview: FunctionComponent = () => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`courses.${key}`);
	const navigate = useNavigate();

	usePageTitle(ts("title"));

	return (
		<div className="sm:block flex flex-1 flex-col items-start p-6">
			<div className="w-full flex items-center justify-between mb-6">
				<h3 className="text-primary-gray text-[14px] font-normal">{ts("subtitle")}</h3>
				<PermissionCheck requiredPermissions={[PermissionRoles.GLOBAL_ADMIN]}>
					<Button
						className="!h-[44px] !font-medium !text-[14px] !w-fit"
						color={ButtonColor.ACTION}
						image={<Icon className="w-5 h-5 mr-2" icon={faPlus} />}
						size={ButtonSize.ML}
						title={ts("create.title")}
						onClick={() => navigate(`/app/courses/create`)}
					></Button>
				</PermissionCheck>
			</div>
			<PermissionCheck requiredPermissions={[PermissionRoles.USER]}>
				<CoursesList />
			</PermissionCheck>
		</div>
	);
};
