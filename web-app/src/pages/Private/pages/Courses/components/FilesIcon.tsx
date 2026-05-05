import { useMemo } from "react";

import { faImage, faQuestion } from "@fortawesome/pro-regular-svg-icons";

import {
	faVideoCamera,
	faMicrophone,
	faFileLines,
	faLightbulb,
} from "@fortawesome/pro-solid-svg-icons";

import { Icon } from "@/components";

import { FileTypes } from "../enums/FileTypes.enum";

interface IFilesIcon {
	fileType: FileTypes;
	iconSizeClassNames?: string;
	iconColor?: string;
	containerClassNames?: string;
}

export default function FilesIcon({
	fileType,
	iconSizeClassNames = "w-5 h-5",
	iconColor = "#1D243C",
	containerClassNames,
}: IFilesIcon) {
	const fileIcon = useMemo(() => {
		switch (fileType?.toUpperCase()) {
			case FileTypes.Text:
				return <Icon className={`${iconSizeClassNames} text-[${iconColor}]`} icon={faFileLines} />;
			case FileTypes.Audio:
				return <Icon className={`${iconSizeClassNames} text-[${iconColor}]`} icon={faMicrophone} />;
			case FileTypes.Image:
				return <Icon className={`${iconSizeClassNames} text-[${iconColor}]`} icon={faImage} />;
			case FileTypes.Video:
				return (
					<Icon className={`${iconSizeClassNames} text-[${iconColor}]`} icon={faVideoCamera} />
				);
			case FileTypes.Spoiler:
				return <Icon className={`${iconSizeClassNames} text-[${iconColor}]`} icon={faLightbulb} />;
			case FileTypes.Unknown:
				return <Icon className={`${iconSizeClassNames} text-[${iconColor}]`} icon={faQuestion} />;
			default:
				return <Icon className={`${iconSizeClassNames} text-[${iconColor}]`} icon={faQuestion} />;
		}
	}, [fileType, iconColor, iconSizeClassNames]);

	return (
		<div className={`w-9 h-9 flex items-center justify-center ${containerClassNames}`}>
			{fileIcon}
		</div>
	);
}
