import { useTranslation } from "react-i18next";

import { faArrowLeft, faEnvelope } from "@fortawesome/pro-regular-svg-icons";

import { Link } from "@mui/material";

import { useNavigate } from "react-router-dom";

import { Icon } from "@/components";
import { Button } from "@/components/Button/Button";
import { ButtonSize } from "@/components/Button/types";
import { ROUTE_CONFIG } from "@/routes/config";

export default function CheckYourEmail() {
	const { t } = useTranslation();
	const ts = (key: string) => t(`login.check-email.${key}`);
	const navigate = useNavigate();

	return (
		<div className="w-full h-full flex flex-col relative items-center justify-center">
			<div className="flex flex-col items-center gap-8 max-w-[360px] px-2">
				<div className="flex flex-col items-center justify-center gap-3">
					<div className="w-14 h-14 mb-3 rounded-xl border-[1px] border-[#EAECF0] flex items-center justify-center">
						<Icon className="w-7 h-7 text-primary-gray" icon={faEnvelope} />
					</div>
					<h2 className="text-primary-gray text-[30px] leading-[38px] font-semibold text-center">
						{ts("title")}
					</h2>
					<p className="text-primary-gray-lighter text-[16px] leading-[24px] text-center">
						{ts("description")}
						<span className="font-medium text-wrap">olivia@untitledui.com</span>
					</p>
				</div>
				<Button
					className="h-[44px]"
					isLoading={false}
					size={ButtonSize.ML}
					title={ts("enter-code")}
				/>
				<Link
					component="a"
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: "8px",
						fontSize: "14px",
						fontWeight: "600",
						color: "#475467",
						textDecoration: "none",
						"&:hover": {
							textDecoration: "none",
							color: "#47546770",
							cursor: "pointer",
						},
					}}
					onClick={() => navigate(ROUTE_CONFIG.LOGIN)}
				>
					<Icon icon={faArrowLeft} sx={{ width: "12px", height: "12px" }} />
					{ts("back-to-login")}
				</Link>
			</div>
		</div>
	);
}
