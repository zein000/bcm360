import { FunctionComponent } from "react";
import { Route, Routes } from "react-router-dom";

import { CourseDetails } from "../Course/components/CourseDetails";
import CourseInProgressPage from "../Course/pages/CourseInProgressPage";
import { CreateCoursesForm } from "./components/CreateCoursesForm";
import { UpdateCoursesForm } from "./components/UpdateCoursesForm";
import { CoursesOverview } from "./pages/CoursesOverview/CoursesOverview";

export const Courses: FunctionComponent = () => {
	return (
		<Routes>
			<Route element={<CoursesOverview />} path="/" />
			<Route element={<CourseDetails />} path="/:id" />
			<Route element={<CourseInProgressPage />} path="/:id/progress" />
			<Route element={<CreateCoursesForm />} path="/create" />
			<Route element={<UpdateCoursesForm />} path="/edit/:id" />
		</Routes>
	);
};
