/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

import { updatePermissions } from "@/pages/Public/redux/auth.slice";
import { useAppDispatch } from "@/redux/hooks";

import { PermissionRoles } from "@/enum";

import { User } from "@/pages/Public/pages/Login/schema/login";

import { AuthState } from "@/types/auth";

import { IStageContentInfo } from "../../Courses/constants/emptyCourseScenario";
import { UserSchemaType } from "../../Users/schema/invite-user";
import { ScenarioActionTypes } from "../enums/ScenarioActionTypes.enum";
import { ScenarioMessageTypes } from "../enums/ScenarioMessageTypes.enum";
import { IConnectedUser } from "../interfaces/IConnectedUser.interface";
import { ScenarioMessageInfo } from "../interfaces/ScenarioMessageInfo.interface";
import { ScenarioProgress } from "../interfaces/ScenarioProgress.interface";

interface SocketContextType {
	socket: Socket | null;
	currentStage: number;
	isCurrentUserERR: boolean;
	errInfo?: UserSchemaType;
	currentUserData: User | null;
	connectedUsers: IConnectedUser[];
	chatMessages: ScenarioMessageInfo[];
	protocolMessages: ScenarioMessageInfo[];
	currentStageEndTimestamp: number;
	stageContent: IStageContentInfo[];
	sendChatMessage: (message: string) => void;
	sendProtocolMessage: (type: ScenarioMessageTypes, data: unknown) => void;
	updateProtocolMessage: (type: ScenarioMessageTypes, messageId: string, data: unknown) => void;
	sendScenarioAction: (type: ScenarioActionTypes, data: unknown) => void;
	getScenarioActualData: () => void;
	disconnectFromScenario: () => void;
	updateUserPermissions: (userId: string, updatedPermissions: PermissionRoles[]) => void;
}

