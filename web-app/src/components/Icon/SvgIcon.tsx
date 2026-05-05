import { FunctionComponent } from "react";

interface SvgIconProps {
	svgIcon: React.ElementType<React.SVGProps<SVGSVGElement>>;
	className?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}

export const SvgIcon: FunctionComponent<SvgIconProps> = ({ svgIcon, className = "", ...rest }) => {
	const IconComponent = svgIcon;

	return <IconComponent className={className} {...rest} />;
};
