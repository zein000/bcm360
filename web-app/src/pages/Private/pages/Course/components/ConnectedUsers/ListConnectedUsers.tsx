import { useEffect, useRef, useState } from "react";

import { useSocket } from "../../context/SocketContext";
import UserIcon, { UserIconSize } from "../UserIcon";
import ConnectedUsersModal from "./ConnectedUsersModal";

export default function ListConnectedUsers() {
	const { connectedUsers, updateUserPermissions } = useSocket();
	const [isModalShown, setIsModalShown] = useState(false);
	const closeTimeout = useRef<NodeJS.Timeout | null>(null);

	const onMouseLeave = () => {
		closeTimeout.current = setTimeout(() => {
			setIsModalShown(false);
		}, 300);
	};

	const onModalShownEnter = () => {
		if (closeTimeout.current) {
			clearTimeout(closeTimeout.current);
		}

		setIsModalShown(true);
	};

	useEffect(() => {
		return () => {
			if (closeTimeout.current) {
				clearTimeout(closeTimeout.current);
			}
		};
	}, []);

	return (
		<div
			className="flex -space-x-[11px]"
			onMouseEnter={onModalShownEnter}
			onMouseLeave={onMouseLeave}
		>
			{connectedUsers
				?.filter((_, ind) => ind < 5)
				.map((user) => {
					return (
						<UserIcon
							key={user.id}
							firstName={user.firstName}
							isOnline={user.isActive}
							lastName={user.lastName}
							size={UserIconSize.Large}
						/>
					);
				})}
			{connectedUsers.length > 5 && (
				<UserIcon
					emptyLabel={connectedUsers?.length - 5 > 0 ? `+${connectedUsers?.length - 5}` : ""}
					isEmpty={true}
					size={UserIconSize.Large}
				/>
			)}
			<ConnectedUsersModal
				isHovered={isModalShown}
				setIsHovered={setIsModalShown}
				updateUserPermissions={updateUserPermissions}
				users={connectedUsers}
			/>
		</div>
	);
}
