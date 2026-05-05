import { faCheck, faLink, faPlus, faUsers } from "@fortawesome/pro-regular-svg-icons";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { InputAdornment, Stack, TextField } from "@mui/material";

import {
	useGenerateInviteLinkMutation,
	useInviteOnScenarioUserMutation,
} from "@/pages/Private/redux/course-progress/course-progress.api";

import { Icon, Modal } from "@/components";
import { ButtonColor } from "@/components/Button/types";
import { SvgIcon } from "@/components/Icon/SvgIcon";
import { PermissionRoles } from "@/enum";
import { ReactComponent as Mail } from "@assets/icons/mail.svg";

import SelectParticipantPermission, {
	PARTICIPANT_PERMISSION_NONE,
} from "./SelectParticipantPermission";

interface IAddTeamModalProps {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	courseProgressId: string;
}

export default function AddTeamModal({ isOpen, setIsOpen, courseProgressId }: IAddTeamModalProps) {
	const { t } = useTranslation();
	const ts = (key: string) => t(`courses.${key}`);

	const [invitees, setInvitees] = useState<
		{
			email: string;
			accessPermission?: PermissionRoles;
		}[]
	>([]);

	// Zustand für das visuelle Feedback beim Kopieren
	const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

	const [inviteOnScenario, { isLoading: isSendingInvite }] = useInviteOnScenarioUserMutation();
	// Neuer Mutation-Hook für das Generieren des Links
	const [generateInviteLink, { isLoading: isGeneratingLink }] = useGenerateInviteLinkMutation();

	useEffect(() => {
		if (isOpen) {
			setInvitees([{ email: "" }, { email: "" }, { email: "" }]);
		}
	}, [isOpen]);

	const handleAddInvitee = () => {
		setInvitees([...invitees, { email: "" }]);
	};

	const handleSendInvite = async () => {
		const filledInvitees = invitees.filter((invitee) => invitee.email.trim());

		const uniqueInvitees = Array.from(
			new Map(
				filledInvitees.map((invitee) => [
					invitee.email.trim(),
					{
						email: invitee.email,
						permissions:
							invitee?.accessPermission &&
							invitee?.accessPermission.toString() !== PARTICIPANT_PERMISSION_NONE
								? [invitee?.accessPermission]
								: [],
					},
				])
			).values()
		);

		if (uniqueInvitees.length === 0 || uniqueInvitees.some((invitee) => !invitee.email.trim())) {
			return;
		}

		const requestBody = {
			users: uniqueInvitees,
			courseProgressId: courseProgressId,
		};

		try {
			await inviteOnScenario(requestBody).unwrap();
			setInvitees([{ email: "" }]);
			setIsOpen(false);
		} catch (e) {
			console.error("Failed to send invitations:", e);
		}
	};

	const handleCopyLink = async (index: number) => {
		const invitee = invitees[index];

		if (!invitee || !invitee.email.trim() || isGeneratingLink || copiedIndex === index) {
			return;
		}

		try {
			const response = await generateInviteLink({
				email: invitee.email.trim(),
				courseProgressId: courseProgressId,
			}).unwrap();

			await navigator.clipboard.writeText(JSON.parse(response).link);

			setCopiedIndex(index);
			setTimeout(() => setCopiedIndex(null), 2500);
		} catch (e) {
			console.error("Failed to generate or copy link:", e);
		}
	};

	const onEmailChange = (index: number, email: string) => {
		const updatedInvitees = [...invitees];

		if (updatedInvitees[index]) {
			updatedInvitees[index] = { ...updatedInvitees[index], email };
		}

		setInvitees(updatedInvitees);
	};

	const onPermissionChange = (index: number, permissions: string) => {
		const updatedInvitees = [...invitees];

		if (updatedInvitees[index]) {
			updatedInvitees[index] = {
				...updatedInvitees[index],
				accessPermission: permissions as PermissionRoles,
			};
		}

		setInvitees(updatedInvitees);
	};

	const isLoading = isSendingInvite || isGeneratingLink;

	return (
		<Modal
			aboveHeader={
				<div
					className="flex justify-center items-center rounded-xl border border-blue-100 text-gray-700 cursor-pointer pointer-events-auto"
					style={{ width: "48px", height: "48px" }}
					onClick={() => console.log("Add user click")}
				>
					<Icon className="w-[24px] text-primary-gray h-[24px]" icon={faUsers} />
				</div>
			}
			dialogContentClassName="!p-0"
			handleClose={() => setIsOpen(false)}
			handleSave={handleSendInvite}
			isLoading={isLoading}
			isOpened={isOpen}
			size="xs"
			submitButtonColor={ButtonColor.ACTION}
			submitButtonText={ts("progress.add-team")}
			title={""}
		>
			<Stack className="mt-4">
				<div className="flex-grow w-full mb-4">
					<h3 className="mb-1 text-primary-blue text-[20px] font-semibold">
						{ts("progress.add-team")}
					</h3>
					<p className="text-gray-700 lg:max-w-[650px] text-[14px] pr-5">
						{ts("start.invite-colleagues-description")}
					</p>
				</div>
				<div className="flex-grow">
					<div className="flex flex-col gap-2">
						{invitees.map((invitee, index) => (
							<div key={index} className="flex gap-2 w-full">
								<TextField
									InputProps={{
										startAdornment: (
											<InputAdornment
												position="start"
												sx={{
													"&:not(.MuiInputAdornment-hiddenLabel)": {
														marginTop: "0px !important",
													},
												}}
											>
												<div className="mr-2 flex items-center">
													<SvgIcon className="w-[20px] h-[20px] text-gray-500" svgIcon={Mail} />
												</div>{" "}
											</InputAdornment>
										),
									}}
									className="w-full"
									inputProps={{
										style: {
											display: "flex",
											alignItems: "center",
											padding: "10px 0px",
										},
									}}
									placeholder="you@example.com"
									sx={{
										"& .MuiInputBase-root": {
											borderRadius: "12px",
											marginBottom: "0px !important",
										},
									}}
									value={invitee.email}
									onChange={(e) => onEmailChange(index, e.target.value)}
								/>
								<SelectParticipantPermission
									isNeedRemove={false}
									value={invitee?.accessPermission ?? PARTICIPANT_PERMISSION_NONE}
									onChange={(e) => onPermissionChange(index, e.target.value)}
								/>
								<div
									className={`flex justify-center items-center rounded-xl border w-[48px] h-[42px] transition-all
                                        ${
																					!invitee.email.trim()
																						? "bg-gray-100 text-gray-400 cursor-not-allowed"
																						: copiedIndex === index
																						? "bg-green-100 border-green-300 text-green-600 cursor-default"
																						: "border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-100"
																				}`}
									title={ts("progress.copy-link")}
									onClick={() => handleCopyLink(index)}
								>
									<Icon
										className="w-[20px] h-[20px]"
										icon={copiedIndex === index ? faCheck : faLink}
									/>
								</div>
							</div>
						))}
						<div className="flex flex-row justify-between">
							<div
								className="w-auto text-[14px] font-medium cursor-pointer"
								onClick={handleAddInvitee}
							>
								<Icon className="mr-2" icon={faPlus} /> {ts("progress.add-another")}
							</div>
						</div>
					</div>
				</div>
			</Stack>
		</Modal>
	);
}
