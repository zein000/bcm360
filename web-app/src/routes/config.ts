export const ROUTE_CONFIG = {
	LOGIN: "/login",
	TFA: "/2fa",
	LOGOUT: "/logout",
	FORGOT_PASSWORD: "/forgot-password",
	ERROR_PAGE: "/error-page",
	ACCOUNT: "/app/account",
	COMPANY: "/app/company",
	USERS: "/app/users",
	USER_ROLES: "/app/users/user-roles",
	COMPANIES: "/app/companies",
	ANALYTICS: "/app/analytics",
	ACCOUNTS: "/app/accounts",
	DASHBOARD: "/app/dashboard",
	COURSES: "/app/courses",
	COMPANY_MANAGEMENT: "/app/company-management",
};

export const PUBLIC_PAGES_AFTER_LOGIN = [ROUTE_CONFIG.FORGOT_PASSWORD];
