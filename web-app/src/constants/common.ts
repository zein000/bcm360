import { ENVIRONMENT_VARIABLES_SCHEMA } from "../environment-variables.schema";

export const PARSED_ENV = ENVIRONMENT_VARIABLES_SCHEMA.parse(process.env);
export const PASSWORD_REGEX =
	/(?=[\p{L}\p{N}~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/]+$)^(?=.*[\p{Ll}])(?=.*[\p{Lu}])(?=.*[\p{N}])(?=.*[~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/])(?=.{8,}).*$/u;
