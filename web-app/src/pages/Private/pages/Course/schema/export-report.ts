import { z } from "zod";

import {
	ExportFileTypes,
	ExportFormat,
} from "../../Analytics/components/ExportReportButtonWithModal";

export const ExportScenarioReportSchema = z.object({
	id: z.string(),
	fileType: z.nativeEnum(ExportFileTypes),
	format: z.nativeEnum(ExportFormat),
});

export type ExportScenarioReport = z.infer<typeof ExportScenarioReportSchema>;
