import { useGetCoursesQuery } from "@/pages/Private/redux/courses/courses.api";
import { useSearch } from "@/utils";

import CourseContainer from "./CourseContainer";

export default function CoursesList() {
	const { page, limit, query } = useSearch();
	const { data, isLoading } = useGetCoursesQuery({
		page,
		limit,
		searchValue: query,
	});

	return (
		<div className="w-full flex-1 flex">
			<CourseContainer coursesInfo={data?.data ?? []} isLoading={isLoading} />
		</div>
	);
}
