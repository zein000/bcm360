import { rest } from "msw";

import { rolesMock } from "./admin.mocks";

export const adminHandlers = [
	rest.get("api/roles", (_, res, ctx) => {
		return res(ctx.json(rolesMock), ctx.status(200));
	}),
];
