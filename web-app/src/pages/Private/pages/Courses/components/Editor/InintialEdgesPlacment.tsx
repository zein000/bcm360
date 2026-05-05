import { Edge } from "@xyflow/react";

import { PhaseData } from "./NodeDataTyps";
import { createStyledEdge } from "./edgeUtils";

export function generateInitialEdges(content: PhaseData[] | undefined): Edge[] {
	if (!Array.isArray(content)) {
		return [];
	}

	const edges: Edge[] = [];

	content.forEach((element) => {
		if (!element || element.id == null) {
			return;
		}

		if (Array.isArray(element.decisionOptions)) {
			element.decisionOptions.forEach((option, index) => {
				if (!option || option.phaseId == null) {
					return;
				}

				edges.push(
					createStyledEdge({
						sourceId: element.id.toString(),
						targetId: option.phaseId.toString(),
						label: option.option || "",
						index,
					})
				);
			});
		}
	});

	return edges;
}
