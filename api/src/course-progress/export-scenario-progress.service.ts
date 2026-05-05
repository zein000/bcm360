/**
 * Klasse: ExportScenarioProgressService
 *
 * Diese Serviceklasse ist für den Export von Szenario-Protokollen zuständig.
 * Sie wandelt Daten aus dem Kursfortschritt (`CourseProgress`) in ein Markdown-Dokument um
 * und bietet die Möglichkeit, dieses als `.md` oder `.pdf` Datei herunterzuladen.
 *
 * Dabei wird das Protokoll um Benutzeraktionen, Nachrichten, Entscheidungen und Inhalte ergänzt.
 * Für den PDF-Export wird `Playwright` verwendet, um HTML zu rendern und als PDF zu drucken.
 */

import { Injectable } from "@nestjs/common";
import { Response } from "express";
import * as marked from "marked"; // Markdown → HTML Konvertierung
import { chromium, Browser } from "playwright"; // Für PDF-Erzeugung
import { ProtocolKeyMessages } from "./constants/ProtocolKeyMessages.constant";
import { CourseProgressInfoDto } from "./dto/cource-progress-info.dto";
import { ExportScenarioReportDto } from "./dto/export-report.dto";
import { ExportFileTypes } from "./enum/ExportFileTypes.enum";
import { ExportFormat } from "./enum/ExportFormat.enum";
import CourseProgress from "./models/course-progress.model";

@Injectable()
export class ExportScenarioProgressService {
	constructor() {}

	/**
	 * Funktion: sendExportFileInResponse
	 *
	 * Wandelt ein Szenario-Protokoll in Markdown oder PDF um und sendet es als Download an den Client.
	 *
	 * @param res - HTTP-Response-Objekt zur Übertragung der Datei
	 * @param scenarioProgress - Kursfortschrittsdaten inklusive Protokolle & Inhalte
	 * @param settings - Einstellungen wie Export-Format und Dateityp (PDF/Markdown)
	 */
	async sendExportFileInResponse(
		res: Response,
		scenarioProgress: CourseProgress,
		settings: ExportScenarioReportDto
	) {
		const markdown = this.createMarkdown(
			new CourseProgressInfoDto(scenarioProgress.dataValues),
			settings.format
		);

		const filenameSuffix =
			settings.format === ExportFormat.PROTOCOL_WITH_REVEALED_CONTENT ? "-erweitert" : "";
		const filename = `report-${scenarioProgress?.id}${filenameSuffix}`;

		if (settings.fileType === ExportFileTypes.PDF) {
			res.setHeader("Content-Disposition", `attachment; filename=${filename}.pdf`);
			res.setHeader("Content-Type", "application/pdf");
			const pdfBuffer = await this.convertMarkdownToPdf(markdown);
			res.send(pdfBuffer);
		} else {
			res.setHeader("Content-Disposition", `attachment; filename=${filename}.md`);
			res.setHeader("Content-Type", "text/markdown");
			res.send(markdown);
		}
	}

	/**
	 * Funktion: convertMarkdownToPdf
	 *
	 * Wandelt ein Markdown-Dokument in ein formatiertes PDF um.
	 * Nutzt Playwright, um das Markdown als HTML zu rendern und zu drucken.
	 *
	 * @param markdown - Inhalt als Markdown-String
	 * @returns Buffer mit PDF-Daten
	 */
	private async convertMarkdownToPdf(markdown: string): Promise<Buffer> {
		let browser: Browser | null = null;

		try {
			browser = await chromium.launch({ headless: true });
			const page = await browser.newPage();

			const formattedHtml = `
				<html>
					<head>
						<style>
							/* Styles für PDF-Dokument */
							body {
								font-family: Arial, sans-serif;
								margin: 40px;
								line-height: 1.6;
							}
							h1, h2 { color: #333; }
							h2 { border-bottom: 2px solid #ddd; padding-bottom: 5px; margin-top: 40px; }
							p { margin: 10px 0; }
							.section, .content-block {
								margin-bottom: 20px;
								padding: 15px;
								border: 1px solid #ddd;
								border-radius: 8px;
								background-color: #f9f9f9;
							}
							pre {
								background: #f4f4f4;
								padding: 10px;
								border-radius: 5px;
								overflow-x: auto;
							}
						</style>
					</head>
					<body>
						${marked.parse(markdown)}
					</body>
				</html>`;

			await page.setContent(formattedHtml, { waitUntil: "load" });
			const pdfBuffer = await page.pdf({ format: "A4" });

			return Buffer.from(pdfBuffer);
		} catch (error) {
			console.error("Error generating PDF:", error);
			throw new Error("Failed to generate PDF");
		} finally {
			if (browser) await browser.close();
		}
	}

	// Hilfsfunktion zur Formatierung von Datum & Uhrzeit
	private formatDate(date: Date) {
		return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
			.toString()
			.padStart(2, "0")}.${date.getFullYear()} ${date
			.getHours()
			.toString()
			.padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
	}

	// Erstellt einen Zeitraum-String für Header
	private getPeriod(createdAt: Date, finishDate: Date) {
		return `${this.formatDate(createdAt)} - ${finishDate
			.getHours()
			.toString()
			.padStart(2, "0")}:${finishDate.getMinutes().toString().padStart(2, "0")}`;
	}

	// Ersetzt Platzhalter in Vorlagen mit realen Werten
	private formatMessage(messageKey: string, messageOptions: Record<string, any>): string {
		let template = ProtocolKeyMessages[messageKey] || messageKey;
		Object.entries(messageOptions).forEach(([key, value]) => {
			template = template.replace(new RegExp(`{{${key}}}`, "g"), value);
		});
		return template;
	}

