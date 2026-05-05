import { Node, useReactFlow, addEdge } from "@xyflow/react";
import React, { useEffect, useRef, useState } from "react";

import { useTranslation } from "react-i18next";
import { useEdgesState } from "reactflow";

import classNames from "classnames";

import { TextArea } from "@components/TextArea/TextArea";
import { InputField } from "@components/InputField/InputField";
// Commented out unused imports from your provided code
// import { FileAssignment } from "@/pages/Private/pages/Courses/enums/FileAssignment.enum";
// import { IStageContentInfo } from "@/pages/Private/pages/Courses/constants/emptyCourseScenario";
// import FilesUploader, { IFileInfo } from "@/pages/Private/pages/Courses/components/FilesUploader";
import {
	createDefaultPhaseData,
	PhaseData,
} from "@/pages/Private/pages/Courses/components/Editor/NodeDataTyps";
import { DecisionConfirmationTypes } from "@/pages/Private/pages/Course/enums/DecisionConfirmationTypes.enum";
import { FileTypes } from "@/pages/Private/pages/Courses/enums/FileTypes.enum";
import { useCourseFiles } from "src/pages/Private/helpers/useCourseFiles"; // Pfad anpassen
import { FileAssignment } from "@/pages/Private/pages/Courses/enums/FileAssignment.enum";
import { PhaseEndResult } from "@/pages/Private/pages/Courses/enums/PhaseEndResult.enum";

import { getNextAvailablePhaseDataId, getNextAvailableNodeId } from "./graphUtils";
import { createStyledEdge } from "./edgeUtils";

type DecisionOption = {
	option: string;
	phaseId: number | null; // null ist jetzt erlaubt
};

type TimeDelayedContentItem = NonNullable<PhaseData["timeDelayedContent"]>[0];

