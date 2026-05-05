/* eslint-disable @typescript-eslint/no-explicit-any */
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";

import { Job as BullQJob } from "bullmq";

import { HttpResponseDTO } from "src/common/dto/http-response.dto";
import { HttpRequestDTO } from "src/http-client/dto/http-request.dto";
import { HttpClientService } from "src/http-client/http-client.service";

import { RETRY_QUEUE_JOBS_PREFIX, RETRY_QUEUE_NAME } from "./constants";

/**
 * Klasse: RetryProcessor
 *
 * Dieser Prozessor verarbeitet wiederholte HTTP-Anfragen, die in eine Warteschlange gestellt werden.
 * Die Anfragen werden erneut ausgeführt, falls sie fehlschlagen, um sie nach einer bestimmten Zeit erneut zu versuchen.
 *
 * Funktionsweise:
 * - Der Prozessor lauscht auf der `RETRY_QUEUE_NAME`-Warteschlange
 * - Wenn ein Job in die Warteschlange gestellt wird, wird `process` aufgerufen
 * - Bei Fehlern wird der Job erneut versucht, solange er fehlschlägt
 */
@Processor(RETRY_QUEUE_NAME)
export class RetryProcessor extends WorkerHost {
	private readonly logger = new Logger(RetryProcessor.name);

	constructor(private readonly httpClient: HttpClientService) {
		super();
	}

	/**
	 * Hauptmethode zur Verarbeitung eines Jobs in der Warteschlange.
	 * Der Job kann verschiedene Typen haben, aber in diesem Fall wird nur der `RETRY_QUEUE_JOBS_PREFIX` behandelt.
	 *
	 * @param job - Der aktuelle Job in der Warteschlange
	 */
	async process(job: BullQJob<any, any, string>) {
		let name = job.name;

		// Extrahiert den Job-Typ, wenn der Name mit einem Bindestrich enthält
		if (job.name?.includes("-")) {
			name = job.name.split("-")[0];
		}

		// Behandelt nur den speziellen Job-Typ
		switch (name) {
			case RETRY_QUEUE_JOBS_PREFIX:
				await this.handleRequest(job);
				break;
		}
	}

	/**
	 * Verarbeitet einen HTTP-Request-Job.
	 * Führt die HTTP-Anfrage (z.B. POST) aus und behandelt Fehler.
	 *
	 * @param job - Der Job mit den HTTP-Anfragedaten
	 */
	async handleRequest(job: BullQJob<HttpRequestDTO>) {
		const { url, data, options, method } = job.data;

		let result: HttpResponseDTO<unknown> | null = null;

		try {
			// Behandelt POST-Anfragen
			switch (method) {
				case "post": {
					result = await this.httpClient.post({ url, data, options });
					break;
				}
			}
		} catch (error) {
			// Wenn der Request fehlschlägt, wird das Ergebnis als Fehler markiert
			result = { success: false, error };

			// Fehler in den Logs ausgeben
			this.logger.error(error.message, error.stack);
		}

		// Falls der Request fehlschlägt, wird der Fehler erneut geworfen, um den Job erneut zu versuchen
		if (result.success === false) {
			throw result.error;
		}
	}
}
