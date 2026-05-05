import type { TypographyOptions } from "@mui/material/styles/createTypography";

export const createTypography = (): TypographyOptions => {
	return {
		fontFamily: "Inter !important",
		body1: {
			fontSize: "18px",
			fontWeight: 400,
			lineHeight: "24px",
			marginBottom: "12px",
		},
		body2: {
			fontSize: "14px",
			fontWeight: 300,
			lineHeight: "18px",
		},
		button: {
			fontWeight: 600,
		},
		caption: {
			fontSize: "0.75rem",
			fontWeight: 500,
			lineHeight: 1.66,
		},
		subtitle1: {
			fontSize: "1rem",
			fontWeight: 500,
			lineHeight: 1.57,
		},
		subtitle2: {
			fontSize: "0.875rem",
			fontWeight: 500,
			lineHeight: 1.57,
		},
		overline: {
			fontSize: "0.75rem",
			fontWeight: 600,
			letterSpacing: "0.5px",
			lineHeight: 2.5,
			textTransform: "uppercase",
		},
		h1: {
			fontFamily: "'Inter'",
			fontWeight: 400,
			fontSize: "34px",
			lineHeight: "39px",
			marginBottom: "12px",
		},
		h2: {
			fontFamily: "'Inter'",
			fontWeight: 400,
			fontSize: "32px",
			lineHeight: "44px",
			marginBottom: "12px",
		},
		h3: {
			fontFamily: "'Inter'",
			fontWeight: 400,
			fontSize: "24px",
			lineHeight: "30px",
			marginBottom: "12px",
		},
		h4: {
			fontFamily: "'Inter'",
			fontWeight: 600,
			fontSize: "18px",
			lineHeight: "24px",
			marginBottom: "10px",
		},
		h5: {
			fontFamily: "Inter",
			fontWeight: 600,
			fontSize: "16px",
			lineHeight: "20px",
			marginBottom: "10px",
		},
		h6: {
			fontFamily: "Inter",
			fontWeight: 600,
			fontSize: "14px",
			lineHeight: "20px",
			marginBottom: "10px",
		},
	};
};
