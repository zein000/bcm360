/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "@mui/material";
import { z } from "zod";
import { Node } from "@xyflow/react";

import {
	ScenarioGraph,
	ScenarioGraphData,
} from "@/pages/Private/pages/Courses/components/Editor/ScenarioGraph";

import { PhaseData } from "@/pages/Private/pages/Courses/components/Editor/NodeDataTyps";

import { JsonSchema } from "../schema/courses";

interface IJsonEditorProps {
	value: any;
	onChange: (value: any) => void;
	courseId?: number;
	containerClassName?: string;
	editorsClassName?: string;
	externalErrorMessage?: string;
	onNodeClick?: (event: React.MouseEvent, node: Node) => void;
	onPaneClick?: (event: React.MouseEvent) => void;
	onConnectionNodeSelect?: (node: Node<PhaseData>, updatedData: ScenarioGraphData) => void;
}

export function ensureValidPositions(data: any): any {
	if (!data?.Content || !Array.isArray(data.Content)) {
		return data;
	}

	return {
		...data,
		Content: data.Content.map((node: any, index: number) => {
			const hasValidPosition =
				node.position && typeof node.position.x === "number" && typeof node.position.y === "number";

			return {
				...node,
				position: hasValidPosition ? node.position : { x: 100 + index * 50, y: 100 + index * 50 },
			};
		}),
	};
}

export default function CustomJsonEditor({
	value,
	onChange,
	courseId,
	containerClassName = "",
	externalErrorMessage = "",
	onNodeClick,
	onPaneClick,
	onConnectionNodeSelect,
}: IJsonEditorProps) {
	const { t } = useTranslation();
	const ts = (key: string) => t(`courses.${key}`);
	const [isShowActionButton, setIsShowActionButton] = useState(false);
	const [unsavedJSONChanges, setUnsavedJSONChanges] = useState<ScenarioGraphData>(
		ensureValidPositions(value)
	);
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState(externalErrorMessage);

	useEffect(() => {
		if (value) {
			const parsedValue = typeof value === "string" ? JSON.parse(value) : value;
			const validated = ensureValidPositions(parsedValue);

			setUnsavedJSONChanges(validated);
			setLoading(false);
		}
	}, [value]);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const onSaveChanges = (val: any) => {
		try {
			const parsedValue = val;

			// Pflichtfelder ergänzen
			if (!parsedValue.scenarioName) {
				parsedValue.scenarioName = ts("UntitledScenario");
			}

			if (!parsedValue.author) {
				parsedValue.author = ts("UnknownAuthor");
			}

			// Positionen ergänzen, falls ungültig
			const corrected = ensureValidPositions(parsedValue);

			// Schema-Validierung
			const validated = JsonSchema.parse(corrected);

			setErrorMessage("");
			setIsShowActionButton(false);
			onChange(validated);
		} catch (e) {
			if (e instanceof z.ZodError) {
				setErrorMessage(
					"Invalid course scenario structure: " +
						e.errors.map((err) => err.path.join("->") + " " + err.message).join(", ")
				);
			} else {
				setErrorMessage("Invalid JSON format or structure");
			}
		}
	};

	// useEffect für asynchrones Aufrufen von onSaveChanges, um setState im Render zu vermeiden
	useEffect(() => {
		if (isShowActionButton) {
			onSaveChanges(unsavedJSONChanges);
		}
		// eslint-disable-next-line
	}, [isShowActionButton, unsavedJSONChanges]);

	const graphView = (
		<div className={`space-y-1 flex flex-col h-[100%]`}>
			<ScenarioGraph
				courseId={courseId}
				data={ensureValidPositions(value) as ScenarioGraphData}
				// ✅ VEREINFACHTER onChange-Handler
				onChange={(updatedData) => {
					// Die Validierung wird entfernt, um die Bearbeitung zu ermöglichen.
					// Sie sollte beim Speichern des gesamten Formulars stattfinden.

					const filtered = ensureValidPositions({
						...updatedData,
						Content: updatedData.Content.filter((node: any) => node?.id != null),
					});

					setUnsavedJSONChanges(filtered);
					setIsShowActionButton(true);
				}}
				onConnectionNodeSelect={onConnectionNodeSelect}
				onNodeClick={onNodeClick}
				onPaneClick={onPaneClick}
			/>
		</div>
	);

	const component = (
		<>
			{!loading ? graphView : <p>Loading...</p>}

			{errorMessage && (
				<Alert
					className="absolute -bottom-14"
					severity="error"
					sx={{ alignItems: "center", bgcolor: "error.light", fontSize: 14 }}
				>
					{errorMessage}
				</Alert>
			)}
		</>
	);

	return <div className={`w-full relative ${containerClassName}`}>{component}</div>;
}
