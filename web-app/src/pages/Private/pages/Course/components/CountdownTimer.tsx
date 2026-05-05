import { faAlarmClock } from "@fortawesome/pro-regular-svg-icons";

import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { Icon } from "@/components";
import { secondsToFormattedTime } from "@/utils/secondsToFormattedTime";

interface ICountdownTimer {
	currentStageEndTimestamp: number;
}

export default function CountdownTimer({ currentStageEndTimestamp }: ICountdownTimer) {
	const { t } = useTranslation();
	const ts = (key: string) => t(`courses.progress.${key}`);
	const [timeLeft, setTimeLeft] = useState<number>(currentStageEndTimestamp);

	useEffect(() => {
		if (timeLeft <= 0) {
			return;
		}

		const interval = setInterval(() => {
			setTimeLeft((prevTime: number) => {
				if (prevTime <= 1) {
					clearInterval(interval);

					return 0;
				}

				return prevTime - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [timeLeft]);

	useEffect(() => {
		if (currentStageEndTimestamp) {
			const leftStageTimeInSeconds = Math.round((currentStageEndTimestamp - Date.now()) / 1000);

			if (leftStageTimeInSeconds > 0) {
				setTimeLeft(leftStageTimeInSeconds);
			} else {
				setTimeLeft(0);
			}
		} else {
			setTimeLeft(0);
		}
	}, [currentStageEndTimestamp]);

	return (
		<div
			className={`flex items-center justify-center gap-2 border-[1px] border-[#F04438] px-4 py-[10px] rounded-lg ${
				timeLeft <= 10 && timeLeft % 2 === 0 ? "bg-[#F0443830]" : ""
			}`}
		>
			<Icon className="text-[#F04438]" icon={faAlarmClock} />
			<p className="text-[#F04438] text-[14px] font-semibold">
				{secondsToFormattedTime(timeLeft)} {ts("left")}
			</p>
		</div>
	);
}
