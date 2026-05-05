import { FunctionComponent } from "react";

import { classNames } from "@/utils/classNames";

interface ChipProps {
	label: string;
	active?: boolean;
}

export const TabChip: FunctionComponent<ChipProps> = ({ label, active }) => {
	return (
		<div
			className={classNames(
				"ml-2.5 opacity-[0.8] leading-[20px] font-medium text-xs px-2 py-1 rounded-[10px]",
				active ? "bg-brand-light text-white" : "bg-gray-200 text-gray-700"
			)}
		>
			{label}
		</div>
	);
};
