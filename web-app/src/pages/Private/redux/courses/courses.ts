import { createSlice } from "@reduxjs/toolkit";

import { CoursesState } from "@/types/courses";

import { RootState } from "@/redux";

import { coursesApi } from "./courses.api";

const initialState: CoursesState = {
	courses: [],
};

export const coursesSlice = createSlice({
	name: "courses",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addMatcher(coursesApi.endpoints.getCourses.matchFulfilled, (state, { payload }) => {
			state.courses = payload.data;
		});
	},
});

export const {} = coursesSlice.actions;
export const coursesReducer = coursesSlice.reducer;
export const coursesSelector = (state: RootState) => state[coursesSlice.name];
