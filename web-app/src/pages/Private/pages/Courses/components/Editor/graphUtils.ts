import { Node } from "@xyflow/react";

// Diese Funktionen wurden aus ScenarioGraph.tsx verschoben
export const getNextAvailablePhaseDataId = (currentNodes: Node[]): number => {
	const existingIds = new Set(
		currentNodes.map((node) => node.data.id).filter((id): id is number => typeof id === "number")
	);
	let nextId = 1;

	while (existingIds.has(nextId)) {
		nextId++;
	}

	return nextId;
};

export const getNextAvailableNodeId = (currentNodes: Node[]): string => {
	const existingIds = new Set(
		currentNodes.map((node) => parseInt(node.id)).filter((id) => !isNaN(id))
	);
	let nextId = 1;

	while (existingIds.has(nextId)) {
		nextId++;
	}

	return nextId.toString();
};
