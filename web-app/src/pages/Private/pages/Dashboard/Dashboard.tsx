import { FunctionComponent } from "react";
import { Route, Routes } from "react-router-dom";

import { DashboardOverview } from "./pages/DashboardOverview/DashboardOverview";

export const Dashboard: FunctionComponent = () => {
	return (
		<Routes>
			<Route element={<DashboardOverview />} path="/" />
		</Routes>
	);
};
