import { CircularProgress } from "@mui/material";

import { Courses } from "../../schema/courses";
import CourseContainerItem from "./CourseContainerItem";

interface ICourseContainerProps {
	coursesInfo: Courses[];
	isLoading?: boolean;
}

export default function CourseContainer({ coursesInfo, isLoading }: ICourseContainerProps) {
	return (
		<>
			{isLoading ? (
				<div className="w-full flex-1 flex items-center justify-center">
					<CircularProgress className="!w-16 !h-16 !text-primary-gray" />
				</div>
			) : (
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full gap-4">
					{coursesInfo.map((courseInfo) => (
						<CourseContainerItem key={courseInfo.id} courseInfo={courseInfo} />
					))}
				</div>
			)}
		</>
	);
}
