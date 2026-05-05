import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "@/redux";

import { coursesProgressApi } from "./course-progress.api";
import { CourseProgress } from "../../pages/Analytics/schema/course-progress";

const initialState: CourseProgress[] = [];

export const courseProgressSlice = createSlice({
	name: "courses-progress",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addMatcher(
			coursesProgressApi.endpoints.getCourseProgresses.matchFulfilled,
			(state, { payload }) => {
				return payload.data;
			}
		);
	},
});

export const {} = courseProgressSlice.actions;
export const coursesProgressReducer = courseProgressSlice.reducer;
export const coursesProgressSelector = (state: RootState) => state[courseProgressSlice.name];
