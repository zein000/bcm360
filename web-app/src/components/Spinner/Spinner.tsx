import { FunctionComponent } from "react";
import "./spinner.css";

export const Spinner: FunctionComponent<{ color?: string }> = ({ color }) => (
	<div className="flex-shrink-0 loader" style={{ borderLeftColor: color || "#fff" }} />
);
