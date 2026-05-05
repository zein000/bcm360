import { HttpService } from "@nestjs/axios";
import { InjectQueue } from "@nestjs/bullmq";
import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import {
	AxiosBasicCredentials,
	AxiosError,
	AxiosRequestConfig,
	AxiosRequestHeaders,
	AxiosResponse,
} from "axios";
import { JobsOptions, Queue } from "bullmq";
import { catchError, lastValueFrom, map, throwError } from "rxjs";
import { Validator } from "class-validator";
import { HttpsProxyAgent } from "https-proxy-agent";
import { SocksProxyAgent } from "socks-proxy-agent";

import { RETRY_QUEUE_JOBS_PREFIX, RETRY_QUEUE_NAME } from "src/retry/constants";
import { ApiApplications } from "src/enums/application.enum";
import { ConfigurationService } from "src/configuration/configuration.service";
import { HttpResponseDTO } from "../common/dto/http-response.dto";
import { HttpRequestDTO } from "./dto/http-request.dto";

const proxyChain = require("proxy-chain");

/**
 * Klasse: HttpClientService
 *
 * Diese Service-Klasse stellt einen erweiterten HTTP-Client auf Basis von Axios dar,
 * integriert in NestJS. Sie bietet zusätzliche Funktionalitäten wie:
 * - Wiederholungsmechanismen über BullMQ bei fehlgeschlagenen Anfragen
 * - Unterstützung von Proxy-Anfragen (HTTP, SOCKS)
 * - Ratelimit-Erkennung und Retry-Logik
 * - Unterstützung für validierte POST-Requests
 * - Kostenberechnung pro Anfrage basierend auf der Ziel-API
 *
 * Verwendete Technologien:
 * - `HttpService` (NestJS Axios-Wrapper)
 * - `BullMQ` für Wiederholungs-Queue
 * - `proxy-chain`, `https-proxy-agent`, `socks-proxy-agent` für Proxy-Handling
 * - `class-validator` zur Validierung von HTTP-Antworten
 * - dynamische Retry-Logik bei spezifischen Fehlercodes wie 429 oder 500
 */

@Injectable()
export class HttpClientService {
	private readonly logger = new Logger();
	private validator = new Validator();

	private proxyUrl = "http://6e7478f829017d8c7564__cr.de:d74809818fd99871@gw.dataimpulse.com:823";
	private proxyChain;
	private logging = false;

	constructor(
		private readonly httpService: HttpService,
		@InjectQueue(RETRY_QUEUE_NAME) private retryQueue: Queue,
		private readonly configurationService: ConfigurationService
	) {
		if (process.env.NODE_ENV !== "test") {
			proxyChain.anonymizeProxy({ url: this.proxyUrl }).then((r) => {
				this.proxyChain = r;
			});
		}
	}

	/**
	 * Funktion: parseErrorForRetry
	 *
	 * Prüft, ob ein Fehler ein Retry rechtfertigt und fügt den Request ggf. zur Retry-Queue hinzu.
	 *
	 * @param error - der aufgetretene Fehler
	 * @param requestProperties - ursprüngliche Request-Daten
	 * @param retryJobOptions - optionale Optionen für die Retry-Queue
	 */
	private async parseErrorForRetry(
		error: Error,
		requestProperties: HttpRequestDTO,
		retryJobOptions?: JobsOptions
	) {
		try {
			if ("response" in error) {
				const castedError = error as AxiosError;

				if (
					[
						HttpStatus.INTERNAL_SERVER_ERROR,
						HttpStatus.REQUEST_TIMEOUT,
						HttpStatus.GATEWAY_TIMEOUT,
					].includes(castedError.response.status)
				) {
					await this.retryQueue.add(RETRY_QUEUE_JOBS_PREFIX, requestProperties, retryJobOptions);
				}
			} else {
				await this.retryQueue.add(RETRY_QUEUE_JOBS_PREFIX, requestProperties, retryJobOptions);
			}
		} catch (queueError) {
			this.logger.error("Push to retry queue failed with error: ", queueError);
		}
	}

