import { rest } from "msw";

import { loginResponseMock, userMock } from "./auth.mocks";

export const authHandlers = [
	rest.post("api/login", (_, res, ctx) => {
		return res(ctx.json(loginResponseMock), ctx.status(200));
	}),
	rest.get("api/me", (_, res, ctx) => {
		return res(ctx.json(userMock), ctx.status(200));
	}),
	rest.post("api/reset-password", (_, res, ctx) => {
		return res(ctx.status(200));
	}),
	rest.post("api/set-password", (_, res, ctx) => {
		return res(ctx.status(200));
	}),
];
