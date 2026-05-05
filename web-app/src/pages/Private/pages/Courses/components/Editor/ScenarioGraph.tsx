import {
	ReactFlow,
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
	Background,
	Controls,
	Edge,
	Node,
	OnConnect,
	OnEdgesChange,
	OnNodesChange,
	useReactFlow,
	ControlButton,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Stack } from "@mui/system";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, LayoutDashboard } from "lucide-react";

import { DecisionConfirmationTypes } from "@/pages/Private/pages/Course/enums/DecisionConfirmationTypes.enum";

import { useDnD } from "./DnDContext";
import PhaseNode from "./PhaseNode";
import { generateInitialEdges } from "./InintialEdgesPlacment";
import { generateInitialNodes } from "./InintialNodesPlacment";
import { createDefaultPhaseData, PhaseData } from "./NodeDataTyps";
import Sidebar from "./Sidebar";
import { createStyledEdge } from "./edgeUtils";
import { autoLayoutVertical } from "./autoLayoutVertical";
import { autoLayoutHorizontal } from "./autoLayoutHorizontal";
import { useUndoRedo } from "./useUndoRedo";

export type ScenarioGraphData = {
	Content: PhaseData[];
	Edges?: Edge[];
};

type ScenarioGraphProps = {
	data: ScenarioGraphData;
	courseId?: number;
	onNodeClick?: (event: React.MouseEvent, node: Node) => void;
	onPaneClick?: (event: React.MouseEvent) => void;
	onChange?: (updatedData: ScenarioGraphData) => void;
	onConnectionNodeSelect?: (node: Node<PhaseData>, updatedData: ScenarioGraphData) => void;
};

const getNextAvailablePhaseDataId = (currentNodes: Node[]): number => {
	const existingIds = new Set(
		currentNodes.map((node) => node.data.id).filter((id): id is number => typeof id === "number")
	);
	let nextId = 1;

	while (existingIds.has(nextId)) {
		nextId++;
	}

	return nextId;
};

const getNextAvailableNodeId = (currentNodes: Node[]): string => {
	const existingIds = new Set(
		currentNodes.map((node) => parseInt(node.id)).filter((id) => !isNaN(id))
	);
	let nextId = 1;

	while (existingIds.has(nextId)) {
		nextId++;
	}

	return nextId.toString();
};

const toPhaseData = (node: Node): PhaseData => ({
	...(node.data as PhaseData),
	position: node.position,
});

const truncateLabel = (label = "", maxLength = 60) => {
	if (label.length <= maxLength) {
		return label;
	}

	return `${label.substring(0, maxLength)}...`;
};

