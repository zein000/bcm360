import { FunctionComponent } from "react";

import AppLogo from "@/assets/images/favicon.png";

export const Logo: FunctionComponent<{ handleClick?: () => void }> = ({ handleClick }) => {
	return (
		<div className="flex items-center justify-center h-[44px] w-[44px] rounded-[11px] shadow-medium border-[0.28px] border-[#E6E6EC]">
			<img
				alt="logo"
				className="w-[38px] h-[15px] cursor-pointer z-40 text-primary-blue"
				src={`${AppLogo}`}
				onClick={() => handleClick?.()}
			/>
		</div>
	);
};
