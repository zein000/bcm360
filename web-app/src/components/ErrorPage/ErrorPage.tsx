import { Box } from "@mui/material";
import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { faLessThan } from "@fortawesome/pro-regular-svg-icons";

import { ErrorPageType } from "@/enum";

import { ReactComponent as LogoTitle } from "@assets/images/logoTitle.svg";

import UnauthorizeImg from "../../assets/images/error-pages/error-401.svg";
import NotFoundImg from "../../assets/images/error-pages/error-404.svg";
import ServerErrorImg from "../../assets/images/error-pages/error-500.svg";
import { Button } from "../Button/Button";
import { Icon } from "../Icon/Icon";
import { SvgIcon } from "../Icon/SvgIcon";
import { Logo } from "../Logo/Logo";

interface ErrorPageProps {
	type: ErrorPageType;
}

export const ErrorPage: FunctionComponent<ErrorPageProps> = ({ type }) => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`errorPages.${key}`);
	const navigate = useNavigate();

	let title = "";
	let imageSrc = "";

	switch (type) {
		case ErrorPageType.NotFound:
			title = ts("notFound");
			imageSrc = NotFoundImg;
			break;
		case ErrorPageType.Unauthorize:
			title = ts("unauthorize");
			imageSrc = UnauthorizeImg;
			break;
		case ErrorPageType.ServerError:
			title = ts("serverError");
			imageSrc = ServerErrorImg;
			break;
		case ErrorPageType.Forbidden:
			title = ts("forbidden");
			imageSrc = ServerErrorImg;
			break;
	}

	return (
		<div className="w-[100vw] h-[100vh] relative font-urbanist" id="portal-auth">
			<div className="absolute top-0 w-full h-[92px] border-b border-[#E6E6EC] py-6 px-8">
				<div className="flex items-center gap-3">
					<Logo />
					<SvgIcon className="w-[90px] h-[18px] text-brand-light" svgIcon={LogoTitle} />
				</div>
			</div>
			<div className="w-full h-full flex items-center justify-center">
				<div className="w-[600px] flex flex-col gap-4 items-center justify-center">
					<Box alt="Error image" component="img" mb={3} src={imageSrc} />

					<h5 className="text-[28px] font-bold text-primary-blue">{title}</h5>
					<p className="text-[14px] text-primary-gray-lighter text-center">{ts("description")}</p>
					<Button
						className="!w-fit px-8"
						image={<Icon className="mr-2" icon={faLessThan} size="xs" />}
						title={ts("buttonText")}
						onClick={() => navigate("/")}
					></Button>
				</div>
			</div>
		</div>
	);
};
