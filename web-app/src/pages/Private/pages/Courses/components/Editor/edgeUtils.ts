import { Edge, MarkerType } from "@xyflow/react";

interface CreateStyledEdgeParams {
	sourceId: string;
	targetId: string;
	label?: string;
	index?: number;
}

export function createStyledEdge({
	sourceId,
	targetId,
	label = "",
	index = 0,
}: CreateStyledEdgeParams): Edge {
	return {
		id: `e-${sourceId}-${targetId}-${index}`, // eindeutige Edge-ID
		source: sourceId,
		target: targetId,
		label,
		type: "smoothstep", // oder dein eigener Edge-Type, falls du einen hast
		animated: true,
		markerEnd: {
			type: MarkerType.ArrowClosed,
			color: "#555",
		},
		style: {
			stroke: "#555", // Kantenfarbe
			strokeWidth: 1.5,
		},
		labelStyle: {
			fontSize: 12,
			fontWeight: 500,
		},
		labelBgStyle: {
			fillOpacity: 0.7,
		},
		labelBgPadding: [6, 4],
		labelBgBorderRadius: 5,
	};
}
