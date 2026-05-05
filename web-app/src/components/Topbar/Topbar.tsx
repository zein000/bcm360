import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { PermissionRoles } from "@/enum";
import { authSelector, setAuth } from "@/pages/Public/redux/auth.slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useHasPermissions } from "@/utils/useHasPermissions";

import { User } from "@/pages/Public/pages/Login/schema/login";
import { ROUTE_CONFIG } from "@/routes/config";
import { ReactComponent as ArrowRightStartOnRectangle } from "@assets/icons/topbar/arrow-right-start-on-rectangle.svg";
import { ReactComponent as ArrowDown } from "@assets/icons/alt-arrow-down.svg";

import { ReactComponent as UserIcon } from "@assets/icons/topbar/user.svg";

import { ContextMenu } from "../ContextMenu/ContextMenu";
import { SvgIcon } from "../Icon/SvgIcon";

const { ACCOUNT } = ROUTE_CONFIG;
export default function TopBar() {
	const { t } = useTranslation();
	const { user } = useAppSelector(authSelector);

	const ts = (key: string) => t(`sidebar.${key}`);
	const dispatch = useAppDispatch();
	const initialUserAsString = localStorage.getItem("initialUser");
	const { hasPermissions } = useHasPermissions();
	const navigate = useNavigate();

	let initialUser: { user: User } | null = null;
	const resetInitialUser = () => {
		dispatch(setAuth(initialUser));
		localStorage.removeItem("initialUser");
	};

	const handleNavigateAccount = () => {
		if (hasPermissions([PermissionRoles.USER])) {
			navigate(ACCOUNT);
		}
	};

	if (initialUserAsString) {
		initialUser = JSON.parse(initialUserAsString) as { user: User };
	}

	return (
		<div className="w-full p-6 border-b border-[#E6E6EC] flex items-center justify-between">
			<h1 className="text-primary-gray text-[28px] font-bold" id="page-title"></h1>
			<ContextMenu
				containerStyles=""
				data={[
					[
						{
							title: ts("my-profile"),
							icon: <SvgIcon className="w-5 h-5 text-primary-blue" svgIcon={UserIcon} />,
							onClick: () => {
								handleNavigateAccount();
							},
							permissions: [PermissionRoles.UPDATE_ME],
						},
						{
							title: initialUser ? ts("back") : ts("logout"),
							icon: (
								<SvgIcon
									className="w-5 h-5 text-primary-blue"
									svgIcon={ArrowRightStartOnRectangle}
								/>
							),
							onClick: () => (initialUser ? resetInitialUser() : navigate("/logout")),
						},
					],
				]}
				position="bottom"
				width="150"
			>
				<div className="flex flex-row items-center w-fit ali cursor-pointer gap-2">
					<span className="w-[48px] h-[48px] text-[18px] text-center uppercase text-white rounded-xl bg-primary-blue leading-[44px] flex items-center justify-center">
						{user?.firstName?.[0]}
						{user?.lastName?.[0]}
					</span>
					<div className="flex flex-col items-start justify-center">
						<span className="capitalize leading-[20px] text-[14px] font-semibold text-primary-gray">
							{user?.firstName} {user?.lastName}
						</span>
						<span className="text-[12px] leading-[16px] text-primary-gray">{user?.email}</span>
					</div>
					<SvgIcon className="w-5 h-5" svgIcon={ArrowDown} />
				</div>
			</ContextMenu>
		</div>
	);
}