type PhaseEditorProps = {
	node: Node<PhaseData>;
};
export default function PhaseEditor({ node }: PhaseEditorProps) {
	// 1. useCourseFiles Hook für Datei-Upload und Löschung
	const { uploadCourseFiles } = useCourseFiles();

	// 2. React Flow SetNodes Hook
	const { setNodes, getNodes } = useReactFlow();

	// 3. Lokaler State für Formulardaten (PhaseData)
	const [formData, setFormData] = useState<PhaseData>(node.data);
	const { t } = useTranslation();
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const ts = (key: string) => t(`courses.${key}`);
	const decisionsSectionRef = useRef<HTMLDivElement | null>(null);
	const spoilerSectionRef = useRef<HTMLDivElement | null>(null);
	const timeDelayedSectionRef = useRef<HTMLDivElement | null>(null);

	// Synchronisiere formData, wenn node Daten oder ID sich ändern
	useEffect(() => {
		setFormData(node.data);
	}, [node.id, node.data]);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleSaveFormState = (inputValue: any, fieldName: keyof PhaseData | "decisionName") => {
		// Neue Daten vorbereiten
		const updatedFormData: PhaseData = { ...formData };

		if (fieldName === "decisionName") {
			updatedFormData.decisionName = inputValue as string | undefined;
			const newDecisionNameValue = inputValue as string;

			if (newDecisionNameValue && newDecisionNameValue.trim()) {
				if (!updatedFormData.decisionOptions || updatedFormData.decisionOptions.length === 0) {
					const nextPhaseId =
						typeof updatedFormData.id === "number" && updatedFormData.id >= 0
							? updatedFormData.id + 1
							: 1;

					updatedFormData.decisionOptions = [{ option: ts("newOption"), phaseId: nextPhaseId }];
				}

				if (
					!Object.values(DecisionConfirmationTypes).includes(
						updatedFormData.confirmationRequired as DecisionConfirmationTypes
					)
				) {
					updatedFormData.confirmationRequired = DecisionConfirmationTypes.NONE;
				}
			} else if (!newDecisionNameValue || !newDecisionNameValue.trim()) {
				// Entscheidung ist leer – alles zurücksetzen
				updatedFormData.decisionName = undefined;
				updatedFormData.confirmationRequired = DecisionConfirmationTypes.NONE;
				updatedFormData.decisionOptions = undefined;
			}
		} else {
			// Direktes Feld von PhaseData
			if (
				Object.prototype.hasOwnProperty.call(updatedFormData, fieldName) ||
				[
					"autoplay",
					"contentType",
					"content",
					"phaseName",
					"timeLimit",
					"timeLeftDecisionId",
					"confirmationRequired",
					"phaseEndText",
					"phaseEndResult",
				].includes(fieldName as string)
			) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(updatedFormData as any)[fieldName as keyof PhaseData] = inputValue;
			}
		}

		// 1. Lokalen Form-Status setzen (für Formular-Anzeige)
		setFormData(updatedFormData);

		// 2. Reaktiven Knoten-Status in der Graph-Struktur aktualisieren
		setNodes((currentNodes) =>
			currentNodes.map((n) =>
				n.id === node.id
					? {
							...n,
							data: updatedFormData,
					  }
					: n
			)
		);
	};

	// --- Handlers for Spoiler Content ---
	const addSpoilerContent = () => {
		setFormData((currentFormData) => {
			const newFormData = {
				...currentFormData,
				spoilerContent: { title: "", content: "" },
			};

			setNodes((nodes) => nodes.map((n) => (n.id === node.id ? { ...n, data: newFormData } : n)));

			return newFormData;
		});
	};

	type CheckboxProps = {
		isChecked: boolean;
		label: string;
		name: string;
		onChange: (checked: boolean) => void;
	};

	const Checkbox = ({ isChecked, label, name, onChange }: CheckboxProps) => (
		<label className="capitalize flex items-center text-[14px] font-bold text-primary-gray">
			{label}
			<input
				checked={isChecked}
				className="form-checkbox h-4 w-4 text-blue-600 ml-2"
				name={name}
				type="checkbox"
				onChange={(e) => onChange(e.target.checked)}
			/>
		</label>
	);

	const removeSpoilerContent = () => {
		setFormData((currentFormData) => {
			const newFormData = { ...currentFormData, spoilerContent: undefined };

			setNodes((nodes) => nodes.map((n) => (n.id === node.id ? { ...n, data: newFormData } : n)));

			return newFormData;
		});
	};

	const handleSpoilerContentChange = (subFieldName: "title" | "content", value: string) => {
		setFormData((currentFormData) => {
			const spoiler = currentFormData.spoilerContent || { title: "", content: "" };
			const newSpoilerContent = { ...spoiler, [subFieldName]: value };

			if (!newSpoilerContent.title && !newSpoilerContent.content) {
				const newFormData = { ...currentFormData, spoilerContent: undefined };

				setNodes((nodes) => nodes.map((n) => (n.id === node.id ? { ...n, data: newFormData } : n)));

				return newFormData;
			}

			const newFormData = { ...currentFormData, spoilerContent: newSpoilerContent };

			setNodes((nodes) => nodes.map((n) => (n.id === node.id ? { ...n, data: newFormData } : n)));

			return newFormData;
		});
	};

	// --- Decision Handling ---
	const handleAddDecisionSection = () => {
		setFormData((currentFormData) => {
			const newFormData: PhaseData = {
				...currentFormData,
				decisionName: currentFormData.decisionName || ts("decisionTitle"),
				decisionOptions: [],
				confirmationRequired:
					currentFormData.confirmationRequired || DecisionConfirmationTypes.NONE,
			};

			setNodes((nodes) => nodes.map((n) => (n.id === node.id ? { ...n, data: newFormData } : n)));

			return newFormData;
		});
	};

	const handleRemoveDecisionSection = () => {
		setFormData((currentFormData) => {
			const newFormData: PhaseData = {
				...currentFormData,
				decisionName: undefined,
				decisionOptions: undefined,
				confirmationRequired: undefined,
				timeLimit: undefined,
				timeLeftDecisionId: undefined,
			};

			setNodes((nodes) => nodes.map((n) => (n.id === node.id ? { ...n, data: newFormData } : n)));

			return newFormData;
		});
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const updateDecisionOption = (
		index: number,
		key: keyof DecisionOption,
		value: string | number | null
	) => {
		setFormData((currentFormData) => {
			const newOptions = [...(currentFormData.decisionOptions || [])];

			// Sicherstellen, dass die Option existiert
			if (!newOptions[index]) {
				return currentFormData; // Keine Änderung, wenn der Index ungültig ist
			}

			const updatedOption = {
				...newOptions[index],
				[key]: key === "phaseId" ? (value === "" || value === null ? null : Number(value)) : value,
			};

			newOptions[index] = updatedOption;

			const newFormData = { ...currentFormData, decisionOptions: newOptions };

			// Die einzige Aktualisierung: Wir ändern die Daten des aktuellen Knotens.
			// React Flow und unser neuer Effekt kümmern sich um den Rest.
			setNodes((nodes) => nodes.map((n) => (n.id === node.id ? { ...n, data: newFormData } : n)));

			return newFormData;
		});
	};

	const addDecisionOptionAndPhase = () => {
		// Wir rufen setFormData mit einer Funktion auf. Das garantiert, dass wir den aktuellsten State erhalten.
		setFormData((currentData) => {
			const currentNodes = getNodes();

			// Wir arbeiten nun mit 'currentData' statt mit der 'node'-Prop.
			const sourceNodeId = currentData.id;

			// Sicherheitsabfrage, falls die ID aus irgendeinem Grund nicht da ist.
			if (sourceNodeId == null) {
				console.error("Source node has no ID, cannot add new option.");

				return currentData;
			}

			const newPhaseDataId = getNextAvailablePhaseDataId(currentNodes);
			const newNodeId = getNextAvailableNodeId(currentNodes);

			const sourceNodeInGraph = currentNodes.find((n) => n.id === sourceNodeId.toString());

			const sourcePosition = sourceNodeInGraph?.position || { x: 100, y: 100 };
			const sourceHeight = sourceNodeInGraph?.height ?? 150;
			const sourceWidth = sourceNodeInGraph?.width ?? 240;

			const horizontalSpacing = 60;
			const minVerticalSpacing = 100; // Der Mindestabstand nach unten

			// --- X-Position (bleibt unverändert) ---
			const existingOptionsCount = Array.isArray(currentData.decisionOptions)
				? currentData.decisionOptions.length
				: 0;
			let xOffset = 0;

			switch (existingOptionsCount) {
				case 0:
					xOffset = -(sourceWidth / 2) - horizontalSpacing;
					break;
				case 1:
					xOffset = sourceWidth / 2 + horizontalSpacing;
					break;
				case 2:
					xOffset = -(sourceWidth / 2) - horizontalSpacing - sourceWidth;
					break;
				case 3:
					xOffset = sourceWidth / 2 + horizontalSpacing + sourceWidth;
					break;
				default:
					xOffset = (existingOptionsCount - 1) * (sourceWidth + horizontalSpacing);
					break;
			}

			const newXPosition = sourcePosition.x + sourceWidth / 2 + xOffset - sourceWidth / 2;

			// --- Y-Position (mit Zufallswert) ---
			// 1. Definiere, wie groß der zusätzliche zufällige Abstand maximal sein darf.
			const maxRandomVerticalOffset = 100; // z.B. bis zu 60px zusätzlicher Abstand

			// 2. Berechne die minimale Y-Position (der bisherige Wert).
			const baseYPosition = sourcePosition.y + sourceHeight + minVerticalSpacing;

			// 3. Addiere einen zufälligen Wert hinzu.
			const newYPosition = baseYPosition + Math.random() * maxRandomVerticalOffset;

			const newNodePosition = {
				x: newXPosition,
				y: newYPosition,
			};

			const newPhaseData = createDefaultPhaseData(t, {
				id: newPhaseDataId,
				position: newNodePosition,
			});
			const newNode: Node<PhaseData> = {
				id: newNodeId,
				type: "phaseNode",
				position: newNodePosition,
				data: newPhaseData,
			};

			const newDecisionOption = {
				option: ts("newOption"),
				phaseId: newPhaseDataId,
			};

			const newEdge = createStyledEdge({
				sourceId: sourceNodeId.toString(),
				targetId: newNodeId,
				label: newDecisionOption.option,
			});

			// Erzeuge die finalen, neuen Daten für den Quell-Knoten
			const updatedSourceNodeData = {
				...currentData,
				decisionOptions: [
					...(Array.isArray(currentData.decisionOptions) ? currentData.decisionOptions : []),
					newDecisionOption,
				],
				decisionName: currentData.decisionName || ts("decisionTitle"),
				confirmationRequired: currentData.confirmationRequired || DecisionConfirmationTypes.NONE,
			};

			// --- STATE UPDATES ---
			setNodes((nds) =>
				nds
					.map((n) =>
						n.id === sourceNodeId.toString() ? { ...n, data: updatedSourceNodeData } : n
					)
					.concat(newNode)
			);
			setEdges((eds) => addEdge(newEdge, eds));

			// Gib die neuen Daten zurück, um den lokalen State des Editors zu aktualisieren
			return updatedSourceNodeData;
		});
	};

	const addDecisionOptionOnly = () => {
		setFormData((currentFormData) => {
			const decisionOptions = [
				...(Array.isArray(currentFormData.decisionOptions) ? currentFormData.decisionOptions : []),
				{ option: ts("newOption"), phaseId: null },
			];

			const newFormData: PhaseData = {
				...currentFormData,
				decisionOptions,
				decisionName: currentFormData.decisionName || ts("decisionTitle"),
				confirmationRequired:
					currentFormData.confirmationRequired || DecisionConfirmationTypes.NONE,
			};

			setNodes((nodes) => nodes.map((n) => (n.id === node.id ? { ...n, data: newFormData } : n)));

			return newFormData;
		});
	};

	const removeDecisionOption = (indexToRemove: number) => {
		setFormData((currentFormData) => {
			let newOptions = currentFormData.decisionOptions ? [...currentFormData.decisionOptions] : [];

			newOptions = newOptions.filter((_, index) => index !== indexToRemove);

			const newFormData: PhaseData = {
				...currentFormData,
				decisionOptions: newOptions.length > 0 ? newOptions : undefined,
			};

			if (newOptions.length === 0) {
				// If all options are removed, clear the entire decision section
				newFormData.decisionName = undefined;
				newFormData.confirmationRequired = undefined;
				newFormData.timeLimit = undefined;
				newFormData.timeLeftDecisionId = undefined;
			}

			setNodes((nodes) => nodes.map((n) => (n.id === node.id ? { ...n, data: newFormData } : n)));

			return newFormData;
		});
	};

	// --- Handlers for Time-Delayed Content ---
	const handleTimeDelayedContentChange = (
		index: number,
		itemFieldName: keyof TimeDelayedContentItem,
		value: string | boolean | number
	) => {
		setFormData((currentFormData) => {
			const newTimeDelayedContent = (currentFormData.timeDelayedContent || []).map((item) => ({
				...item,
			}));

			if (!newTimeDelayedContent[index]) {
				console.error(
					"Attempting to update a non-existent timeDelayedContent item at index:",
					index
				);

				return currentFormData;
			}

			const itemToUpdate = { ...newTimeDelayedContent[index] };

			if (itemFieldName === "autoplay") {
				itemToUpdate.autoplay = Boolean(value);
			} else if (itemFieldName === "startTimeInSeconds" || itemFieldName === "endTimeInSeconds") {
				const numValue = parseFloat(value as string);

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(itemToUpdate as any)[itemFieldName] = isNaN(numValue) ? 0 : numValue;
			} else if (itemFieldName === "contentType") {
				itemToUpdate.contentType = value as FileTypes;
			} else {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(itemToUpdate as any)[itemFieldName] = value as string;
			}

			newTimeDelayedContent[index] = itemToUpdate;
			const newFormData = { ...currentFormData, timeDelayedContent: newTimeDelayedContent };

			setNodes((currentNodes) =>
				currentNodes.map((n) => (n.id === node.id ? { ...n, data: newFormData } : n))
			);

			return newFormData;
		});
	};

	const addTimeDelayedContentItem = () => {
		setFormData((currentFormData) => {
			const newItem: TimeDelayedContentItem = {
				title: "",
				content: "",
				autoplay: false,
				contentType: FileTypes.Text,
				startTimeInSeconds: 0,
				endTimeInSeconds: 20,
			};
			const newTimeDelayedContent = [...(currentFormData.timeDelayedContent || []), newItem];
			const newFormData = { ...currentFormData, timeDelayedContent: newTimeDelayedContent };

			setNodes((currentNodes) =>
				currentNodes.map((n) => (n.id === node.id ? { ...n, data: newFormData } : n))
			);

			return newFormData;
		});
	};

	const removeTimeDelayedContentItem = (indexToRemove: number) => {
		setFormData((currentFormData) => {
			const newTimeDelayedContent = (currentFormData.timeDelayedContent || []).filter(
				(_, index) => index !== indexToRemove
			);
			const newFormData = {
				...currentFormData,
				timeDelayedContent: newTimeDelayedContent.length > 0 ? newTimeDelayedContent : undefined,
			};

			setNodes((currentNodes) =>
				currentNodes.map((n) => (n.id === node.id ? { ...n, data: newFormData } : n))
			);

			return newFormData;
		});
	};

	// --- Animation Effects ---
	useEffect(() => {
		if (
			formData.decisionOptions &&
			formData.decisionOptions.length > 0 &&
			decisionsSectionRef.current
		) {
			decisionsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
		}
		// eslint-disable-next-line
	}, [formData.decisionOptions?.length]);

	useEffect(() => {
		if (formData.spoilerContent && spoilerSectionRef.current) {
			spoilerSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	}, [formData.spoilerContent]);

	useEffect(() => {
		if (
			formData.timeDelayedContent &&
			formData.timeDelayedContent.length > 0 &&
			timeDelayedSectionRef.current
		) {
			timeDelayedSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
		}
		// eslint-disable-next-line
	}, [formData.timeDelayedContent?.length]);

	return (
		<div className="space-y-4 p-1">
			<div className="flex flex-col md:flex-row gap-6 w-full">
				<InputField
					containerClassName="flex-grow"
					handleChange={(e) => {
						e.stopPropagation();
						handleSaveFormState(e.target.value, "phaseName");
					}}
					label={ts("phaseName")}
					name={"phaseName"}
					value={formData.phaseName || ""}
				/>
				<InputField
					containerClassName="sm:w-1/5"
					isDisabled={true}
					label={ts("id")}
					name={"id"}
					value={formData.id.toString()}
				/>
			</div>
			<div className="w-full mt-4">
				{formData.contentType === FileTypes.Text && (
					<TextArea
						className="bg-white h-full overflow-auto resize-none"
						containerClassName="min-h-[150px] custom-scrollbar"
						handleChange={(e) => {
							e.stopPropagation();
							handleSaveFormState(e.target.value, "content");
						}}
						label={ts("content")}
						name="content"
						showError={false}
						value={formData.content || ""}
					/>
				)}

				{formData.contentType !== FileTypes.Text && (
					<div className="p-3 border rounded bg-gray-50 shadow-sm space-y-3">
						<input
							accept={
								formData.contentType === FileTypes.Image
									? "image/*"
									: formData.contentType === FileTypes.Video
									? "video/*"
									: formData.contentType === FileTypes.Audio
									? "audio/*"
									: undefined
							}
							className="mb-2 block w-full text-sm text-slate-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100" // Basic styling for file input
							type="file"
							onChange={async (e) => {
								const file = e.target.files?.[0];

								if (!file) {
									return;
								}

								try {
									const fileUrls = await uploadCourseFiles([file]);
									const url = fileUrls?.[0]?.fullFilePath;

									if (url?.startsWith("http")) {
										handleSaveFormState(url, "content");
									} else {
										alert("Upload fehlgeschlagen");
									}
								} catch (error) {
									alert("Upload fehlgeschlagen");
									console.error(error);
								}
							}}
						/>
						<InputField
							containerClassName="w-full"
							handleChange={(e) => {
								e.stopPropagation();
								handleSaveFormState(e.target.value, "content");
							}}
							label={`${
								formData.contentType.charAt(0).toUpperCase() + formData.contentType.slice(1)
							} URL`}
							name="content"
							placeholder={`${ts("PasteURL")} ${formData.contentType.toLowerCase()}`}
							value={formData.content || ""}
						/>
						{formData.contentType === FileTypes.Image && formData.content && (
							<img alt="Preview" className="mt-2 max-w-sm rounded shadow" src={formData.content} />
						)}
						{formData.contentType === FileTypes.Audio && formData.content && (
							<audio controls className="mt-2 w-full">
								<source src={formData.content} />
								{ts("AudioNotSupported")}
							</audio>
						)}
						{formData.contentType === FileTypes.Video && formData.content && (
							<>
								{formData.content.includes("youtube.com") ||
								formData.content.includes("youtu.be") ? (
									<iframe
										allowFullScreen
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										className="mt-2 max-w-sm rounded shadow w-full aspect-video"
										frameBorder="0"
										src={formData.content
											.replace("watch?v=", "embed/")
											.replace("youtu.be/", "youtube.com/embed/")}
										title="YouTube video"
									/>
								) : (
									<video controls className="mt-2 max-w-sm rounded shadow w-full aspect-video">
										<source src={formData.content} />
										Your browser does not support the video element.
									</video>
								)}
							</>
						)}
					</div>
				)}
			</div>
			<div
				className={classNames(
					"flex items-center mt-2",
					formData.contentType === FileTypes.Video || formData.contentType === FileTypes.Audio
						? "space-x-6"
						: ""
				)}
			>
				<label className="capitalize flex items-center text-[14px] font-bold text-primary-gray">
					<span className="mr-2">{ts("contentType")}</span>
					<select
						className="border border-gray-300 rounded-md px-2 py-1 text-sm font-normal bg-white text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
						value={formData.contentType ?? FileTypes.Text}
						onChange={(e) => {
							e.stopPropagation();
							handleSaveFormState(e.target.value as FileTypes, "contentType");
						}}
					>
						<option value={FileTypes.Text}>{ts("text")}</option>
						<option value={FileTypes.Audio}>{ts("audio")}</option>
						<option value={FileTypes.Image}>{ts("image")}</option>
						<option value={FileTypes.Video}>{ts("video")}</option>
					</select>
				</label>
				{(formData.contentType === FileTypes.Video || formData.contentType === FileTypes.Audio) && (
					<Checkbox
						isChecked={!!formData.autoplay}
						label={ts("autoplay")}
						name="autoplay"
						onChange={(checked) => handleSaveFormState(checked, "autoplay")}
					/>
				)}
				<label
					className={classNames(
						"capitalize flex items-center text-[14px] font-bold text-primary-gray",
						// WENN NICHT Audio oder Video, DANN schiebe dieses Element nach rechts.
						!(formData.contentType === FileTypes.Video || formData.contentType === FileTypes.Audio)
							? "ml-auto"
							: ""
					)}
				>
					<span className="mr-2">{ts("phaseEndResult")}</span>
					<select
						className="border border-gray-300 rounded-md px-2 py-1 text-sm font-normal bg-white text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
						value={formData.phaseEndResult ?? PhaseEndResult.Success}
						onChange={(e) => {
							e.stopPropagation();
							handleSaveFormState(e.target.value as PhaseEndResult, "phaseEndResult");
						}}
					>
						<option value={PhaseEndResult.Success}>{ts("Success")}</option>
						<option value={PhaseEndResult.Failed}>{ts("Failed")}</option>
					</select>
				</label>
			</div>
			<div className="w-full mt-4">
				<InputField
					containerClassName="w-full"
					handleChange={(e) => {
						e.stopPropagation();
						handleSaveFormState(e.target.value, "phaseEndText");
					}}
					label={ts("phaseEndText")}
					name={"phaseEndText"}
					value={formData.phaseEndText || ""}
				/>
			</div>

			{/* Decision Options Section */}
			<div ref={decisionsSectionRef} className="mt-5 border-t pt-4">
				<div className="flex justify-between items-center mb-2">
					<h3 className="font-semibold text-md">{ts("decisions")}</h3>
					{formData.decisionName === undefined ? (
						<button
							className="bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 transition-colors text-sm"
							type="button"
							onClick={handleAddDecisionSection}
						>
							+ {ts("add")}
						</button>
					) : (
						<button
							className="bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition-colors text-sm"
							type="button"
							onClick={handleRemoveDecisionSection}
						>
							- {ts("remove")}
						</button>
					)}
				</div>

				{formData.decisionName !== undefined && (
					<>
						<InputField
							containerClassName="w-full"
							handleChange={(e) => {
								e.stopPropagation();
								handleSaveFormState(e.target.value, "decisionName");
							}}
							label={ts("decisionTitle")}
							name={"decisionName"}
							value={formData.decisionName || ""}
						/>
						<div className="flex flex-col sm:flex-row items-end gap-4 w-full mt-3">
							{/* Item 1: Time Limit Input */}
							<div className="w-full sm:w-1/3">
								<InputField
									className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
									containerClassName="w-full"
									handleChange={(e) => {
										e.stopPropagation();
										const numericValue = e.target.value.replace(/[^0-9]/g, "");

										handleSaveFormState(
											e.target.value === "" ? undefined : parseFloat(numericValue),
											"timeLimit"
										);
									}}
									label={ts("timeLimit") + " " + ts("inSeconds")}
									name={"timeLimit"}
									type="number"
									value={formData.timeLimit?.toString() ?? ""}
								/>
							</div>

							{/* Item 2: Timeout Action Dropdown */}
							<div className="w-full sm:w-1/3">
								<label className="capitalize flex flex-col text-[14px] font-bold text-primary-gray">
									<span className="mb-1">{ts("TimeoutPhaseID")}</span>
									<select
										className="w-full h-[46px] truncate border border-gray-300 rounded-xl px-2 py-3 text-ssm font-normal bg-white text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
										value={formData.timeLeftDecisionId?.toString() ?? ""}
										onChange={(e) => {
											e.stopPropagation();
											const value = e.target.value;

											handleSaveFormState(
												value === "" ? undefined : parseInt(value, 10),
												"timeLeftDecisionId"
											);
										}}
									>
										<option value="">{t("basics.pleaseSelect")}</option>
										{formData.decisionOptions?.map((option, index) => (
											<option key={index} value={index}>
												{option.option}
											</option>
										))}
									</select>
								</label>
							</div>

							{/* Item 3: Confirmation Dropdown */}
							<div className="w-full sm:w-1/3">
								<label className="capitalize flex flex-col text-[14px] font-bold text-primary-gray">
									<span className="mb-1">{ts("confirmation")}</span>
									<select
										className="w-full h-[46px] border border-gray-300 rounded-xl px-2 py-3 text-ssm font-normal bg-white text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
										value={formData.confirmationRequired ?? DecisionConfirmationTypes.NONE}
										onChange={(e) => {
											e.stopPropagation();
											handleSaveFormState(
												e.target.value as DecisionConfirmationTypes,
												"confirmationRequired"
											);
										}}
									>
										<option value={DecisionConfirmationTypes.NONE}>{ts("none")}</option>
										<option value={DecisionConfirmationTypes.FROM_LEADER}>
											{ts("fromLeader")}
										</option>
										<option value={DecisionConfirmationTypes.FROM_ALL}>{ts("fromAll")}</option>
									</select>
								</label>
							</div>
						</div>
						<h4 className="font-semibold text-md mt-4 mb-2">{ts("decisionOptions")} </h4>
						<div className="space-y-2">
							{formData.decisionOptions?.map((option: DecisionOption, index: number) => (
								<div key={index} className="flex items-center gap-2 p-2 border rounded bg-gray-50">
									<InputField
										containerClassName="flex-grow"
										handleChange={(e) => updateDecisionOption(index, "option", e.target.value)}
										name={`option_text_${index}`}
										placeholder={ts("option") + " #" + (index + 1)}
										type="text"
										value={option.option}
									/>
									<InputField
										className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
										containerClassName="w-28"
										handleChange={(e) => {
											const numericValue = e.target.value.replace(/[^0-9]/g, "");

											updateDecisionOption(index, "phaseId", numericValue);
										}}
										name={`option_phaseId_${index}`}
										placeholder={ts("phaseID")}
										type="number"
										value={option.phaseId ?? ""}
									/>
									<button
										className="bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 text-sm"
										type="button"
										onClick={() => removeDecisionOption(index)}
									>
										- {ts("remove")}
									</button>
								</div>
							))}
						</div>
						{formData.decisionOptions && formData.decisionOptions.length < 4 && (
							<div className="mt-3 flex items-center gap-2">
								<button
									className="flex-1 bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 text-sm font-medium"
									type="button"
									onClick={addDecisionOptionOnly}
								>
									+ {ts("option")}
								</button>
								<button
									className="flex-1 bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 text-sm font-medium"
									type="button"
									onClick={addDecisionOptionAndPhase}
								>
									+ {ts("option")} &amp; {ts("newPhase")}
								</button>
							</div>
						)}
					</>
				)}
			</div>

			{/* Spoiler Content Section */}
			<div ref={spoilerSectionRef} className="mt-5 border-t pt-4">
				<div className="flex justify-between items-center mb-2">
					<h3 className="font-semibold text-md">{ts("spoiler")}</h3>
					{formData.spoilerContent === undefined ? (
						<button
							className="bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 transition-colors text-sm" // Changed hover to blue for consistency
							type="button"
							onClick={addSpoilerContent}
						>
							+ {ts("add")}
						</button>
					) : (
						<button
							className="bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition-colors text-sm"
							type="button"
							onClick={removeSpoilerContent}
						>
							- {ts("remove")}
						</button>
					)}
				</div>
				{formData.spoilerContent !== undefined && (
					<div className="space-y-3 mt-2 p-3 border rounded bg-gray-50 shadow-sm">
						{" "}
						{/* Added shadow-sm for consistency */}
						<InputField
							containerClassName="w-full"
							handleChange={(e) => {
								e.stopPropagation();
								handleSpoilerContentChange("title", e.target.value);
							}}
							label={ts("title2")}
							name={"spoilerContentTitle"}
							value={formData.spoilerContent.title}
						/>
						<TextArea
							className="bg-white h-24 resize-none"
							containerClassName="min-h-[100px] custom-scrollbar"
							handleChange={(e) => {
								e.stopPropagation();
								handleSpoilerContentChange("content", e.target.value);
							}}
							label={ts("content")}
							name={"spoilerContentMain"}
							showError={false}
							value={formData.spoilerContent.content}
						/>
					</div>
				)}
			</div>

			{/* Time-Delayed Content Section */}
			<div className="mt-5 border-t pt-4">
				<div className="flex justify-between items-center mb-3">
					<h3 className="font-semibold text-md">{ts("timeDelayedContent")}</h3>
					<button
						className="bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 transition-colors text-sm" // Changed hover to blue for consistency
						type="button"
						onClick={addTimeDelayedContentItem}
					>
						+ {ts("add")}
					</button>
				</div>
				<div className="space-y-3">
					{(formData.timeDelayedContent || []).map((item, index) => (
						<div key={index} className="p-3 border rounded bg-gray-50 shadow-sm space-y-3">
							<div ref={timeDelayedSectionRef} className="flex justify-between items-center">
								<h4 className="font-medium text-sm text-gray-700">
									{ts("timeDelayedContent")} #{index + 1}
								</h4>
								<button
									className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors text-xs"
									type="button"
									onClick={() => removeTimeDelayedContentItem(index)}
								>
									- {ts("remove")}
								</button>
							</div>
							<InputField
								containerClassName="w-full"
								handleChange={(e) => handleTimeDelayedContentChange(index, "title", e.target.value)}
								label={ts("title2")}
								name={`delayed_title_${index}`}
								value={item.title}
							/>
							<div>
								{item.contentType !== FileTypes.Text && (
									<input // File input only for non-text types
										accept={
											item.contentType === FileTypes.Image
												? "image/*"
												: item.contentType === FileTypes.Video
												? "video/*"
												: item.contentType === FileTypes.Audio
												? "audio/*"
												: undefined
										}
										className="mb-2 block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
										type="file"
										onChange={async (e) => {
											const file = e.target.files?.[0];

											if (!file) {
												return;
											}

											try {
												const fileUrls = await uploadCourseFiles([file], FileAssignment.Content);

												if (fileUrls?.[0]?.fullFilePath) {
													handleTimeDelayedContentChange(
														index,
														"content",
														fileUrls[0].fullFilePath
													);
												} else {
													alert("Upload fehlgeschlagen");
												}
											} catch (error) {
												alert("Upload fehlgeschlagen");
												console.error(error);
											}
										}}
									/>
								)}

								{item.contentType !== FileTypes.Text && (
									<InputField // URL input only for non-text types
										containerClassName="w-full"
										handleChange={(e) => {
											e.stopPropagation();
											handleTimeDelayedContentChange(index, "content", e.target.value);
										}}
										label={`${
											item.contentType.charAt(0).toUpperCase() + item.contentType.slice(1)
										} URL`}
										name={`timeDelayedContentContent-${index}`}
										placeholder={`Paste a URL for ${item.contentType.toLowerCase()}`}
										value={item.content || ""}
									/>
								)}
								{item.contentType === FileTypes.Image && item.content && (
									<img alt="Preview" className="mt-2 max-w-sm rounded shadow" src={item.content} />
								)}
								{item.contentType === FileTypes.Audio && item.content && (
									<audio controls className="mt-2 w-full">
										<source src={item.content} />
										Your browser does not support the audio element.
									</audio>
								)}
								{item.contentType === FileTypes.Video && item.content && (
									<video controls className="mt-2 max-w-sm rounded shadow w-full aspect-video">
										<source src={item.content} />
										Your browser does not support the video element.
									</video>
								)}
							</div>
							{item.contentType === FileTypes.Text && ( // Text area only for Text type
								<TextArea
									className="bg-white h-20 resize-none"
									containerClassName="min-h-[80px]"
									handleChange={(e) =>
										handleTimeDelayedContentChange(index, "content", e.target.value)
									}
									label={ts("content")}
									name={`delayed_content_${index}`}
									showError={false}
									value={item.content}
								/>
							)}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<InputField
									className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
									handleChange={(e) => {
										handleTimeDelayedContentChange(index, "startTimeInSeconds", e.target.value);
									}}
									label={ts("startTime") + " " + ts("inSeconds")}
									name={`delayed_startTime_${index}`}
									type="number"
									value={item.startTimeInSeconds.toString()}
								/>
								<InputField
									className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
									handleChange={(e) => {
										handleTimeDelayedContentChange(index, "endTimeInSeconds", e.target.value);
									}}
									label={ts("endTime") + " " + ts("inSeconds")}
									name={`delayed_endTime_${index}`}
									type="number"
									value={item.endTimeInSeconds.toString()}
								/>
							</div>
							<div className="flex items-center space-x-4">
								<label className="capitalize flex items-center text-[14px] font-bold text-primary-gray">
									<span className="mr-2">{ts("contentType")}</span>
									<select
										className="border border-gray-300 rounded-md px-2 py-1 text-sm font-normal bg-white text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
										value={item.contentType}
										onChange={(e) =>
											handleTimeDelayedContentChange(
												index,
												"contentType",
												e.target.value as FileTypes
											)
										}
									>
										<option value={FileTypes.Text}>{ts("text")}</option>
										<option value={FileTypes.Audio}>{ts("audio")}</option>
										<option value={FileTypes.Image}>{ts("image")}</option>
										<option value={FileTypes.Video}>{ts("video")}</option>
									</select>
								</label>
								<Checkbox
									isChecked={!!item.autoplay}
									label={ts("autoplay")}
									name={`timeDelayedAutoplay-${index}`}
									onChange={() => {
										const currentItem = formData.timeDelayedContent?.[index];

										if (currentItem) {
											handleTimeDelayedContentChange(index, "autoplay", !currentItem.autoplay);
										}
									}}
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
