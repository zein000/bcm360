import { useTranslation } from "react-i18next";

import { faCircleExclamation } from "@fortawesome/pro-regular-svg-icons";

import { useMemo } from "react";

import { Icon } from "@/components";
import { formatTimestamp } from "@/utils/formatTimestamp";

interface ITimeUpMessage {
	timestamp: number;
	data?: {
		title: string;
		description: string;
		type: ServiceMessageType;
		descriptionOptions?: Record<string, unknown>;
		titleOptions?: Record<string, unknown>;
	};
}

export enum ServiceMessageType {
	INFO = "INFO",
	ERROR = "ERROR",
	SUCCESS = "SUCCESS",
}

export default function ServiceMessage({ timestamp, data }: ITimeUpMessage) {
	const { t } = useTranslation();
	const ts = (key: string, options = {}) => t(`courses.progress.${key}`, options);

	const { color, icon } = useMemo(() => {
		switch (data?.type) {
			case ServiceMessageType.ERROR:
				return {
					color: "#F04438",
					icon: <Icon className={`text-[#F04438]`} icon={faCircleExclamation} />,
				};
			case ServiceMessageType.SUCCESS:
				return {
					color: "#F04438",
					icon: <Icon className={`text-[#F04438]`} icon={faCircleExclamation} />,
				};
			case ServiceMessageType.INFO:
				return {
					color: "#F04438",
					icon: <Icon className={`text-[#F04438]`} icon={faCircleExclamation} />,
				};
			default:
				return {
					color: "#F04438",
					icon: <Icon className={`text-[#F04438]`} icon={faCircleExclamation} />,
				};
		}
	}, [data]);

	return (
		<div className="my-2 pr-32">
			<div className="flex justify-between px-1">
				<p className={`text-[0.875rem] text-[${color}] font-medium`}>
					{data?.titleOptions ? ts(data?.title ?? "", data?.titleOptions) : ts(data?.title ?? "")}
				</p>
				<p className={`text-[0.75rem] text-[${color}]`}>{formatTimestamp(timestamp)}</p>
			</div>
			<div
				className={`bg-[#F0443820] flex-1 text-primary-gray px-[14px] py-[10px] rounded-lg flex justify-start items-center gap-2`}
			>
				{icon}
				<p className={`text-[1rem] text-[${color}]`}>
					{data?.descriptionOptions
						? ts(data?.description ?? "", data?.descriptionOptions)
						: ts(data?.description ?? "")}
				</p>
			</div>
		</div>
	);
}