export enum SocketEvents {
	ACTION = "action",
	ACTUAL_SCENARIO_DATA = "actual_scenario_data",
	SCENARIO_ACTION = "scenario_action",
	GET_ACTUAL_SCENARIO_DATA = "get_actual_scenario_data",
	PROTOCOL = "protocol",
	CHAT = "chat",
	SEND_CHAT = "send_chat",
	UPDATE_PROTOCOL = "update_protocol",
	SEND_PROTOCOL = "send_protocol",
	UPDATE_CONNECTED_USERS = "update_connected_users",
	JOIN_ROOM = "join_room",
	ERROR = "error",
	UPDATE_USER = "update_user",
	UPDATE_USER_INFO = "update_user_info",
	UPDATE_PERMISSIONS = "update_permissions",
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({
	courseId,
	children,
	errInfo,
	currentAuth,
	onActionHandler,
}: {
	courseId: string;
	children: React.ReactNode;
	errInfo?: UserSchemaType;
	currentAuth: AuthState;
	onActionHandler: (data: any) => void;
}) => {
	const token = currentAuth?.token;
	const user = currentAuth?.user;
	const dispatch = useAppDispatch();

	const [socket, setSocket] = useState<Socket | null>(null);
	const [currentStage, setCurrentStage] = useState<number>(0);
	const [currentStageEndTimestamp, setCurrentStageEndTimestamp] = useState<number>(0);
	const [connectedUsers, setConnectedUsers] = useState<IConnectedUser[]>([]);
	const [chatMessages, setChatMessages] = useState<ScenarioMessageInfo[]>([]);
	const [protocolMessages, setProtocolMessages] = useState<ScenarioMessageInfo[]>([]);
	const [stageContent, setStageContent] = useState<IStageContentInfo[]>([]);

	useEffect(() => {
		if (!token || !courseId) {
			return;
		}

		const newSocket = io(process.env.REACT_APP_API_URL, {
			query: { token },
		});

		newSocket.on("connect_error", (error) => {
			console.error("Socket connection error:", error);
		});

		newSocket.on("disconnect", (reason) => {
			console.error("Socket disconnected:", reason);
		});

		setSocket(newSocket);

		newSocket.emit(SocketEvents.JOIN_ROOM, courseId);

		newSocket.on(SocketEvents.CHAT, (data: any) => {
			setChatMessages((prevMessages) => {
				const messageExists = prevMessages.some((item) => item.id === data.id);

				if (messageExists) {
					return prevMessages.map((item) => (item.id === data.id ? data : item));
				} else {
					return [...prevMessages, data];
				}
			});
		});

		newSocket.on(SocketEvents.PROTOCOL, (data: any) => {
			setProtocolMessages((prevMessages) => {
				const messageExists = prevMessages.some((item) => item.id === data.id);

				if (messageExists) {
					return prevMessages.map((item) => (item.id === data.id ? data : item));
				} else {
					return [...prevMessages, data];
				}
			});
		});
		// Socket-Event-Handler mit Typen & Logs
		newSocket.on(SocketEvents.ACTUAL_SCENARIO_DATA, (data: ScenarioProgress) => {
			// Zeige den Roh-JSON-Kurs (falls vorhanden)
			console.log("📦 Raw data.course.json:", data?.course?.json);

			// Zeige den autoplay-Status jedes Stage-Elements
			console.log("🎬 Autoplay status of stageContent:");
			data?.stageContent?.forEach((item) => {
				console.log(`🧩 ID: ${item?.id} | Stage: ${item?.stageNumber} | Autoplay: ${item?.autoplay}`);
			});

			setProtocolMessages(data?.protocolHistory);
			setCurrentStage(data?.currentStage);
			setChatMessages(data?.chatHistory);

			const filteredSortedContent = data.stageContent
				?.filter((item) => !item?.isRemoved)
				?.sort((a, b) => {
					const stageA = a?.stageNumber ?? Infinity;
					const stageB = b?.stageNumber ?? Infinity;
					if (stageA !== stageB) return stageB - stageA;

					const timeA = new Date(a?.timeStamp ?? 0).getTime();
					const timeB = new Date(b?.timeStamp ?? 0).getTime();
					return timeB - timeA;
				});

			setStageContent(filteredSortedContent);
			setCurrentStageEndTimestamp(data?.currentStageEndTimestamp ?? 0);
		});


		newSocket.on(SocketEvents.UPDATE_CONNECTED_USERS, (data: IConnectedUser[]) => {
			setConnectedUsers(data ? data.filter((user) => !user?.isRemoved) : []);
		});

		newSocket.on(SocketEvents.UPDATE_PERMISSIONS, (data: any) => {
			dispatch(updatePermissions(data));
		});

		newSocket.on(SocketEvents.ACTION, (data: any) => {
			onActionHandler(data);
		});

		newSocket.on(SocketEvents.UPDATE_USER_INFO, (data: any) => {
			setConnectedUsers((prev) =>
				prev.map((user) => {
					if (user.id === data.id) {
						return { ...user, ...data };
					}

					return user;
				})
			);
		});

		return () => {
			newSocket.disconnect();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token, courseId]);

	const sendChatMessage = useCallback(
		(message: string) => {
			if (socket) {
				socket.emit(SocketEvents.SEND_CHAT, { message, courseId });
			}
		},
		[socket, courseId]
	);

	const sendProtocolMessage = useCallback(
		(type: ScenarioMessageTypes, data: unknown) => {
			if (socket) {
				socket.emit(SocketEvents.SEND_PROTOCOL, { type, data, courseId });
			}
		},
		[socket, courseId]
	);

	const updateProtocolMessage = useCallback(
		(type: ScenarioMessageTypes, messageId: string, data: unknown) => {
			if (socket) {
				socket.emit(SocketEvents.UPDATE_PROTOCOL, { type, data, messageId, courseId });
			}
		},
		[socket, courseId]
	);

	const getScenarioActualData = useCallback(() => {
		if (socket) {
			socket.emit(SocketEvents.GET_ACTUAL_SCENARIO_DATA, { courseId });
		}
	}, [socket, courseId]);

	const sendScenarioAction = useCallback(
		(type: ScenarioActionTypes, data: unknown) => {
			if (socket) {
				socket.emit(SocketEvents.SCENARIO_ACTION, { type, data, courseId });
			}
		},
		[socket, courseId]
	);

	const updateUserPermissions = useCallback(
		(userId: string, updatedPermissions: PermissionRoles[]) => {
			if (socket) {
				socket.emit(SocketEvents.UPDATE_USER, { userId, updatedPermissions, courseId });
			}
		},
		[socket, courseId]
	);

	const disconnectFromScenario = useCallback(() => {
		if (socket) {
			socket.disconnect();
		}
	}, [socket]);

	return (
		<SocketContext.Provider
			value={{
				socket,
				currentStage,
				currentUserData: user,
				connectedUsers,
				chatMessages,
				protocolMessages,
				currentStageEndTimestamp,
				stageContent,
				sendChatMessage,
				sendProtocolMessage,
				updateProtocolMessage,
				sendScenarioAction,
				getScenarioActualData,
				disconnectFromScenario,
				updateUserPermissions,
				isCurrentUserERR: errInfo?.id === user?.id || errInfo?.email === user?.email,
				errInfo,
			}}
		>
			{children}
		</SocketContext.Provider>
	);
};

// Hook to use socket context
export const useSocket = () => {
	const context = useContext(SocketContext);

	if (!context) {
		throw new Error("useSocket must be used within a SocketProvider");
	}

	return context;
};
