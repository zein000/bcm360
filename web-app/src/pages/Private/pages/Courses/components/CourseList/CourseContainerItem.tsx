import { faArrowRight, faImage } from "@fortawesome/pro-regular-svg-icons";

import { NavLink } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { Icon } from "@/components";

import { ROUTE_CONFIG } from "@/routes/config";

import { FileAssignment } from "../../enums/FileAssignment.enum";
import { Courses } from "../../schema/courses";
import CourseTag from "./CourseTag";

interface ICourseContainerItemProps {
	courseInfo: Courses;
}

export default function CourseContainerItem({ courseInfo }: ICourseContainerItemProps) {
	const { t } = useTranslation();
	const ts = (key: string) => t(`course.${key}`);
	const imagePath = courseInfo?.courseFiles?.find(
		(file) => file.fileAssignment === FileAssignment?.Thumbnail
	)?.fullFilePath;

	return (
		<div className="p-1 rounded-[20px] bg-[#F7F8FB] h-[40vh] flex flex-col justify-between">
			<div className="rounded-[20px] bg-white flex flex-col flex-1 max-h-[calc(100%-48px)]">
				{imagePath ? (
					<img
						alt="course"
						className="w-full h-[50%] object-cover rounded-t-[20px]"
						src={imagePath}
					/>
				) : (
					<Icon
						className="w-full h-[50%] object-cover rounded-t-[20px] text-primary-gray-lighter/20 border-b border-primary-gray-lighter/30"
						icon={faImage}
					/>
				)}
				<div className="p-4 flex-1 h-[50%] max-h-[50%] overflow-hidden">
					<CourseTag tag={courseInfo?.tag?.name} />
					<div className="mt-3 h-[calc(100%-46px)] overflow-hidden text-ellipsis flex flex-col justify-between">
						<h5 className="font-semibold text-primary-gray text-[14px] h-[50%] text-ellipsis line-clamp-2">
							{courseInfo?.name?.replace(/\n/g, " ")}
						</h5>
						<p className="text-[12px] text-primary-gray-lighter h-[50%] overflow-hidden text-ellipsis line-clamp-2">
							{courseInfo?.description?.replace(/\n/g, " ")}
						</p>
					</div>
				</div>
			</div>
			<NavLink
				className="w-full py-2 text-primary-gray mt-2 text-[14px] font-medium flex items-center justify-items-start gap-2 p-4"
				to={ROUTE_CONFIG.COURSES + `/${courseInfo?.id}`}
			>
				{ts("see-details")}
				<Icon className="w-5 h-5" icon={faArrowRight} />
			</NavLink>
		</div>
	);
}
