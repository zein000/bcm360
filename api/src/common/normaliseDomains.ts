export const normalizeDomains = (url?: string | null) => {
	try {
		if (!url) {
			return null;
		}

		const nUrl = new URL(url.includes("http") ? url : `http://${url}`);

		return nUrl.hostname.replace("www.", "");
	} catch (e) {
		console.error(e);
		console.error(url);
	}
};
