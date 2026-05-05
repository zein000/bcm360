"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportScenarioProgressService = void 0;
const common_1 = require("@nestjs/common");
const marked = require("marked");
const playwright_1 = require("playwright");
const ProtocolKeyMessages_constant_1 = require("./constants/ProtocolKeyMessages.constant");
const cource_progress_info_dto_1 = require("./dto/cource-progress-info.dto");
const ExportFileTypes_enum_1 = require("./enum/ExportFileTypes.enum");
const ExportFormat_enum_1 = require("./enum/ExportFormat.enum");
let ExportScenarioProgressService = class ExportScenarioProgressService {
    constructor() { }
    async sendExportFileInResponse(res, scenarioProgress, settings) {
        const markdown = this.createMarkdown(new cource_progress_info_dto_1.CourseProgressInfoDto(scenarioProgress.dataValues), settings.format);
        const filenameSuffix = settings.format === ExportFormat_enum_1.ExportFormat.PROTOCOL_WITH_REVEALED_CONTENT ? "-erweitert" : "";
        const filename = `report-${scenarioProgress === null || scenarioProgress === void 0 ? void 0 : scenarioProgress.id}${filenameSuffix}`;
        if (settings.fileType === ExportFileTypes_enum_1.ExportFileTypes.PDF) {
            res.setHeader("Content-Disposition", `attachment; filename=${filename}.pdf`);
            res.setHeader("Content-Type", "application/pdf");
            const pdfBuffer = await this.convertMarkdownToPdf(markdown);
            res.send(pdfBuffer);
        }
        else {
            res.setHeader("Content-Disposition", `attachment; filename=${filename}.md`);
            res.setHeader("Content-Type", "text/markdown");
            res.send(markdown);
        }
    }
    async convertMarkdownToPdf(markdown) {
        let browser = null;
        try {
            browser = await playwright_1.chromium.launch({ headless: true });
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
        }
        catch (error) {
            console.error("Error generating PDF:", error);
            throw new Error("Failed to generate PDF");
        }
        finally {
            if (browser)
                await browser.close();
        }
    }
    formatDate(date) {
        return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}.${date.getFullYear()} ${date
            .getHours()
            .toString()
            .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    }
    getPeriod(createdAt, finishDate) {
        return `${this.formatDate(createdAt)} - ${finishDate
            .getHours()
            .toString()
            .padStart(2, "0")}:${finishDate.getMinutes().toString().padStart(2, "0")}`;
    }
    formatMessage(messageKey, messageOptions) {
        let template = ProtocolKeyMessages_constant_1.ProtocolKeyMessages[messageKey] || messageKey;
        Object.entries(messageOptions).forEach(([key, value]) => {
            template = template.replace(new RegExp(`{{${key}}}`, "g"), value);
        });
        return template;
    }
    getPassingTime(createdAt, finishDate) {
        const ms = finishDate.getTime() - createdAt.getTime();
        const s = Math.floor(ms / 1000) % 60;
        const m = Math.floor(ms / 60000) % 60;
        const h = Math.floor(ms / 3600000);
        return `${h > 0 ? `${h}h ` : ""}${m}m ${s}s`;
    }
    createMarkdown(data, format) {
        var _a, _b, _c, _d;
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
**Szenario Name:** ${(_a = data.course) === null || _a === void 0 ? void 0 : _a.name}  
**Gestartet von:** ${(_b = data === null || data === void 0 ? void 0 : data.user) === null || _b === void 0 ? void 0 : _b.firstName} ${(_c = data === null || data === void 0 ? void 0 : data.user) === null || _c === void 0 ? void 0 : _c.lastName} - ${(_d = data === null || data === void 0 ? void 0 : data.user) === null || _d === void 0 ? void 0 : _d.email}  

***

## 💬 Protokoll Geschichte

${chatHistory}
		`;
    }
    prepareChatHistory(data, format) {
        var _a, _b, _c;
        let events = [];
        const formatTimestamp = (timestamp) => "🕒 " + this.formatDate(new Date(timestamp));
        (_a = data.protocolHistories) === null || _a === void 0 ? void 0 : _a.forEach((ph) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            let messageText = (_a = ph.protocolMessages) === null || _a === void 0 ? void 0 : _a.message;
            const isAction = ProtocolKeyMessages_constant_1.ProtocolKeyMessages[messageText];
            let messageOptions = {};
            if ((_b = ph.protocolMessages) === null || _b === void 0 ? void 0 : _b.options) {
                try {
                    messageOptions = JSON.parse(ph.protocolMessages.options || "{}");
                }
                catch (_j) { }
                messageText = this.formatMessage(messageText, messageOptions);
            }
            else {
                messageText = ProtocolKeyMessages_constant_1.ProtocolKeyMessages[messageText] || messageText;
            }
            if (messageText) {
                events.push({
                    timestamp: ph.timestamp,
                    content: isAction
                        ? `🛠️ **${((_c = ph.user) === null || _c === void 0 ? void 0 : _c.firstName) || "Unbekannt"} ${((_d = ph.user) === null || _d === void 0 ? void 0 : _d.lastName) || ""}** (${((_e = ph.user) === null || _e === void 0 ? void 0 : _e.email) || "Keine E-Mail"})  
\`${formatTimestamp(ph.timestamp)}\`  
_${messageText}_  
`
                        : `💬 **${((_f = ph.user) === null || _f === void 0 ? void 0 : _f.firstName) || "Unbekannt"} ${((_g = ph.user) === null || _g === void 0 ? void 0 : _g.lastName) || ""}** (${((_h = ph.user) === null || _h === void 0 ? void 0 : _h.email) || "Keine E-Mail"})  
\`${formatTimestamp(ph.timestamp)}\`  
"${messageText}"  
`,
                });
            }
        });
        (_b = data.protocolHistories) === null || _b === void 0 ? void 0 : _b.forEach((ph) => {
            var _a, _b;
            if ((_a = ph.protocolDecisions) === null || _a === void 0 ? void 0 : _a.decision) {
                const voters = ((_b = ph.protocolDecisions.votedBy) === null || _b === void 0 ? void 0 : _b.length)
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
        (_c = data.users) === null || _c === void 0 ? void 0 : _c.forEach((user) => {
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
        if (format === ExportFormat_enum_1.ExportFormat.PROTOCOL_WITH_REVEALED_CONTENT && data.content) {
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
};
exports.ExportScenarioProgressService = ExportScenarioProgressService;
exports.ExportScenarioProgressService = ExportScenarioProgressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ExportScenarioProgressService);
//# sourceMappingURL=export-scenario-progress.service.js.map