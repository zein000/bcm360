import { User } from "@/pages/Public/pages/Login/schema/login";

export interface AuthState {
	otpToken: string | null;
	token: string | null;
	user: User | null;
}
