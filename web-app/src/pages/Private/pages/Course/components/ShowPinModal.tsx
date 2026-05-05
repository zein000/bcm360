import { faKey } from "@fortawesome/pro-regular-svg-icons";
import { useTranslation } from "react-i18next";

import { Icon, Modal } from "@/components";

interface ShowPinModalProps {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	pin: string;
}

export default function ShowPinModal({ isOpen, setIsOpen, pin }: ShowPinModalProps) {
	const { t } = useTranslation();
	const ts = (key: string) => t(`courses.progress.${key}`);

	return (
		<Modal
			aboveHeader={
				<div
					className="flex justify-center items-center rounded-xl border border-blue-100 text-gray-700 cursor-default pointer-events-auto"
					style={{
						width: "48px",
						height: "48px",
						boxShadow: "0px 1.38px 2.75px 0px rgba(16, 24, 40, 0.06)",
					}}
				>
					<Icon className="w-[24px] h-[24px] text-primary-gray" icon={faKey} />
				</div>
			}
			handleClose={() => setIsOpen(false)}
			isOpened={isOpen}
			showActions={false}
			size="xs"
			title=""
		>
			<div className="flex flex-col items-center justify-center w-full my-3">
				<h3 className="mb-2 text-primary-gray text-[20px] font-semibold">{ts("show-pin-title")}</h3>
				<p className="text-[14px] text-primary-gray-lighter mb-4 text-center">
					{ts("show-pin-description")}
				</p>
				<div className="flex justify-center w-full gap-3">
					{pin &&
						pin.split("").map((digit, index) => (
							<div
								key={index}
								className="flex items-center justify-center w-12 h-16 bg-gray-50 border border-gray-300 rounded-lg"
							>
								<span className="text-2xl font-bold text-primary-gray">{digit}</span>
							</div>
						))}
				</div>
			</div>
		</Modal>
	);
}
