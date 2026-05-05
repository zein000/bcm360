import { useTranslation } from "react-i18next";

import { CircularProgress } from "@mui/material";

import CourseContainerItem from "../../../Courses/components/CourseList/CourseContainerItem";
import { Courses } from "../../../Courses/schema/courses";
import CardLayout from "../CardLayout";

interface RelatedCoursesContainerProps {
	isRelatedCoursesDataFetching: boolean;
	relatedCourses: Courses[];
}

export default function RelatedCoursesContainer({
	isRelatedCoursesDataFetching,
	relatedCourses,
}: RelatedCoursesContainerProps) {
	const { t } = useTranslation();
	const ts = (key: string) => t(`course.${key}`);

	return (
		<CardLayout className="">
			<h2 className="font-semibold text-[20px] mb-7">{ts("related-scenarios")}</h2>
			{isRelatedCoursesDataFetching ? (
				<div className="w-full p-2 flex items-center justify-center">
					<CircularProgress />
				</div>
			) : relatedCourses?.length ? (
				<div className="space-y-3 max-h-[65vh] overflow-y-auto custom-scrollbar rounded-lg">
					{relatedCourses.map((course) => (
						<CourseContainerItem key={course.id} courseInfo={course} />
					))}
				</div>
			) : (
				<p className="text-[12px] text-primary-gray-lighter">{ts("no-related-scenarios")}</p>
			)}
		</CardLayout>
	);
}
