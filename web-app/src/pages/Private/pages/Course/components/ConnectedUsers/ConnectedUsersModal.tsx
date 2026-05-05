import { useTranslation } from "react-i18next";

import { useEffect, useRef, useState } from "react";

import { faUserMinus } from "@fortawesome/pro-solid-svg-icons";

import { PermissionRoles } from "@/enum";

import { Icon, Modal, PermissionCheck } from "@/components";

import CourseTag from "../../../Courses/components/CourseList/CourseTag";
import { useSocket } from "../../context/SocketContext";
import { ScenarioActionTypes } from "../../enums/ScenarioActionTypes.enum";
import { IConnectedUser } from "../../interfaces/IConnectedUser.interface";
import SelectParticipantPermission, {
	PARTICIPANT_PERMISSION_NONE,
	PARTICIPANT_PERMISSIONS,
	PARTICIPANT_REMOVE,
} from "../SelectParticipantPermission";
import UserIcon, { UserIconSize } from "../UserIcon";

interface IConnectedUsersModalProps {
	users: IConnectedUser[];
	isHovered: boolean;
	setIsHovered: (isHovered: boolean) => void;
	updateUserPermissions: (userId: string, updatedPermissions: PermissionRoles[]) => void;
}

export default function ConnectedUsersModal({
	users,
	isHovered,
	setIsHovered,
	updateUserPermissions,
}: IConnectedUsersModalProps) {
	const { t } = useTranslation();
	const ts = (key: string, opt = {}) => t(`courses.progress.${key}`, opt);
	const { currentUserData: currentUser, errInfo, sendScenarioAction } = useSocket();
	const closeTimeout = useRef<NodeJS.Timeout | null>(null);
	const [removedUser, setRemovedUser] = useState<IConnectedUser | null>(null);

	const onPermissionUpdateHandler = (user: IConnectedUser, newPermission: string) => {
		if (newPermission === PARTICIPANT_REMOVE) {
			setRemovedUser(user);
		} else {
			const emptyPermissions =
				user?.permissions?.filter((p) => !PARTICIPANT_PERMISSIONS.includes(p)) ?? [];
			const updatedPermissions =
				newPermission === PARTICIPANT_PERMISSION_NONE
					? emptyPermissions
					: [...emptyPermissions, newPermission as PermissionRoles];

			updateUserPermissions(user.id, updatedPermissions);
		}
	};

	const onRemoveUserSubmitHandler = () => {
		if (removedUser && removedUser?.id) {
			sendScenarioAction(ScenarioActionTypes.REMOVE_USER, { user: removedUser });
			setRemovedUser(null);
		}
	};

	const onMouseLeave = () => {
		closeTimeout.current = setTimeout(() => {
			setIsHovered(false);
		}, 300);
	};

	const onModalShownEnter = () => {
		if (closeTimeout.current) {
			clearTimeout(closeTimeout.current);
		}

		setIsHovered(true);
	};

	useEffect(() => {
		return () => {
			if (closeTimeout.current) {
				clearTimeout(closeTimeout.current);
			}
		};
	}, []);

	return (
		<>
			<div className="relative" onMouseEnter={onModalShownEnter} onMouseLeave={onMouseLeave}>
				{isHovered && (
					<div className="absolute mt-2 -right-2 top-full w-[450px] py-6 border border-[#E6E6EC] bg-white shadow-[0px_1px_4px_0px_rgba(0,0,0,0.2)] rounded-lg z-10">
						<h3 className="text-[20px] text-primary-gray font-semibold mb-4 px-6">{ts("team")}</h3>
						<div className="max-h-96 overflow-auto px-6 custom-scrollbar space-y-4">
							{users
								?.sort((a, b) => Number(b?.isAccepted) - Number(a?.isAccepted))
								?.map((user) => {
									return (
										<div
											key={user.id}
											className="flex items-center justify-between gap-4 min-h-[44px] w-full"
										>
											<div className="flex items-center justify-start gap-1 max-w-[65%]">
												<UserIcon
													containerClassName="!min-w-[44px] !h-[44px]"
													firstName={user.firstName}
													isOnline={user.isActive}
													lastName={user.lastName}
													size={UserIconSize.Large}
												/>
												{user?.isAccepted ? (
													<div className="-space-y-2 max-w-[calc(100%-44px)] overflow-hidden">
														<p className="text-[14px] text-primary-gray font-semibold overflow-hidden text-nowrap text-ellipsis">
															{user.firstName} {user.lastName}
														</p>
														<CourseTag
															tag={
																errInfo?.email === user?.email
																	? ts("responsible-person")
																	: ts("participant")
															}
														/>
													</div>
												) : (
													<div className="-space-y-2 max-w-[calc(100%-44px)] overflow-hidden">
														<p className="text-[14px] text-primary-gray w-full text-nowrap overflow-hidden text-ellipsis">
															{user.email}
														</p>
														<CourseTag tag={t("invited")} />
													</div>
												)}
											</div>
											{currentUser?.email !== user?.email && (
												<PermissionCheck requiredPermissions={[PermissionRoles.USER]}>
													<SelectParticipantPermission
														className="w-[150px] h-[44px]"
														inputPadding="8px"
														value={
															user.permissions?.find((p) => PARTICIPANT_PERMISSIONS.includes(p)) ??
															PARTICIPANT_PERMISSION_NONE
														}
														onChange={(e) => onPermissionUpdateHandler(user, e.target.value)}
													/>
												</PermissionCheck>
											)}
										</div>
									);
								})}
						</div>
					</div>
				)}
			</div>
			{!!removedUser && (
				<Modal
					aboveHeader={
						<div
							className="flex justify-center items-center rounded-xl border border-[#E6E6EC] text-gray-700 cursor-default pointer-events-auto"
							style={{ width: "48px", height: "48px" }}
						>
							<Icon className="w-[24px] text-primary-gray h-[24px]" icon={faUserMinus} />
						</div>
					}
					dialogContentClassName="!p-0"
					handleClose={() => setRemovedUser(null)}
					handleSave={onRemoveUserSubmitHandler}
					isOpened={!!removedUser}
					submitButtonColor="error"
					submitButtonText={t("basics.delete")}
					title={""}
				>
					<div className="flex-grow w-full my-3">
						<h3 className="mb-1 text-primary-gray text-[20px] font-semibold">
							{ts("removing-user-from-scenario")}
						</h3>
						<p className="text-[14px] text-primary-gray-lighter">
							{ts("remove-user-description", {
								data: removedUser?.isAccepted
									? `${removedUser?.firstName} ${removedUser?.lastName}`
									: removedUser.email,
							})}
						</p>
					</div>
				</Modal>
			)}
		</>
	);
}
