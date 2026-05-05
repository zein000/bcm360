import { Node } from "@xyflow/react"; // Assuming this is the correct import path

import { PhaseData } from "./NodeDataTyps"; // Assuming this is the correct import path

export function autoLayoutVertical(nodes: Node<PhaseData>[]): Node<PhaseData>[] {
	if (!nodes || nodes.length === 0) {
		return [];
	}

	const nodeMap = new Map<string, Node<PhaseData>>();

	nodes.forEach((node) => nodeMap.set(node.id, node));

	// Adjacency list (nodeId -> childrenIds)
	const adj = new Map<string, string[]>();
	// Reverse adjacency list (nodeId -> parentIds) - useful for some graph algorithms
	const revAdj = new Map<string, string[]>();
	// In-degree of each node (number of incoming edges)
	const inDegree = new Map<string, number>();

	// Initialize graph structures
	nodes.forEach((node) => {
		adj.set(node.id, []);
		revAdj.set(node.id, []);
		inDegree.set(node.id, 0);
	});

	// Build adjacency list, reverse adjacency list, and in-degrees
	nodes.forEach((node) => {
		(node.data.decisionOptions || []).forEach((option) => {
			if (option.phaseId != null) {
				const targetNodeId = option.phaseId.toString();

				// Ensure the target node actually exists in the provided nodes
				if (nodeMap.has(targetNodeId)) {
					adj.get(node.id)?.push(targetNodeId);
					revAdj.get(targetNodeId)?.push(node.id);
					inDegree.set(targetNodeId, (inDegree.get(targetNodeId) || 0) + 1);
				}
			}
		});
	});

	const yInitial = 100; // Initial Y-coordinate for nodes at the top level
	const ySpacing = 300; // Vertical spacing between nodes in the same lane/level
	const xLaneSpacing = 400; // Horizontal spacing between different vertical lanes
	let nextXForNewLane = 200; // Tracks the X-coordinate to assign to the next new lane

	// --- Pass 1: Calculate Y levels (longest path from a source) ---
	// This ensures nodes are placed at a Y position consistent with their depth in the graph.
	const nodeYLevel = new Map<string, number>(); // Stores level (0, 1, 2...) for each node
	const queueForYLevel: string[] = [];
	const tempInDegreeForY = new Map(inDegree); // Use a temporary copy for this pass

	nodes.forEach((node) => {
		nodeYLevel.set(node.id, 0); // Initialize all levels to 0
		if (tempInDegreeForY.get(node.id) === 0) {
			queueForYLevel.push(node.id); // Add source nodes to the queue
		}
	});

	let head = 0;

	while (head < queueForYLevel.length) {
		const uId = queueForYLevel[head++];
		const currentLevelU = nodeYLevel.get(uId)!;

		(adj.get(uId) || []).forEach((vId) => {
			// Update level of vId if the path through uId provides a greater depth
			nodeYLevel.set(vId, Math.max(nodeYLevel.get(vId)!, currentLevelU + 1));

			tempInDegreeForY.set(vId, tempInDegreeForY.get(vId)! - 1);
			if (tempInDegreeForY.get(vId) === 0) {
				queueForYLevel.push(vId); // Add node to queue once all its predecessors are processed
			}
		});
	}
	// Note: If the graph contains cycles, this Kahn's algorithm based leveling might not process all nodes
	// or assign them final levels correctly. This algorithm assumes a DAG, typical for phase flows.

	// --- Pass 2: DFS for X positions based on lanes, using pre-calculated Y levels ---
	// Stores the final calculated X and Y positions for each node
	const finalNodePositions = new Map<string, { x: number; y: number }>();
	// Tracks visited nodes during this DFS pass to avoid redundant processing for X assignment
	const visitedNodesForX = new Set<string>();
	// Stores the assigned X-coordinate for the head of a "lane"
	// Key: laneHeadNodeId, Value: x-coordinate
	const xForLaneHead = new Map<string, number>();

	/**
	 * Performs a Depth First Search to assign X-coordinates.
	 * Uses pre-calculated Y levels for vertical positioning.
	 * @param nodeId The ID of the current node to process.
	 * @param laneHeadNodeId The ID of the node that defines the X-coordinate for the current vertical lane.
	 */
	function dfsLayoutForX(nodeId: string, laneHeadNodeId: string) {
		const node = nodeMap.get(nodeId);

		if (!node) {
			return;
		} // Should not happen if nodeMap is correct

		// If this node's X has already been set by a previous DFS path (e.g., a merge point),
		// do not re-assign its X. Its X is determined by the first "lane-defining" path that reaches it.
		if (visitedNodesForX.has(nodeId)) {
			return;
		}

		visitedNodesForX.add(nodeId);

		let xPos: number;

		// Determine the X-coordinate for the current node.
		// It's based on the X-coordinate assigned to its laneHeadNodeId.
		if (xForLaneHead.has(laneHeadNodeId)) {
			xPos = xForLaneHead.get(laneHeadNodeId)!;
		} else {
			// This laneHeadNodeId is being encountered for the first time as a lane head.
			// Assign it a new X-coordinate from the next available slot.
			xPos = nextXForNewLane;
			xForLaneHead.set(laneHeadNodeId, xPos);
			nextXForNewLane += xLaneSpacing; // Increment for the next new lane
		}

		// Calculate Y-position using the pre-calculated level.
		const yPos = yInitial + (nodeYLevel.get(nodeId) || 0) * ySpacing;

		finalNodePositions.set(nodeId, { x: xPos, y: yPos });

		const children = adj.get(nodeId) || [];
		// The order of children can matter for which child continues the lane vs. forks.
		// This assumes the order in `adj` (from `decisionOptions`) is intentional.
		// If specific sorting is needed (e.g., by some data property):
		// const sortedChildren = [...children].sort((aId, bId) => { /* custom sort logic */ });

		children.forEach((childId, index) => {
			// The first child continues the current lane (inherits laneHeadNodeId).
			// Subsequent children fork off and start their own new lanes (childId becomes new laneHeadNodeId).
			const childLaneHeadNodeId: string = index === 0 ? laneHeadNodeId : childId;

			dfsLayoutForX(childId, childLaneHeadNodeId);
		});
	}

	// Identify all source nodes (nodes with in-degree 0) to start the X-layout DFS.
	const sourceNodesForX: string[] = [];

	nodes.forEach((node) => {
		if ((inDegree.get(node.id) || 0) === 0) {
			sourceNodesForX.push(node.id);
		}
	});

	// Optional: Sort sourceNodesForX if a specific horizontal order of the main (top-level) branches is desired.
	// For example, to sort by a node's name or creation date:
	// sourceNodesForX.sort((aId, bId) => {
	//     const nodeA = nodeMap.get(aId)?.data?.name || '';
	//     const nodeB = nodeMap.get(bId)?.data?.name || '';
	//     return nodeA.localeCompare(nodeB);
	// });

	// Start DFS from each source node. Each source node is the head of its own lane.
	sourceNodesForX.forEach((sourceNodeId) => {
		dfsLayoutForX(sourceNodeId, sourceNodeId);
	});

	// Handle nodes not reached by DFS from source nodes (e.g., disconnected components or cycles).
	nodes.forEach((node) => {
		if (!visitedNodesForX.has(node.id)) {
			console.warn(
				`Node ${node.id} was not visited by primary X-layout DFS. Attempting to position it (may indicate a disconnected component or cycle).`
			);
			// Treat this unvisited node as the start of a new lane.
			dfsLayoutForX(node.id, node.id);

			// Ensure Y is also set if Y-leveling missed it (e.g. due to cycle or true disconnection)
			if (
				!finalNodePositions.has(node.id) ||
				(finalNodePositions.get(node.id)!.y === yInitial &&
					(nodeYLevel.get(node.id) || 0) === 0 &&
					(inDegree.get(node.id) || 0) > 0)
			) {
				const yPosFallback = yInitial + (nodeYLevel.get(node.id) || nodes.length) * ySpacing; // Fallback Y
				const currentX = finalNodePositions.get(node.id)?.x; // Use already assigned X if dfsLayoutForX set it

				// If X wasn't set because it was already in xForLaneHead from a different context
				let xToUse = currentX;

				if (xToUse === undefined) {
					if (xForLaneHead.has(node.id)) {
						// If it became a lane head but wasn't processed fully
						xToUse = xForLaneHead.get(node.id)!;
					} else {
						// Truly new lane
						xToUse = nextXForNewLane;
						xForLaneHead.set(node.id, xToUse); // Register it as a new lane
						nextXForNewLane += xLaneSpacing;
					}
				}

				finalNodePositions.set(node.id, { x: xToUse, y: yPosFallback });
			}
		}
	});

	// Construct the final array of nodes with updated positions.
	const resultNodes: Node<PhaseData>[] = nodes
		.map((originalNode) => {
			const pos = finalNodePositions.get(originalNode.id);

			if (pos) {
				return {
					...originalNode,
					position: { x: pos.x, y: pos.y },
					// Also update data.position if the node component internally uses it for rendering.
					data: { ...originalNode.data, position: { x: pos.x, y: pos.y } },
				};
			} else {
				// This fallback should ideally not be reached if all nodes are processed.
				console.error(
					`Node ${originalNode.id} was not positioned by the layout algorithm. Using a default fallback position.`
				);
				// Attempt to use Y level if available, otherwise a very basic fallback
				const fallbackY =
					yInitial +
					(nodeYLevel.get(originalNode.id) || nodes.indexOf(originalNode) || 0) * ySpacing;

				return { ...originalNode, position: { x: 10, y: fallbackY } }; // Basic fallback
			}
		})
		.sort((a, b) => {
			// Optional: sort final nodes for consistent output order if needed, e.g., by Y then X
			if (a.position.y !== b.position.y) {
				return a.position.y - b.position.y;
			}

			return a.position.x - b.position.x;
		});

	// Regarding the ambiguous part: "Der Shift auf der X-Achse soll dabei von der weitentferntesten Node für alle anderen übernommen werden."
	// This part of the request is not explicitly implemented with a distinct step because its meaning is unclear
	// in the context of the "branch is a line" requirement, which the current algorithm prioritizes.
	// The current layout creates vertical lines for branches and spaces them horizontally.
	// The "furthest node" could mean:
	//  a) The node that ends up with the largest X coordinate. Its X value defines the rightmost extent of the graph.
	//     The current algorithm assigns X values sequentially to new lanes as they are discovered.
	//  b) If it means that all nodes *within the same branch* as some "furthest node" (perhaps determined by another metric)
	//     should share a common X, this is already achieved by the lane logic (all nodes in a lane share the X of the laneHeadNodeId).
	//  c) If it means a global re-centering, re-scaling, or re-ordering of X-coordinates for *lanes* based on the properties of
	//     one "furthest node" or "furthest branch", that would require a more specific definition and likely a third layout pass.
	// For now, the X positions of lanes are primarily determined by the DFS traversal order when new branches are forked.

	return resultNodes;
}