	/**
	 * Funktion: proxiedRequest
	 *
	 * Führt eine GET-Anfrage über einen angegebenen Proxy aus.
	 *
	 * @param proxyURL - Proxy-Adresse
	 * @param endpoint - Ziel-URL
	 * @returns Antwortdaten
	 */
	async proxiedRequest(proxyURL, endpoint) {
		const tunnelTimeout = 10000;
		const parsedUrl = new URL(proxyURL);
		let agent;

		if (parsedUrl.protocol.startsWith("http")) {
			agent = new HttpsProxyAgent(proxyURL);
		} else if (parsedUrl.protocol.startsWith("socks")) {
			agent = new SocksProxyAgent(proxyURL);
		} else {
			throw new Error(`Unsupported proxy scheme: ${parsedUrl.protocol}`);
		}

		try {
			const response = await this.httpService
				.get(endpoint, {
					httpAgent: agent,
					httpsAgent: agent,
					timeout: tunnelTimeout,
					headers: { "User-Agent": "Guest" },
				})
				.toPromise();

			return response.data;
		} catch (error) {
			throw new Error(error.response.status);
		}
	}

	/**
	 * Funktion: calcucateCosts
	 *
	 * Berechnet die Kosten eines API-Aufrufs anhand der URL und des verwendeten Dienstes.
	 *
	 * @param url - API-Endpunkt
	 * @param application - verwendete Anwendung (enum)
	 * @returns Kosten (Zahl)
	 */
	async calcucateCosts(url: string, application: ApiApplications) {
		let app;
		let factor = 1;

		if (application === ApiApplications.CLEAROUT && url.includes("clearout.io/v2/email_verify")) {
			app = "CLEAROUT_COSTS";
		} else if (
			application === ApiApplications.CLEAROUT &&
			url.includes("clearout.io/v2/email_finder")
		) {
			app = "CLEAROUT_COSTS";
			factor = 4;
		} else if (application === ApiApplications.SERPER) {
			app = "SERPER_COSTS";
		} else if (application === ApiApplications.ZENROWS) {
			app = "ZENROWS_COSTS";
		} else if (
			application === ApiApplications.ZERBOUNCE &&
			url.includes("zerobounce.net/v2/validate")
		) {
			app = "ZERBOUNCE_VALIDATE_COSTS";
		} else if (
			application === ApiApplications.ZERBOUNCE &&
			url.includes("zerobounce.net/v2/guessformat")
		) {
			app = "ZERBOUNCE_FINDER_COSTS";
		} else if (application === ApiApplications.JSEARCH) {
			app = "JSEARCH";
		} else if (application === ApiApplications.GENDERIZE) {
			app = "GENDERIZE_COSTS";
		} else if (application === ApiApplications.RAPIDAPI_LINKEDIN_DATA_SCRAPER) {
			app = "RAPIDAPI_LINKEDIN_DATA_SCRAPER";
		} else if (application === ApiApplications.RAPIDAPI_LOCAL_BUSINESS_DATA) {
			app = "RAPIDAPI_LOCAL_BUSINESS_DATA";
		} else if (application === ApiApplications.TAVILY) {
			app = "TAVILY";
		} else if (application === ApiApplications.RAPIDAPI_RT_LINKEDIN_DATA_SCRAPER_API) {
			app = "RAPIDAPI_RT_LINKEDIN_DATA_SCRAPER_API";
		} else if (application === ApiApplications.RAPIDAPI_FRESH_LINKEDIN_PROFILE_DATA) {
			app = "RAPIDAPI_FRESH_LINKEDIN_PROFILE_DATA";
		}

		if (app) {
			const config = await this.configurationService.findOneByName(app);
			return +config.value * factor;
		}

		return 0;
	}