export function ScenarioGraph({
	data,
	courseId,
	onNodeClick,
	onPaneClick,
	onChange,
	onConnectionNodeSelect,
}: ScenarioGraphProps) {
	const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
	const { screenToFlowPosition, fitView } = useReactFlow();
	const [type, setType] = useDnD();
	const prevDataRef = useRef<string>("");
	const { t } = useTranslation();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const ts = (key: string) => t(`courses.${key}`);
	const [showDecisionLabels, setShowDecisionLabels] = useState(true);
	const isConnecting = useRef(false);

	const isInitialized = useRef(false);
	const localStorageKey = `scenario-draft-${courseId}`;

	const getInitialState = () => {
		if (!courseId) {
			return null;
		}

		try {
			const savedData = localStorage.getItem(localStorageKey);

			if (savedData) {
				const parsed = JSON.parse(savedData);

				if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
					isInitialized.current = true;

					return parsed;
				}
			}
		} catch (e) {
			console.error("Fehler beim Laden des Entwurfs:", e);
		}

		return null;
	};

	const savedState = getInitialState();

	const nodesUndo = useUndoRedo<Node<PhaseData>[]>(savedState?.nodes ?? []);
	const edgesUndo = useUndoRedo<Edge[]>(savedState?.edges ?? []);

	const nodes = nodesUndo.value;
	const edges = edgesUndo.value;
	const setNodes = nodesUndo.set;
	const setEdges = edgesUndo.set;
	const setNodesRef = useRef(setNodes);
	const setEdgesRef = useRef(setEdges);

	setNodesRef.current = setNodes;
	setEdgesRef.current = setEdges;

	useEffect(() => {
		// Wenn die Komponente bereits initialisiert wurde, brechen wir sofort ab.
		if (isInitialized.current) {
			return;
		}

		// Wenn ein gespeicherter Zustand aus dem localStorage vorhanden ist, wird dieser geladen.
		if (savedState) {
			setNodes(savedState.nodes);
			setEdges(savedState.edges);
			isInitialized.current = true; // Markieren als initialisiert.
		}
		// Andernfalls, wenn Initialdaten über Props kommen, werden diese verwendet.
		else if (data?.Content) {
			setNodes(generateInitialNodes(data.Content));
			setEdges(generateInitialEdges(data.Content));
			isInitialized.current = true; // Markieren als initialisiert.
		}
	}, [data, savedState, setNodes, setEdges]);

	useEffect(() => {
		if (isInitialized.current && courseId) {
			const stateToSave = { nodes, edges };

			localStorage.setItem(localStorageKey, JSON.stringify(stateToSave));
		}
	}, [nodes, edges, courseId, localStorageKey]);

	const undo = () => {
		nodesUndo.undo();
		edgesUndo.undo();
	};

	const redo = () => {
		nodesUndo.redo();
		edgesUndo.redo();
	};

	type LayoutType = "Horizontal" | "Vertical";
	const [layoutType, setLayoutType] = useState<LayoutType>("Vertical");

	const handleAutoLayout = () => {
		let newNodes;

		if (layoutType === "Vertical") {
			newNodes = autoLayoutVertical(nodes);
			setLayoutType("Horizontal");
		} else {
			newNodes = autoLayoutHorizontal(nodes);
			setLayoutType("Vertical");
		}

		setNodes(newNodes);
		setTimeout(() => {
			fitView({ padding: 0.05 });
		}, 50);
	};

	useEffect(() => {
		const currentData: ScenarioGraphData = {
			Content: nodes.map(toPhaseData),
			Edges: edges,
		};

		try {
			const serialized = JSON.stringify(currentData);

			if (serialized !== prevDataRef.current) {
				prevDataRef.current = serialized;
				onChange?.(currentData);
			}
		} catch (err) {
			console.error(
				"Fehler beim Serialisieren von currentData (z. B. durch zyklische Referenzen):",
				err
			);
		}
	}, [nodes, edges, onChange]);

	const onNodeDragStop = useCallback(
		(event: React.MouseEvent, node: Node) => {
			const newNodes = nodes.map((n) =>
				n.id === node.id
					? {
							...n,
							position: node.position,
							data: {
								...n.data,
								position: node.position,
							},
					  }
					: n
			);

			setNodesRef.current(newNodes as Node<PhaseData>[]);
		},
		[nodes]
	);

	const onNodesChange: OnNodesChange = useCallback(
		(changes) => {
			const newNodes = applyNodeChanges(changes, nodes);

			setNodesRef.current(newNodes as Node<PhaseData>[]);
		},
		[nodes]
	);

	const onEdgesChange: OnEdgesChange = useCallback(
		(changes) => {
			const edgesToRemove = changes.reduce((acc, change) => {
				if (change.type === "remove") {
					const edge = edges.find((e) => e.id === change.id);

					if (edge) {
						acc.push(edge);
					}
				}

				return acc;
			}, [] as Edge[]);

			if (edgesToRemove.length > 0) {
				const sourceNodeUpdates = new Map<string, Partial<PhaseData>>();

				for (const edge of edgesToRemove) {
					const sourceNode = nodes.find((n) => n.id === edge.source);
					const targetNode = nodes.find((n) => n.id === edge.target);

					if (sourceNode && targetNode) {
						const currentData = sourceNodeUpdates.get(sourceNode.id) || sourceNode.data;
						const newDecisionOptions = (currentData.decisionOptions || []).filter(
							(opt) => opt.phaseId !== targetNode.data.id
						);
						let updatedData: Partial<PhaseData> = {
							...currentData,
							decisionOptions: newDecisionOptions,
						};

						if (newDecisionOptions.length === 0) {
							updatedData = {
								...updatedData,
								decisionOptions: undefined,
								decisionName: undefined,
								timeLimit: undefined,
								timeLeftDecisionId: undefined,
								confirmationRequired: undefined,
							};
						}

						sourceNodeUpdates.set(sourceNode.id, updatedData);
					}
				}

				setNodes((currentNodes) =>
					currentNodes.map((n) => {
						if (sourceNodeUpdates.has(n.id)) {
							return { ...n, data: { ...n.data, ...sourceNodeUpdates.get(n.id) } };
						}

						return n;
					})
				);
			}

			const newEdges = applyEdgeChanges(changes, edges);

			setEdges(newEdges);
		},
		[edges, nodes, setNodes, setEdges]
	);

	const onConnect: OnConnect = useCallback(
		(connection) => {
			if (!connection.source || !connection.target) {
				return;
			}

			const sourceNode = nodes.find((node) => node.id === connection.source);

			if (sourceNode?.data.decisionOptions && sourceNode.data.decisionOptions.length >= 4) {
				return;
			}

			const label = ts("newOption");
			const newEdgeWithoutId = createStyledEdge({
				sourceId: connection.source,
				targetId: connection.target,
				label: showDecisionLabels ? truncateLabel(String(label)) : "",
			});
			const newEdge = {
				...newEdgeWithoutId,
				id: `${connection.source}-${connection.target}`,
			};
			const edgeWithOriginalLabel = {
				...newEdge,
				originalLabel: label,
			};
			const newEdges = addEdge(edgeWithOriginalLabel, edges);
			const newNodes = nodes.map((node: Node<PhaseData>) => {
				if (node.id !== connection.source) {
					return node;
				}

				const data = node.data as PhaseData;

				return {
					...node,
					data: {
						...data,
						decisionName: data.decisionName || ts("decisionTitle"),
						confirmationRequired: data.confirmationRequired ?? DecisionConfirmationTypes.NONE,
						decisionOptions: [
							...(data.decisionOptions || []),
							{ option: label, phaseId: parseInt(connection.target) },
						],
					},
				};
			});

			setEdgesRef.current(newEdges);
			setNodesRef.current(newNodes);
			const updatedSourceNode = newNodes.find((n) => n.id === connection.source);
			const updatedData = {
				Content: newNodes.map(toPhaseData),
				Edges: newEdges,
			};

			if (updatedSourceNode) {
				onConnectionNodeSelect?.(updatedSourceNode, updatedData);
			}
		},
		[nodes, showDecisionLabels, edges, onConnectionNodeSelect, ts]
	);

	const onDragOver = useCallback((event: React.DragEvent) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	}, []);

	const onDrop = useCallback(
		(event: React.DragEvent) => {
			event.preventDefault();
			if (!type) {
				return;
			}

			const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
			const phaseDataId = getNextAvailablePhaseDataId(nodes);
			const newPhaseData = createDefaultPhaseData(t, { id: phaseDataId, position });
			const newNodeId = getNextAvailableNodeId(nodes);
			const newNode: Node = {
				id: newNodeId,
				type: "phaseNode",
				position,
				data: newPhaseData,
			};
			const newNodes = [...nodes, newNode];

			setNodesRef.current(newNodes as Node<PhaseData>[]);
			onChange?.({
				Content: newNodes.map(toPhaseData),
				Edges: edges,
			});
			setType(null);
		},
		[type, screenToFlowPosition, nodes, t, onChange, edges, setType]
	);

	useEffect(() => {
		const allPhaseData = nodes.map((node) => node.data);
		const newEdges = generateInitialEdges(allPhaseData);
		const oldEdgesString = JSON.stringify(
			edges.map((e) => ({
				source: e.source,
				target: e.target,
				//eslint-disable-next-line @typescript-eslint/no-explicit-any
				label: (e as any).originalLabel || e.label,
			}))
		);
		const newEdgesString = JSON.stringify(
			newEdges.map((e) => ({ source: e.source, target: e.target, label: e.label }))
		);

		if (oldEdgesString !== newEdgesString) {
			setEdges(
				newEdges.map((edge) => {
					const originalLabel = edge.label ?? "Entscheidung";

					return {
						...edge,
						originalLabel,
						label: showDecisionLabels ? truncateLabel(String(originalLabel)) : "",
					};
				})
			);
		}
	}, [nodes, setEdges, edges, showDecisionLabels]);

	const [hasFitViewRun, setHasFitViewRun] = useState(false);

	useEffect(() => {
		if (!hasFitViewRun && nodes.length > 0) {
			setTimeout(() => {
				fitView({ padding: 0.2 });
				setHasFitViewRun(true);
			}, 0);
		}
	}, [nodes, hasFitViewRun, fitView]);

	useEffect(() => {
		const newEdges = edges.map((edge) => {
			//eslint-disable-next-line @typescript-eslint/no-explicit-any
			const originalLabel = (edge as any).originalLabel ?? edge.label ?? "Entscheidung";

			return {
				...edge,
				originalLabel,
				label: showDecisionLabels ? truncateLabel(String(originalLabel)) : "",
			};
		});
		const oldEdgesString = JSON.stringify(edges);
		const newEdgesString = JSON.stringify(newEdges);

		if (oldEdgesString !== newEdgesString) {
			setEdges(newEdges);
		}

		console.count("Edges updated");
	}, [showDecisionLabels, edges, setEdges]);

	const nodeTypes = { phaseNode: PhaseNode };
	const proOptions = { hideAttribution: true };

	return (
		<div
			ref={reactFlowWrapper}
			className="flex flex-col md:flex-row w-full h-[100%] bg-brand-white p-6 gap-8 border border-[#EAECF0] rounded-md shadow-custom-xs relative"
		>
			<Stack className="w-full md:w-[100%] h-full" spacing={"12px"}>
				<div style={{ height: "100%", width: "100%", position: "relative" }}>
					<ReactFlow
						fitView
						edges={edges}
						nodeTypes={nodeTypes}
						nodes={nodes}
						proOptions={proOptions}
						onConnect={onConnect}
						onConnectEnd={() => {
							setTimeout(() => {
								isConnecting.current = false;
							}, 0);
						}}
						onConnectStart={() => {
							isConnecting.current = true;
						}}
						onContextMenu={(e) => e.preventDefault()}
						onDragOver={onDragOver}
						onDrop={onDrop}
						onEdgesChange={onEdgesChange}
						onNodeClick={onNodeClick}
						onNodeDragStop={onNodeDragStop}
						onNodesChange={onNodesChange}
						onPaneClick={(event) => {
							if (isConnecting.current) {
								return;
							}

							onPaneClick?.(event);
						}}
					>
						<Background />
						<Controls>
							<ControlButton
								title="Entscheidungen ein-/ausblenden"
								onClick={() => setShowDecisionLabels((prev) => !prev)}
							>
								{showDecisionLabels ? <EyeOff size={16} /> : <Eye size={16} />}
							</ControlButton>

							<ControlButton title="Rückgängig" onClick={undo}>
								↺
							</ControlButton>

							<ControlButton title="Wiederholen" onClick={redo}>
								↻
							</ControlButton>

							<ControlButton title="Automatisches Layout" onClick={handleAutoLayout}>
								<LayoutDashboard size={16} />
							</ControlButton>
						</Controls>
					</ReactFlow>
				</div>
			</Stack>

			<div className="flex flex-col gap-4">
				<Sidebar
					onAddNode={() => {
						/* Deine Logik hier */
					}}
				/>
			</div>
		</div>
	);
}
