import { JwtPayload } from "./interfaces/jwt-payload.interface";

export const extractJwtPayload = (jwt: string) => {
	const base64Payload = jwt.split(".")[1];
	const payloadBuffer = Buffer.from(base64Payload, "base64");

	return JSON.parse(payloadBuffer.toString()) as JwtPayload;
};
