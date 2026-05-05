import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import { classNames } from "@/utils/classNames";

import { Sidebar } from "../Sidebar/Sidebar";
import TopBar from "../Topbar/Topbar";

export const MainLayout = () => {
	const initialUser = localStorage.getItem("initialUser");

	return (
		<Box
			sx={{
				width: "100%",
				minHeight: "100vh",
			}}
		>
			<div
				className={classNames(
					"w-full flex flex-row lg:h-[100vh] bg-white font-urbanist",
					initialUser ? "bg-other-org" : "bg-brand-white relative"
				)}
			>
				<Sidebar />
				<div className="sm:z-10 flex-grow min-w-0 h-full  relative">
					<div
						className="bg-white flex flex-col h-[calc(100vh)] overflow-y-visible overflow-x-auto lg:overflow-auto "
						id="outlet-container"
						style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
					>
						<TopBar />
						<Outlet />
					</div>
				</div>
			</div>
		</Box>
	);
};