	//// TODO: currently proxy works only for http requests. / perfect for linkedin public profile scraping.
	/**
	 * Funktion: getCached
	 *
	 * Diese Funktion führt eine HTTP-GET-Anfrage aus, optional über einen Proxy, mit integriertem Retry-Mechanismus
	 * für bekannte Rate-Limiting-Szenarien (z. B. RapidAPI-Fehler bei LinkedIn-Scraping). Sie unterstützt auch
	 * zusätzliche Parameter für Konfiguration, Protokollierung und zukünftige Caching-Mechanismen.
	 *
	 * Besondere Merkmale:
	 * - Nutzung eines Proxys bei Bedarf (`proxied`)
	 * - Spezielle Behandlung von 429-Fehlern (Rate-Limit) durch automatisches Wiederholen nach Delay
	 * - Erkennung typischer Fehlernachrichten von RapidAPI und erneute Anfrage nach definierter Wartezeit
	 * - Logging der Anfrageparameter und der Antwortzeit, sofern `this.logging` aktiviert ist
	 *
	 * @template R - Typ der erwarteten Antwortdaten
	 *
	 * @param url - Die Ziel-URL für die Anfrage
	 * @param headers - Optionale HTTP-Header (z. B. Authorization)
	 * @param params - Optionale Query-Parameter
	 * @param companyId - ID des Unternehmens (für Kontext oder Logging)
	 * @param listId - Optionale ID einer zugehörigen Liste
	 * @param application - Anwendungstyp (für spätere Kostenberechnung etc.)
	 * @param proxied - Gibt an, ob die Anfrage über einen Proxy gesendet werden soll
	 * @param ignoreCache - Wird derzeit nicht verwendet (Platzhalter für zukünftiges Caching)
	 * @param retryMechanism - Wenn true, wird bei Rate-Limiting automatisch erneut versucht
	 * @param config - Zusätzliche Axios-Konfigurationen (z. B. Timeout)
	 * @param model - Optionaler Modellname für spätere Validierung
	 * @param referenceId - Referenz-ID für Logging oder Nachverfolgung
	 *
	 * @returns Ein Promise mit einem `HttpResponseDTO`:
	 * - `{ success: true, data: ... }` bei erfolgreicher Antwort
	 * - `{ success: false, error: ... }` bei Fehler
	 */
	async getCached<R>({
		url,
		headers,
		params,
		companyId,
		listId,
		application,
		proxied,
		ignoreCache,
		retryMechanism,
		config,
		model,
		referenceId,
	}: {
		url: string;
		headers?: AxiosRequestHeaders;
		params?: object;
		companyId: number;
		listId?: number;
		application?: ApiApplications;
		proxied?: boolean;
		ignoreCache?: boolean;
		retryMechanism?: boolean;
		config?: AxiosRequestConfig;
		model?: string;
		referenceId?: number;
	}): Promise<HttpResponseDTO<R>> {
		this.logging && this.logger.log({ params }, `GET Request ${url}`);
		const start = Date.now();

		try {
			const obs = this.httpService
				.get<AxiosResponse<R>>(url, {
					httpAgent: proxied ? new HttpsProxyAgent(this.proxyUrl) : undefined,
					headers,
					params,
					timeout: 30000,
					...config,
				})
				.pipe(
					map((resp) => resp.data),
					catchError((err) => throwError(() => err))
				);

			const res = await lastValueFrom(obs);

			this.logging &&
				this.logger.log({ timeElapsed: start - Date.now(), cached: false }, `GET Response ${url}`);

			try {
				if (
					url.includes("linkedin-bulk-data-scraper.p.rapidapi.com") &&
					(res as any)?.message?.includes("No free account spotted. Please inform developer team.")
				) {
					this.logger.log(`429 - RATELIMIT for url: ${url} - Retrying in ${5 * 60} seconds`);
					await new Promise((resolve) => setTimeout(resolve, 5 * 60 * 1000));

					return this.getCached({
						url,
						headers,
						params,
						companyId,
						listId,
						application,
						proxied,
						ignoreCache,
						retryMechanism,
						model,
						referenceId,
					});
				}

				if (
					url.includes("linkedin-data-api.p.rapidapi.com") &&
					(res as any)?.message?.includes(
						"The request was blocked by LinkedIn due to too many requests"
					)
				) {
					this.logger.log(`429 - RATELIMIT for url: ${url} - Retrying in ${15} seconds`);
					await new Promise((resolve) => setTimeout(resolve, 15 * 1000));

					return this.getCached({
						url,
						headers,
						params,
						companyId,
						listId,
						application,
						proxied,
						ignoreCache,
						retryMechanism,
						model,
						referenceId,
					});
				}

				return {
					success: true,
					data: res.data as R,
				};
			} catch (e) {
				this.logger.error(e.message, e.stack, "ERROR");
			}
		} catch (error) {
			let retryAfter = error?.response?.headers["retry-after"]
				? +error.response.headers["retry-after"]
				: 15;

			if (retryMechanism && error.response?.status === 429) {
				// Sonderfall: RapidAPI verwendet fälschlich Statuscode 500 bei Rate-Limits
				if (
					error.response?.data?.status === 500 &&
					url.includes("https://linkedin-bulk-data-scraper.p.rapidapi.com")
				) {
					return {
						success: false,
						error,
					};
				}

				if (url.includes("https://linkedin-bulk-data-scraper.p.rapidapi.com")) {
					retryAfter = 1;
				}

				this.logger.log(`429 - RATELIMIT for url: ${url} - Retrying in ${retryAfter} seconds`);
				await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));

				return this.getCached({
					url,
					headers,
					params,
					companyId,
					listId,
					application,
					proxied,
					ignoreCache,
					retryMechanism,
					model,
					referenceId,
				});
			}

