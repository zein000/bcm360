import React from "react";
import { useTranslation } from "react-i18next";

import { useDnD } from "./DnDContext";

type SidebarProps = {
	onAddNode: () => void;
	// showDecisionLabels und setShowDecisionLabels werden **nicht** mehr gebraucht hier
};

// eslint-disable-next-line
const Sidebar: React.FC<SidebarProps> = ({ onAddNode }) => {
	// eslint-disable-next-line
	const [_, setType] = useDnD();

	const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
		setType(nodeType);
		event.dataTransfer.effectAllowed = "move";
	};

	const { t } = useTranslation();
	const ts = (key: string) => t(`phaseNode.${key}`);

	return (
		<aside
			style={{
				background: "#f9fafb",
				padding: "16px",
				borderRadius: "8px",
				boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
				minHeight: "80px",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				position: "absolute",
				top: "16px",
				right: "16px",
				zIndex: 10,
				width: "200px",
			}}
		>
			{/* Dragbarer Button zum Hinzufügen neuer Nodes */}
			<div
				draggable
				style={{
					padding: "12px",
					background: "#2563eb",
					color: "white",
					borderRadius: "8px",
					cursor: "grab",
					textAlign: "center",
					userSelect: "none",
				}}
				onDragStart={(event) => onDragStart(event, "phaseNode")}
			>
				{ts("newPhase")}
			</div>
		</aside>
	);
};

export default Sidebar;
