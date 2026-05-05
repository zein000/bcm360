import { Node } from "@xyflow/react";

import { PhaseData } from "./NodeDataTyps";

// Berechnet die Tiefe (Level) jedes Nodes im Graphen
function calculateDepths(graph: Map<number, number[]>, roots: number[]): Map<number, number> {
	const depths = new Map<number, number>();

	function dfs(nodeId: number, depth: number) {
		const currentDepth = depths.get(nodeId);

		if (currentDepth === undefined || depth > currentDepth) {
			depths.set(nodeId, depth);
		}

		const children = graph.get(nodeId) || [];

		for (const child of children) {
			dfs(child, depth + 1);
		}
	}

	for (const root of roots) {
		dfs(root, 0);
	}

	return depths;
}

export function autoLayoutHorizontal(nodes: Node<PhaseData>[]): Node<PhaseData>[] {
	const xGap = 250;
	const yGap = 160;

	const nodeMap = new Map<number, Node<PhaseData>>();

	nodes.forEach((node) => nodeMap.set(node.data.id, node));

	// Build graph (sourceId -> childrenIds)
	const graph = new Map<number, number[]>();

	for (const node of nodes) {
		const sourceId = node.data.id;
		const targets =
			node.data.decisionOptions
				?.map((opt) => opt.phaseId)
				.filter((id): id is number => id !== null) || [];

		graph.set(sourceId, targets);
	}

	// Find root nodes (nodes that are not target of any edge)
	const allIds = new Set(nodes.map((n) => n.data.id));

	for (const targets of graph.values()) {
		for (const t of targets) {
			allIds.delete(t);
		}
	}

	const roots = Array.from(allIds);

	// Calculate depth per node
	const depths = calculateDepths(graph, roots);

	// Group nodes by depth (layer)
	const layers = new Map<number, Node<PhaseData>[]>();

	for (const node of nodes) {
		const depth = depths.get(node.data.id) ?? 0;

		if (!layers.has(depth)) {
			layers.set(depth, []);
		}

		layers.get(depth)!.push(node);
	}

	// Position nodes: x based on depth, y spaced within each layer
	const positioned: Node<PhaseData>[] = [];

	for (const [depth, layerNodes] of layers.entries()) {
		layerNodes.forEach((node, idx) => {
			positioned.push({
				...node,
				position: { x: depth * xGap, y: idx * yGap },
			});
		});
	}

	return positioned;
}