			this.logger.warn({ message: error.message, url }, `GET Error Response`);

			return {
				success: false,
				error,
			};
		}
	}

	//cut
	/**
	 * Funktion: get
	 *
	 * Führt eine einfache GET-Anfrage aus und gibt das Ergebnis als DTO zurück.
	 * Im Fehlerfall wird `success: false` zurückgegeben.
	 *
	 * @param url - Die URL, an die die Anfrage gesendet wird
	 * @param headers - Optionale HTTP-Header
	 * @param params - Optionale Query-Parameter
	 * @returns Promise mit `HttpResponseDTO`, das entweder Daten oder einen Fehler enthält
	 */
	async get<R>(
		url: string,
		headers?: AxiosRequestHeaders,
		params?: object
	): Promise<HttpResponseDTO<R>> {
		const start = Date.now();

		try {
			const res = await this.httpService
				.get<AxiosResponse<R>>(url, {
					headers,
					params,
				})
				.toPromise();

			this.logging && this.logger.log({ timeElapsed: start - Date.now() }, `GET Response ${url}`);

			return {
				success: true,
				data: res.data as R,
			};
		} catch (error) {
			this.logger.warn(
				{
					response: error.message,
					timeElapsed: start - Date.now(),
				},
				`GET Error Response ${url}`
			);

			return {
				success: false,
				error,
			};
		}
	}

	/**
	 * Funktion: postCached
	 *
	 * Führt eine POST-Anfrage aus, optional mit Retry-Mechanismus bei bekannten Fehlern.
	 * Diese Methode ist für APIs gedacht, bei denen manuelle Caching-/Retry-Kontrolle erforderlich ist.
	 *
	 * @param url - Ziel-URL der POST-Anfrage
	 * @param data - Nutzlast der Anfrage
	 * @param options - Optionale Header oder Parameter
	 * @param timeout - Optionaler Timeout-Wert (Standard: 3 Minuten)
	 * @param retryMechanism - Bei true wird nach Fehlern erneut versucht
	 * @param companyId - Für Logging oder späteres Reporting
	 * @param listId - Optionale Listen-ID
	 * @param application - Anwendungstyp (für spätere Kostenberechnung)
	 * @param model - Modellname, z. B. für Validierung
	 * @param referenceId - Referenzwert (z. B. für Nachverfolgung)
	 * @param ignoreCache - Wird nicht verwendet, vorgesehen für zukünftiges Caching
	 * @returns Promise mit `HttpResponseDTO` Ergebnis
	 */
	async postCached<T, R extends object>({
		url,
		data,
		options,
		retryMechanism,
		timeout,
		companyId,
		listId,
		application,
		model,
		referenceId,
		ignoreCache,
	}: {
		url: string;
		data: T;
		options?: {
			headers?: AxiosRequestHeaders;
			params?: object;
		};
		timeout?: number;
		retryMechanism?: boolean;
		companyId: number;
		listId?: number;
		application?: ApiApplications;
		model: string;
		referenceId: number;
		ignoreCache?: boolean;
	}): Promise<HttpResponseDTO<R>> {
		const start = Date.now();

		const requestProperties: HttpRequestDTO = {
			method: "post",
			url,
			data,
			options,
		};

		try {
			const obs = this.httpService
				.post<AxiosResponse<R>>(url, data, {
					...requestProperties.options,
					timeout: timeout ?? 180000,
				})
				.pipe(
					map((resp) => resp.data),
					catchError((err) => throwError(() => err))
				);

			const res = await lastValueFrom(obs);

			this.logging &&
				this.logger.log({ timeElapsed: start - Date.now(), cached: false }, `POST Response ${url}`);

			return {
				success: true,
				data: res.data as R,
			};
		} catch (error) {
			if (
				retryMechanism &&
				error?.response?.data?.message === "No free account spotted. Please inform developer team."
			) {
				const retryAfter = error?.response?.headers["retry-after"]
					? +error.response.headers["retry-after"]
					: 5 * 60;

				this.logging &&
					this.logger.log(`429 - RATELIMIT for url: ${url}`, `Retrying in ${retryAfter} seconds`);

				await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));

				return this.postCached({
					url,
					data,
					options,
					retryMechanism: false,
					companyId,
					listId,
					application,
					model,
					referenceId,
				});
			}
		}
	}

	/**
	 * Funktion: delete
	 *
	 * Führt eine DELETE-Anfrage aus und gibt Erfolg oder Fehler zurück.
	 *
	 * @param url - Ziel-URL der Anfrage
	 * @param options - Optional: Header, Parameter, Basic-Auth
	 * @returns Promise mit `HttpResponseDTO` mit Erfolgs- oder Fehlermeldung
	 */
	async delete<R extends object>({
		url,
		options,
	}: {
		url: string;
		options?: {
			headers?: AxiosRequestHeaders;
			params?: object;
			auth?: AxiosBasicCredentials;
		};
	}): Promise<HttpResponseDTO<R>> {
		const { headers, params, auth } = options ?? {};

		this.logging && this.logger.log({ headers, params }, `DELETE Request ${url}`);
		const start = Date.now();

		try {
			const res = await this.httpService
				.delete<AxiosResponse<R>>(url, {
					headers,
					params,
					auth,
				})
				.toPromise();

			this.logging &&
				this.logger.log(
					{ response: res, timeElapsed: start - Date.now() },
					`DELETE Response ${url}`
				);

			return {
				success: true,
				data: res.data as R,
			};
		} catch (error) {
			this.logger.warn(
				{
					response: error,
					timeElapsed: start - Date.now(),
				},
				`DELETE Error Response ${url}`
			);

			return {
				success: false,
				error,
			};
		}
	}

	/**
	 * Funktion: post
	 *
	 * Führt eine POST-Anfrage mit optionalem Retry über BullMQ aus.
	 *
	 * @param url - Ziel-URL der Anfrage
	 * @param data - Nutzlast der Anfrage
	 * @param options - Header, Parameter, Authentifizierung
	 * @param retryMechanism - Wenn true, wird nach Fehlern retry über Retry-Queue aktiviert
	 * @param retryJobOptions - Optionen für Retry-Queue
	 * @returns Promise mit `HttpResponseDTO`, inkl. Erfolg oder Fehler
	 */
	async post<T, R extends object>({
		url,
		data,
		options,
		retryJobOptions,
		retryMechanism = false,
	}: {
		url: string;
		data: T;
		options?: {
			headers?: AxiosRequestHeaders;
			params?: object;
			auth?: AxiosBasicCredentials;
		};
		retryMechanism?: boolean;
		retryJobOptions?: JobsOptions;
	}): Promise<HttpResponseDTO<R>> {
		const { headers, params } = options ?? {};

		this.logging && this.logger.log({ request: data, headers, params }, `POST Request ${url}`);
		const start = Date.now();

		const requestProperties: HttpRequestDTO = {
			method: "post",
			url,
			data,
			options,
		};

		try {
			const res = await this.httpService
				.post<AxiosResponse<R>>(url, data, requestProperties.options)
				.toPromise();

			this.logging &&
				this.logger.log({ response: res, timeElapsed: start - Date.now() }, `POST Response ${url}`);

			return {
				success: true,
				data: res.data as R,
			};
		} catch (error) {
			if (retryMechanism) {
				await this.parseErrorForRetry(error, requestProperties, retryJobOptions);
			}

			this.logger.warn(
				{
					response: error.message,
					timeElapsed: start - Date.now(),
				},
				`POST Error Response ${url}`
			);

			return {
				success: false,
				error,
			};
		}
	}

	/**
	 * Funktion: isValid
	 *
	 * Validiert die Struktur eines übergebenen Objekts mittels `class-validator`.
	 * Wird meist nach einer HTTP-Antwort eingesetzt, um sicherzustellen,
	 * dass das empfangene Objekt dem erwarteten DTO entspricht.
	 *
	 * @param url - URL für Logging-Zwecke
	 * @param user - Objekt, das validiert werden soll
	 * @throws Error bei Validierungsfehlern mit entsprechender Fehlermeldung
	 */
	async isValid<T extends object>(url, user: T): Promise<void> {
		const errors = await this.validator.validate(user);

		if (errors.length) {
			const error = `Validation error ${errors.join(";")}`;
			this.logger.error({ error }, `Received invalid response from ${url}`);
			throw new Error(error);
		}
	}

	/**
	 * Funktion: buildBasicAuth
	 *
	 * Erstellt einen HTTP Basic Auth Header basierend auf Benutzername und Passwort.
	 *
	 * @param username - Benutzername
	 * @param password - Optionales Passwort
	 * @returns Basic Auth Header als Base64-String
	 */
	buildBasicAuth(username: string, password?: string) {
		return "Basic " + Buffer.from(username + ":" + password || "").toString("base64");
	}
}
