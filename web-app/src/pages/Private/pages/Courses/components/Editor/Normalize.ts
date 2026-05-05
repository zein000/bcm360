import { PhaseData } from "@/pages/Private/pages/Courses/components/Editor/NodeDataTyps"; // Pfad anpassen!

export function normalizePhaseDataContent(data: PhaseData): PhaseData {
	return {
		...data,
		content:
			typeof data.content === "object" && data.content !== null && "src" in data.content
				? (data.content as { src: string }).src
				: data.content,
	};
}
