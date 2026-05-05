// eslint-disable-next-line
// Hinzugefügt: Import der Plugin-Funktion von Tailwind
const plugin = require("tailwindcss/plugin");

module.exports = {
	content: ["./src/**/*.{html,js,ts,tsx}"],
	theme: {
		colors: {
			// BRAND COLORS
			"primary-blue": "#002347",
			"primary-blue-hover": "#4680FC",
			"primary-green": "#2AA216",
			"primary-green-lighter": "#2CA215",
			"primary-gray": "#2C2A29",
			"primary-gray-lighter": "#626373",

			transparent: "transparent",
			border: "#E0E2E7",
			"brand-light": "#4D66F5", // #4D66F5, // HP Light Green
			"brand-dark": "#005A6F", // "#41837F", // HP Dark Green
			"brand-grey": "#2D2D2D", // HP Grey
			"brand-accent": "#E7B0A9", // HP (rose)
			white: "#fff",
			black: "#000",
			"brand-black": "#374151",
			"brand-white": "#F9FAFB",
			"white-semi": "rgba(255,255,255,.2)",
			"black-semi": "rgba(0,0,0,.2)",
			"category-color": "#032D73",
			"blue-action": "#1D3DF2", // "#109cf1",
			"blue-action-dark": "#005A6F", // "#085AAD",
			"blue-light": "#b9d4db", // "#81CBF8", //#
			"blue-lightest": "#eef4f6", // "#cfebfc", #eef4f6
			hippolyta: "#D0C79499",
			"table-header": "#4B5563",
			text: "#4B5563",
			placeholder: "#9CA3AF",

			"active-item": "#D8DEFD",
			"inactive-item": "#F3F4F6",

			"tile-active": "#BBC5FB",

			"stepper-gap": "#95A4F9",

			// GRAYS
			"gray-900": "#202A3A",
			"gray-700": "#6B7280",
			"gray-600": "#475467",
			"gray-500": "#A6AAB0",
			"gray-400": "#D9D9D9",
			"gray-300": "#E0E2E7",
			"gray-200": "#E5E7EB",
			"gray-100": "#FAFAFD",
			"gray-50": "#DFE0EB",
			"gray-25": "#F8F9FC",

			// GREENS
			"green-100": "#EAFBCA",

			// BLUES
			"custom-blue": "#D8DEFD",
			"light-blue": "#F1F3FE",
			"medium-blue": "#6E83F7",

			// REBRANDING

			"rb-light-gray": "#485865",
			"rb-turquoise": "#009CA6",
			"rb-petrol": "#6B675E",
			"rb-gray": "#717B96",
			"rb-yellow": "#EBC463",

			// DEPRECATED?

			"blue-100": "#F1F3FE",

			"black-100": "#1F2A37", // black-100

			"main-100": "#0B78BC", // blue-100
			"main-80": "#3C93C9", // blue-80
			"main-60": "#6DAED7", // blue-60
			"main-40": "#9DC9E4", // blue-40
			"main-20": "#CEE4F2", // blue-20
			"main-dark": "#06578A", // blue-dark
			link: "#109CF1", // link

			// DEPRECATED END

			"status-success": "#1A8245", // true
			"status-error": "#DF2800", // false
			"status-warning": "#FF9900", // middle
			"status-disabled": "#E5E5E5", // true
			"status-info": "#6B7280", // true
			"status-running": "#D97706",
			"type-hygiene": "#3DC3ED", // hygiene
			"type-safety": "#FCD033", // safety

			"status-success-light": "#DAF8E6",
			"status-running-light": "#FFFBEB",
			"status-warning-light": "#FEEAA3",
			"status-info-light": "#F3F4F6", // true
			"status-error-light": "#FFD9DA",

			divider: "#F3F4F6", // true

			yellow: "#FFF7BE",

			"other-org": "#7386F51c",

			// MOBILE DEVICES
			"mb-dark-green": "#25596D",

			"blue-500": "#0B78BC",

			"green-700": "#1A8245",
			"green-500": "#50B104",
			"green-200": "#DAF8E6",

			"red-500": "#DF2800",

			"yellow-500": "#FF9900",
			// gray-500 ist doppelt definiert, die letzte gewinnt.
			// "gray-500": "#A6AAB0",
		},
		listStyleType: {
			roman: "upper-roman",
		},
		fontSize: {
			md: ["1.5rem", "2rem"],
			smd: ["1.25rem", "2rem"],
			ssmd: ["1.125rem", "1.5rem"],
			ssm: ["1rem", "1.5rem"],
			sm: ["0.875rem", "1.125rem"],
			xs: ["0.75rem", "1.125rem"],
		},
		extend: {
			fontSize: {
				lg: "2rem",
			},
			spacing: {
				76: "16.5rem",
				26: "6.5rem",
			},
			height: {
				90: "90%",
			},
			maxWidth: {
				page: "1200px",
				form: "588px",
			},
			boxShadow: {
				soft: "0px 1.38px 2.75px 0px rgba(16, 24, 40, 0.06)",
				medium: "0px 1.38px 4.13px 0px rgba(16, 24, 40, 0.10)",
			},
			screens: {
				md: "1024px",
				lg: "1280px",
				xl: "1440px",
			},
			rounded: {
				l: "0.625rem",
			},
			borderRadius: {
				32: "32px",
				16: "16px",
			},
			zIndex: {
				1: 1,
			},
			fontFamily: {
				urbanist: ["Urbanist", "sans-serif"],
			},
		},
	},
	// Hinzugefügt: Der Plugin-Block für die Scrollbar
	plugins: [
		plugin(function ({ addUtilities, theme }) {
			addUtilities({
				".scrollbar-custom": {
					// Styling für Firefox
					"scrollbar-width": "thin",
					"scrollbar-color": `${theme("colors.gray-700")} transparent`,

					// Styling für Chrome, Safari und Edge
					"&::-webkit-scrollbar": {
						width: "8px",
					},
					"&::-webkit-scrollbar-track": {
						backgroundColor: "transparent",
					},
					"&::-webkit-scrollbar-thumb": {
						backgroundColor: theme("colors.gray-700"),
						borderRadius: "4px",
						border: "2px solid transparent",
						backgroundClip: "padding-box",
					},
					"&::-webkit-scrollbar-thumb:hover": {
						backgroundColor: theme("colors.gray-600"),
					},
				},
			});
		}),
		plugin(function ({ addUtilities }) {
			addUtilities({
				".scrollbar-hide": {
					/* Firefox */
					"scrollbar-width": "none",

					/* Safari and Chrome */
					"&::-webkit-scrollbar": {
						display: "none",
					},
				},
			});
		}),
	],
};
