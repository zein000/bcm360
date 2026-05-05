import { HttpClientService } from "../http-client.service";

/**
 * Typ: HttpRequestDTO
 *
 * Dieser Typ definiert die Struktur für HTTP-Anfragen, die über den `HttpClientService` ausgeführt werden sollen.
 *
 * Ziel: Einheitliche Beschreibung von HTTP-Requests im Code, um Typsicherheit und Wiederverwendbarkeit zu gewährleisten.
 *
 * Felder:
 * - method: Die HTTP-Methode, z. B. "get", "post", "delete" etc.
 * - url: Die Ziel-URL der Anfrage
 * - data: Die Daten, die mitgesendet werden (nur bei Methoden wie POST, PUT, PATCH sinnvoll)
 *         → Datentyp basiert auf dem ersten Parameter (`data`) der `post` Methode von `HttpClientService`
 * - options: Optionen für den Request, z. B. Header, Authentifizierung, usw.
 *         → Ebenfalls aus der Signatur der `post` Methode abgeleitet
 * - timeout: Optionaler Timeout-Wert in Millisekunden, nach dem die Anfrage abgebrochen wird
 */

export type HttpRequestDTO = {
	method: "post" | "get" | "delete" | "put" | "patch";
	url: string;
	data: Parameters<HttpClientService["post"]>["0"]["data"];
	options: Parameters<HttpClientService["post"]>["0"]["options"];
	timeout?: number;
};
