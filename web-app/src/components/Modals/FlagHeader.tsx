import { FunctionComponent, SVGProps } from "react";

import { SvgIcon } from "@/components/Icon/SvgIcon";
import { ReactComponent as Flag } from "@assets/icons/modals/flag.svg";

export interface FlagComponentProps {
	onClick: () => void;
	icon?: FunctionComponent<SVGProps<SVGSVGElement>>;
}

export const FlagHeader: FunctionComponent<FlagComponentProps> = ({ onClick, icon = Flag }) => {
	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none">
			<div className="absolute top-2 left-2">
				<div className="relative flex justify-center items-center">
					<div
						className="absolute rounded-full border border-blue-100"
						style={{ width: "224px", height: "224px", opacity: "0.4" }}
					></div>
					<div
						className="absolute rounded-full border border-blue-100"
						style={{ width: "184px", height: "184px", opacity: "0.6" }}
					></div>
					<div
						className="absolute rounded-full border border-blue-100"
						style={{ width: "144px", height: "144px", opacity: "0.8" }}
					></div>
					<div
						className="relative flex justify-center items-center rounded-full border border-blue-100 text-gray-700 cursor-pointer pointer-events-auto"
						style={{ width: "104px", height: "104px" }}
						onClick={onClick}
					>
						<SvgIcon className="w-[48px] h-[48px] text-brand-light" svgIcon={icon} />
					</div>
				</div>
			</div>
		</div>
	);
};