	// Berechnet vergangene Zeitspanne
	private getPassingTime(createdAt: Date, finishDate: Date) {
		const ms = finishDate.getTime() - createdAt.getTime();
		const s = Math.floor(ms / 1000) % 60;
		const m = Math.floor(ms / 60000) % 60;
		const h = Math.floor(ms / 3600000);
		return `${h > 0 ? `${h}h ` : ""}${m}m ${s}s`;
	}

	/**
	 * Funktion: createMarkdown
	 *
	 * Generiert ein Markdown-Protokoll mit Kopfbereich und Chat-Historie.
	 *
	 * @param data - DTO mit allen Infos zum Kursfortschritt
	 * @param format - Format des Protokolls (normal oder mit Inhalt)
	 * @returns Markdown-String
	 */
	private createMarkdown(data: CourseProgressInfoDto, format: ExportFormat): string {
		const chatHistory = this.prepareChatHistory(data, format);

		const createdAt = new Date(data.createdAt);
		const finishDate = new Date(data.finishDate);

		return `
# 📜 **Szenario Protokoll**

***

## 🔖 Allgemeine Informationen
**ID:** ${data.id}  
**Letzte Phase ID:** ${data.finalPhaseId}  
**Zeitraum:** ${this.getPeriod(createdAt, finishDate)}  
**Dauer:** ${this.getPassingTime(createdAt, finishDate)}  
**Szenario Name:** ${data.course?.name}  
**Gestartet von:** ${data?.user?.firstName} ${data?.user?.lastName} - ${data?.user?.email}  

***

## 💬 Protokoll Geschichte

${chatHistory}
		`;
	}

	/**
	 * Funktion: prepareChatHistory
	 *
	 * Wandelt alle relevanten Informationen (Nachrichten, Entscheidungen, Useraktionen, Inhalte) in Markdown-Format um.
	 * Sortiert diese chronologisch.
	 *
	 * @param data - DTO mit vollständigem Szenarioverlauf
	 * @param format - Formatoptionen (inkl. Inhalte ja/nein)
	 * @returns Markdown-Teilbereich als String
	 */
	private prepareChatHistory(data: CourseProgressInfoDto, format: ExportFormat): string {
		let events: { timestamp: number; content: string }[] = [];

		const formatTimestamp = (timestamp: number) =>
			"🕒 " + this.formatDate(new Date(timestamp));

		// Nachrichten & Systemaktionen
		data.protocolHistories?.forEach((ph) => {
			let messageText = ph.protocolMessages?.message;
			const isAction = ProtocolKeyMessages[messageText];

			let messageOptions = {};
			if (ph.protocolMessages?.options) {
				try {
					messageOptions = JSON.parse(ph.protocolMessages.options || "{}");
				} catch {}
				messageText = this.formatMessage(messageText, messageOptions);
			} else {
				messageText = ProtocolKeyMessages[messageText] || messageText;
			}

			if (messageText) {
				events.push({
					timestamp: ph.timestamp,
					content: isAction
						? `🛠️ **${ph.user?.firstName || "Unbekannt"} ${ph.user?.lastName || ""}** (${ph.user?.email || "Keine E-Mail"})  
\`${formatTimestamp(ph.timestamp)}\`  
_${messageText}_  
`
						: `💬 **${ph.user?.firstName || "Unbekannt"} ${ph.user?.lastName || ""}** (${ph.user?.email || "Keine E-Mail"})  
\`${formatTimestamp(ph.timestamp)}\`  
"${messageText}"  
`,
				});
			}
		});

		// Entscheidungen
		data.protocolHistories?.forEach((ph) => {
			if (ph.protocolDecisions?.decision) {
				const voters = ph.protocolDecisions.votedBy?.length
					? ph.protocolDecisions.votedBy
							.map((u) => `- ${u.firstName} ${u.lastName} (${u.email})`)
							.join("\n")
					: "_Keine Abstimmungen verzeichnet._";

				events.push({
					timestamp: ph.timestamp,
					content: `✅ **Entscheidung getroffen**  
\`${formatTimestamp(ph.timestamp)}\`  

🗳️ **"${ph.protocolDecisions.decision}"** → *${ph.protocolDecisions.finalDecision}*  
👥 **Gewählt von:**  
${voters}  
`,
				});
			}
		});

		// Teilnehmer-Join/Leave
		data.users?.forEach((user) => {
			if (user.isAccepted && user.firstJoinTimeStamp) {
				events.push({
					timestamp: user.firstJoinTimeStamp,
					content: `🟢 **${user.firstName} ${user.lastName} dem Szenario beigetreten**  
\`${formatTimestamp(user.firstJoinTimeStamp)}\``,
				});
			}
			if (user.exitTimeStamp) {
				events.push({
					timestamp: user.exitTimeStamp,
					content: `🔴 **${user.firstName} ${user.lastName} hat das Szenario verlassen**  
\`${formatTimestamp(user.exitTimeStamp)}\``,
				});
			}
		});

		// Geteilte Inhalte (nur bei erweitertem Export)
		if (format === ExportFormat.PROTOCOL_WITH_REVEALED_CONTENT && data.content) {
			data.content.forEach((content) => {
				events.push({
					timestamp: content.timeStamp,
					content: `📜 **Inhalt in Phase ${content.stageNumber} geteilt**  
\`${formatTimestamp(content.timeStamp)}\`  
**Titel:** ${content.title}  
**Typ:** ${content.contentType}  

\`\`\`markdown
${content.content}
\`\`\`
`,
				});
			});
		}

		events.sort((a, b) => a.timestamp - b.timestamp);
		return events.map((e) => e.content).join("\n\n---\n\n");
	}
}
