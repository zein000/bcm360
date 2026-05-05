/**
 * Funktion: normalizeLinkedinUrl
 *
 * Normalisiert eine LinkedIn-URL, um sie in ein einheitliches Format zu bringen.
 * Ziel ist es, Duplikate oder Variationen (z.B. mit verschiedenen Subdomains oder https) zu vereinheitlichen.
 *
 * Schritte:
 * - Entfernt "https://" und ersetzt es mit "http://"
 * - Kürzt trailing Slash
 * - Ersetzt alle Subdomains durch www (z.B. "de.linkedin.com" → "www.linkedin.com")
 * - Trimmt URL-Pfade auf maximal 2 Segmente (z.B. /in/user)
 * - Konvertiert `showcase` zu `company`, falls notwendig
 *
 * @param linkedinUrl - Die zu normalisierende URL
 * @returns Eine normalisierte LinkedIn-Profil- oder Unternehmens-URL oder `null`
 */
export const normalizeLinkedinUrl = (linkedinUrl?: string | null): string | null => {
	try {
		if (!linkedinUrl) return null;

		let url = linkedinUrl.replace("https://", "http://");

		if (url.endsWith("/")) {
			url = url.slice(0, -1);
		}

		url = url.replace(/(http:\/\/)?([a-z0-9-]+\.)*linkedin\.com/, "http://www.linkedin.com");

		const newUrl = new URL(url);
		const path = newUrl.pathname.split("/");

		if (path.length > 2) {
			path.splice(2);
		}

		if (path?.[0] === "showcase") {
			path[0] = "company";
		}

		let pathname = newUrl.pathname;
		if (pathname.endsWith("/")) {
			pathname = pathname.slice(0, -1);
		}

		return decodeURI(`${newUrl.protocol}//${newUrl.hostname}${pathname}`);
	} catch (e) {
		console.error("Error normalizing LinkedIn URL:", e);
		console.error("Input:", linkedinUrl);
		return null;
	}
};

/**
 * Funktion: normalizeCompanyLinkedinUrl
 *
 * Wie `normalizeLinkedinUrl`, jedoch nur für Unternehmensseiten.
 * Gibt `null` zurück, wenn die URL kein Unternehmen repräsentiert.
 *
 * Einschränkungen:
 * - Nur gültig, wenn Pfad mit `/company/` beginnt
 * - `showcase`-Links werden in `company` konvertiert
 *
 * @param linkedinUrl - Die zu prüfende und normalisierende URL
 * @returns Normalisierte URL oder `null`, wenn keine gültige Firmen-URL
 */
export const normalizeCompanyLinkedinUrl = (linkedinUrl?: string | null): string | null => {
	try {
		if (!linkedinUrl) return null;

		let url = linkedinUrl.replace("https://", "http://");

		if (url.endsWith("/")) {
			url = url.slice(0, -1);
		}

		url = url.replace(/(http:\/\/)?([a-z0-9-]+\.)*linkedin\.com/, "http://www.linkedin.com");

		const newUrl = new URL(url);
		const path = newUrl.pathname.split("/");

		if (path.length > 2) {
			path.splice(2);
		}

		if (path[0] === "showcase") {
			path[0] = "company";
		}

		if (path[0] !== "company") {
			return null;
		}

		return decodeURI(`${newUrl.protocol}//${newUrl.hostname}${newUrl.pathname}`);
	} catch (e) {
		console.error("Error normalizing LinkedIn company URL:", e);
		console.error("Input:", linkedinUrl);
		return null;
	}
};
