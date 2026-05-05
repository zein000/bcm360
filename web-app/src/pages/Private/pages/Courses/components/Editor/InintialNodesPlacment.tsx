import { Node, Edge } from "@xyflow/react";

import { PhaseData } from "./NodeDataTyps";

export function generateInitialNodes(content: PhaseData[] | undefined): Node<PhaseData>[] {
	if (!Array.isArray(content)) {
		return [];
	}

	const initialNodes: Node<PhaseData>[] = [];

	content.forEach((element, index) => {
		if (!element || element.id == null) {
			return;
		}

		const savedPosition = element.position; // Position aus PhaseData holen (wenn vorhanden)

		initialNodes.push({
			id: element.id.toString(),
			type: "phaseNode",
			data: {
				...element,
			},
			position: savedPosition ?? {
				x: 100,
				y: 200 * index,
			},
		});
	});

	return initialNodes;
}

export function generateEdges(content: PhaseData[] | undefined): Edge[] {
	if (!Array.isArray(content)) {
		return [];
	}

	const edges: Edge[] = [];

	content.forEach((phase) => {
		if (phase.decisionOptions) {
			phase.decisionOptions.forEach((option, index) => {
				if (option.phaseId != null) {
					edges.push({
						id: `e${phase.id}-${option.phaseId}-${index}`,
						source: phase.id.toString(), // Kein Fehler mehr
						target: option.phaseId.toString(),
						label: option.option,
						animated: true,
						type: "smoothstep",
					});
				}
			});
		}
	});

	return edges;
}
