import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
	return (
		<div className="w-[100vw] h-[100vh] relative font-urbanist" id="portal-auth">
			<Outlet />
		</div>
	);
};
