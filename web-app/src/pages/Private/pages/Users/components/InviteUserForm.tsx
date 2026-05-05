import { FunctionComponent, useCallback, useEffect, useState } from "react";

import { faPlus } from "@fortawesome/pro-regular-svg-icons";

import { useParams } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { ButtonColor, ButtonSize } from "@/components/Button/types";
import { useGetRolesQuery, useInviteUserMutation } from "@/pages/Private/redux/admin/admin.api";
import { Button } from "@/components/Button/Button";
import { Icon } from "@/components";
import { SvgIcon } from "@/components/Icon/SvgIcon";
import { ReactComponent as Mail } from "@assets/icons/mail.svg";

import { PermissionRoles, Role } from "@/enum";

import { useAppSelector } from "@/redux/hooks";

import { ERROR_TYPE, hasPermission, translateError } from "@/utils";

import { InviteUserItem } from "./InviteUserItem";
import { UserRole } from "../../UserRoles/schema/roles";

type Invitee = { email: string; roleId: number };

export const InviteUserForm: FunctionComponent = () => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`company.${key}`);
	const { id } = useParams();
	const { data: roles } = useGetRolesQuery();

	const [invitees, setInvitees] = useState<Invitee[]>([]);
	const [defaultRole, setDefaultRole] = useState<UserRole>();
	const currentUserAuth = useAppSelector((state) => state.auth.user);
	const [errorMessage, setFormError] = useState<string>();

	const [invite, { error }] = useInviteUserMutation();

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const err: any = error;

		if (err?.data?.message) {
			setFormError(
				translateError[err?.data?.message?.toUpperCase() as unknown as ERROR_TYPE] ??
					t("basics.request-error")
			);
		} else if (typeof err === "string") {
			setFormError(err);
		}
	}, [error, t]);

	const fillInviteForm = useCallback(() => {
		if (roles?.data) {
			const role = roles.data.find((role) => role.code === Role.USER) || roles.data[0];

			if (!defaultRole) {
				setDefaultRole(role);
			}

			setInvitees([
				{ email: "", roleId: role?.id },
				{ email: "", roleId: role?.id },
				{ email: "", roleId: role?.id },
			]);
		}
	}, [roles?.data, defaultRole]);

	useEffect(() => {
		fillInviteForm();
	}, [fillInviteForm]);

	const handleAddInvitee = () => {
		if (roles?.data) {
			const role = roles.data.find((role) => role.code === Role.USER) || roles.data[0];

			setInvitees([...invitees, { email: "", roleId: role.id }]);
		}
	};

	const handleInputChange = (index: number, field: keyof Invitee, value: string | number) => {
		const updatedInvitees = [...invitees];

		if (field === "roleId") {
			const selectedRole = roles?.data?.find((role) => role.name === value);

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(updatedInvitees[index] as any).roleId = selectedRole?.id || 0;
		} else {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(updatedInvitees[index] as any)[field] = value;
		}

		setInvitees(updatedInvitees);
	};

	const handleSendInvite = async () => {
		const filledInvitees = invitees.filter((invitee) => invitee.email.trim() && invitee.roleId);

		if (filledInvitees.length === 0) {
			return;
		}

		const requestBody = {
			users: filledInvitees,
			companyId: id ? +id : undefined,
		};

		try {
			await invite(requestBody).unwrap();
			fillInviteForm();
			if (errorMessage) {
				setFormError("");
			}
		} catch (e) {
			console.error("Failed to send invitations:", e);
		}
	};

	return (
		<div className="flex flex-row justify-between w-full border-t px-4 py-6 border-divider">
			<div className="flex-grow w-[25%]">
				<h3 className="mb-3">{ts("invite-company-members")}</h3>
				<p className="text-gray-700 lg:max-w-[650px] text-xs pr-5">
					{ts("invite-company-members-description")}
				</p>
			</div>
			<div className="flex-grow w-[75%]">
				<div className="flex flex-col relative">
					{invitees.map((invitee, index) => (
						<InviteUserItem
							key={index}
							email={invitee.email}
							role={
								roles?.data?.find((r) => invitee.roleId === r.id)?.name ??
								defaultRole?.name ??
								Role.USER
							}
							roles={
								roles?.data?.filter((role) =>
									currentUserAuth
										? hasPermission(currentUserAuth, [role.code as PermissionRoles])
										: false
								) || []
							}
							onEmailChange={(e) => handleInputChange(index, "email", e.target.value)}
							onRoleChange={(e) => handleInputChange(index, "roleId", e.target.value)}
						/>
					))}
					<div className="flex flex-row justify-between">
						<div
							className="w-auto text-[14px] font-[600] cursor-pointer"
							onClick={handleAddInvitee}
						>
							<Icon icon={faPlus} /> {ts("add-another")}
						</div>
						<div className="w-[140px] ">
							<Button
								className="w-auto"
								color={ButtonColor.ACTION}
								image={
									<div className="mr-2">
										<SvgIcon className="w-[20px] h-[20px] text-white" svgIcon={Mail} />
									</div>
								}
								size={ButtonSize.S}
								testId="new-user-button"
								title={ts("send-invite")}
								onClick={handleSendInvite}
							/>
						</div>
					</div>
					{errorMessage && (
						<p className="absolute bottom-6 text-[12px] text-[#FF1034]">{errorMessage}</p>
					)}
				</div>
			</div>
		</div>
	);
};
