import { ReactNode } from "react";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { Alert } from "@mui/material";
import { ZodError } from "zod";

import { ServerError } from "@/types/error";

import i18n from "../i18n";

export enum ERROR_TYPE {
	INVALID_EMAIL = "INVALID_EMAIL",
	INVALID_PASSWORD = "INVALID_PASSWORD",
	PASSWORD_GUIDELINES = "PASSWORD_GUIDELINES",
	ACCEPT_TERMS = "ACCEPT_TERMS",
	INVALID_VALUE = "INVALID_VALUE",
	INCORRECT_CREDENTIALS = "INCORRECT_CREDENTIALS",
	NOT_CONFIRMED = "NOT_CONFIRMED.",
	USER_NOT_FOUND = "USER_NOT_FOUND",
	EMAIL_ALREADY_TAKEN = "EMAIL_ALREADY_TAKEN",
	REQUIRED = "REQUIRED",
	PASSWORD_MISMATCH = "PASSWORD_MISMATCH",
	SOMETHING_WRONG = "SOMETHING_WRONG",
	INVALID_TOKEN = "INVALID_TOKEN",
	UNAUTHORIZED = "UNAUTHORIZED",
	INVALID_OTP_AUTH_CODE = "INVALID_OTP_AUTH_CODE",
	NAME_MISSING = "NAME_MISSING",
	EXPECTED_NUMBER = "Expected number, received nan",
	CUSTOM_COLUMN_ALREADY_EXISTS = "CUSTOM_COLUMN_ALREADY_EXISTS",
	WRONG_URL_SHOULD_BE_LINKEDIN_PROFILE = "WRONG_URL_SHOULD_BE_LINKEDIN_PROFILE",
	NOT_ENOUGH_CREDITS = "NOT_ENOUGH_CREDITS",
}

export const translateError = {
	[ERROR_TYPE.INVALID_EMAIL]: i18n.t("errors.invalidEmail"),
	[ERROR_TYPE.INVALID_PASSWORD]: i18n.t("errors.invalidPassword"),
	[ERROR_TYPE.PASSWORD_GUIDELINES]: i18n.t("errors.passwordGuidelinesNotMet"),
	[ERROR_TYPE.ACCEPT_TERMS]: i18n.t("errors.termsAcceptanceMissing"),
	[ERROR_TYPE.INVALID_VALUE]: i18n.t("errors.invalidValue"),
	[ERROR_TYPE.INCORRECT_CREDENTIALS]: i18n.t("login.invalidData"),
	[ERROR_TYPE.NOT_CONFIRMED]: i18n.t("login.userNotConfirmed"),
	[ERROR_TYPE.PASSWORD_MISMATCH]: i18n.t("errors.passwordMismatch"),
	[ERROR_TYPE.USER_NOT_FOUND]: i18n.t("login.invalidData"),
	[ERROR_TYPE.INVALID_TOKEN]: i18n.t("errors.invalidToken"),
	[ERROR_TYPE.EMAIL_ALREADY_TAKEN]: i18n.t("errors.emailAlreadyTaken"),
	[ERROR_TYPE.REQUIRED]: i18n.t("errors.requiredFields"),
	[ERROR_TYPE.SOMETHING_WRONG]: i18n.t("errors.wentWrong"),
	[ERROR_TYPE.UNAUTHORIZED]: i18n.t("errors.unauthorized"),
	[ERROR_TYPE.INVALID_OTP_AUTH_CODE]: i18n.t("errors.invalidAuthCode"),
	[ERROR_TYPE.NAME_MISSING]: i18n.t("errors.nameMissing"),
	[ERROR_TYPE.EXPECTED_NUMBER]: i18n.t("errors.expectedNumber"),
	[ERROR_TYPE.CUSTOM_COLUMN_ALREADY_EXISTS]: i18n.t("errors.customColumnAlreadyExists"),
	[ERROR_TYPE.WRONG_URL_SHOULD_BE_LINKEDIN_PROFILE]: i18n.t(
		"errors.wrongUrlShouldBeLinkedinProfile"
	),
	[ERROR_TYPE.NOT_ENOUGH_CREDITS]: i18n.t("errors.notEnoughCredits"),
};

export const renderErrorMessages = (errors: ERROR_TYPE[]): ReactNode => {
	const uniqueErrors: ERROR_TYPE[] = errors.filter((err, index, arr) => arr.indexOf(err) === index);

	return (
		<>
			{uniqueErrors.length === 1 ? (
				<Alert severity="error" sx={{ alignItems: "center", bgcolor: "error.light", fontSize: 14 }}>
					{translateError[uniqueErrors[0]]}
				</Alert>
			) : (
				uniqueErrors.map((error, index) => (
					<Alert
						key={index}
						severity="error"
						sx={{ mb: 1, alignItems: "center", bgcolor: "error.light", fontSize: 14 }}
					>
						{translateError[error]}
					</Alert>
				))
			)}
		</>
	);
};

export const getErrorMessage = (error: FetchBaseQueryError | SerializedError): ERROR_TYPE => {
	if (error.hasOwnProperty("name")) {
		return JSON.parse((error as ZodError)?.message)[0]?.message?.toUpperCase() as ERROR_TYPE;
	} else {
		const message = (error as ServerError)?.data?.message;

		return message?.toUpperCase() as ERROR_TYPE;
	}
};

export const getAllErrors = (
	serverError: FetchBaseQueryError | SerializedError | undefined,
	formErrors: ERROR_TYPE[]
): ERROR_TYPE[] => {
	return [
		serverError ? getErrorMessage(serverError) : null,
		...formErrors.map((e) => e?.toUpperCase()),
	].filter(Boolean) as ERROR_TYPE[];
};
