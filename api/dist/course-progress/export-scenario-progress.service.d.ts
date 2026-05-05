import { Response } from "express";
import { ExportScenarioReportDto } from "./dto/export-report.dto";
import CourseProgress from "./models/course-progress.model";
export declare class ExportScenarioProgressService {
    constructor();
    sendExportFileInResponse(res: Response, scenarioProgress: CourseProgress, settings: ExportScenarioReportDto): Promise<void>;
    private convertMarkdownToPdf;
    private formatDate;
    private getPeriod;
    private formatMessage;
    private getPassingTime;
    private createMarkdown;
    private prepareChatHistory;
}
