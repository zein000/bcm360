import { faChevronRight } from "@fortawesome/pro-regular-svg-icons";
import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

import { Icon } from "../Icon/Icon";

interface BreadcrumbProps {
	path: {
		appFunction?: string;
		name: string;
		link: string;
	}[];
}

export const Breadcrumb: FunctionComponent<BreadcrumbProps> = ({ path }) => {
	const navigate = useNavigate();

	return (
		<ul className="h-[26px] mb-5 w-full items-center">
			{path.map((item, index) => {
				if (index === path.length - 1) {
					return (
						<li key={index} className="inline-flex">
							<span className="text-blue-500  mr-4 text-sm font-medium">{item.name}</span>
						</li>
					);
				}

				return (
					<li key={index} className="inline-flex items-center">
						<button
							className="text-placeholder  hover:underline mr-4 text-sm font-medium"
							onClick={() => navigate(`/app/${item.appFunction || "lists"}${item.link}`)}
						>
							{item.name}
						</button>
						<Icon className="h-[12px] mr-4 color-placeholder" icon={faChevronRight} />
					</li>
				);
			})}
		</ul>
	);
};
