import { faChevronLeft } from "@fortawesome/pro-regular-svg-icons";

import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { Icon } from "@/components";
import { Button } from "@/components/Button/Button";
import { ButtonColor, ButtonSize } from "@/components/Button/types";
import { PermissionRoles } from "@/enum";
import { useAppSelector } from "@/redux/hooks";
import { authSelector } from "@/pages/Public/redux/auth.slice";
import { getAllUserPermissions } from "@/utils";

interface BreadcrumbsItem {
	title: string;
	url: string;
}

interface BreadcrumbsProps {
	items: BreadcrumbsItem[];
	requiredPermissions?: PermissionRoles[];
}

export default function Breadcrumbs({ items, requiredPermissions }: BreadcrumbsProps) {
	const navigate = useNavigate();
	const location = useLocation();
	const { user } = useAppSelector(authSelector);

	const userPermissions = getAllUserPermissions(user?.role);
	const hasPermission = requiredPermissions?.length
		? requiredPermissions.every((permission) => userPermissions.includes(permission))
		: true;

	return (
		<div className="border-b border-[#E6E6EC] py-4 px-6 flex">
			{hasPermission && (
				<Button
					className="!w-[24px] !rounded-md mr-3"
					color={ButtonColor.ACTION_SECONDARY}
					image={<Icon icon={faChevronLeft} />}
					size={ButtonSize.XXS}
					title=""
					onClick={() => navigate(-1)}
				></Button>
			)}
			{items.map((item, index) => (
				<NavLink
					key={index}
					className={`text-primary-gray text-[14px] font-medium ${
						location.pathname === item.url ? "hover:cursor-default" : ""
					}`}
					to={item.url}
					onClick={(e) => {
						if (location.pathname === item.url || !hasPermission) {
							e.preventDefault();
						}
					}}
				>
					{item.title} {index < items.length - 1 && <span className="px-3">/</span>}
				</NavLink>
			))}
		</div>
	);
}
