// / <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_URL: string;
	readonly VITE_PAYONE_MERCHANT_ID: string;
	readonly VITE_PAYONE_PORTAL_ID: string;
	readonly VITE_PAYONE_SUB_ID: string;
	readonly VITE_PAYONE_API_MODE: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
