import { Role, UserStatus } from "@/enum";

import { UserLanguage } from "@/enum/user.enum";

import { LoginResponse, User } from "../pages/Login/schema/login";

export const userMock: User = {
	id: 1,
	email: "mock@browserbite.io",
	firstName: "John",
	lastName: "Doe",
	is2FAEnabled: false,
	isBlocked: false,
	company: null,
	status: UserStatus.ACTIVE,
	userLanguage: UserLanguage.EN,
	autoAccept: false,
	role: {
		id: 1,
		code: Role.GLOBAL_ADMIN,
		name: "Global Admin",
		description: "Global Admin role, god",
		permissions: [
			{
				id: 7,
				code: "CHANGE_PASSWORD",
				name: "Change password",
				description: "Change password",
			},
		],
	},
	// prospects: [],
};

export const loginResponseMock: LoginResponse = {
	accessToken: "abcd1234",
	user: userMock,
};
