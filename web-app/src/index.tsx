import React from "react";
import ReactDOM from "react-dom/client";

import { worker as serverWorker } from "@/mocks/browser";
import { PARSED_ENV } from "@/constants/common";

import "src/utils/string.extensions";

import App from "./App";

if (PARSED_ENV.REACT_APP_NODE_ENV === "development") {
	serverWorker.start();
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
	// <React.StrictMode>
	<App />
	// </React.StrictMode>
);
