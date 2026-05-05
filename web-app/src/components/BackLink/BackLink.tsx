import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import ArrowBackIcon from "@assets/icons/arrowBack.svg";
import ChevronDownIcon from "@assets/icons/chevron_down.svg";

interface BackLinkProps {
	link?: string;
	params?: URLSearchParams;
}

export const BackLink: FunctionComponent<BackLinkProps> = ({ link, params }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	return (
		<div
			className="inline-flex items-center mb-4 text-gray-700 cursor-pointer"
			onClick={() =>
				link ? navigate({ pathname: link, search: params?.toString() ?? "" }) : navigate(-1)
			}
		>
			<img alt="arrowback" className="sm:hidden w-[15px]" src={ArrowBackIcon} />
			<img
				alt="arrowback"
				className="sm:block hidden text-gray-500 rotate-90 w-[19px]"
				height={9}
				src={ChevronDownIcon}
				width={19}
			/>

			<p className="sm:opacity-60 sm:text-xs sm:font-semibold text-gray-700 ml-[14px] text-sm">
				{t("basics.back")}
			</p>
		</div>
	);
};
