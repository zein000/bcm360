import { createSlice } from "@reduxjs/toolkit";

import { CompaniesState } from "@/types/companies";

import { RootState } from "@/redux";

import { companiesApi } from "./companies.api";

const initialState: CompaniesState = {
	companies: [],
};

export const companiesSlice = createSlice({
	name: "companies",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addMatcher(companiesApi.endpoints.getCompanies.matchFulfilled, (state, { payload }) => {
			state.companies = payload.data;
		});
	},
});

export const {} = companiesSlice.actions;
export const companiesReducer = companiesSlice.reducer;
export const companiesSelector = (state: RootState) => state[companiesSlice.name];
