import { FunctionComponent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface IconProps {
	icon: IconDefinition;
	[unknownProp: string]: unknown;
}

export const Icon: FunctionComponent<IconProps> = ({ icon, ...rest }) => (
	<FontAwesomeIcon icon={icon} {...rest} />
);
