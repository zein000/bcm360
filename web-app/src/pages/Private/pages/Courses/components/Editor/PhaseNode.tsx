import { Handle, NodeProps, Position } from "@xyflow/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faLightbulb } from "@fortawesome/pro-regular-svg-icons"; // Using regular icons

import { useTranslation } from "react-i18next";

import React from "react";

import { FileTypes } from "@/pages/Private/pages/Courses/enums/FileTypes.enum";

import { PhaseData, PhaseNodeData } from "./NodeDataTyps";

// Updated getShortContent to work with character limits for more consistent truncation
const getShortContent = (text: string, maxChars = 70) => {
	if (typeof text !== "string" || text.length <= maxChars) {
		return text;
	}

	return text.substring(0, maxChars) + "...";
};

export default function PhaseNode({ data, selected }: NodeProps<PhaseNodeData>) {
	const { contentType, content, id, phaseName, spoilerContent, timeDelayedContent } = data;

	const renderContent = () => {
		if (!content) {
			return <p className="text-[11px] italic text-slate-400">Kein Inhalt</p>;
		}

		const normalizedType = contentType?.toUpperCase();

		switch (normalizedType) {
			case FileTypes.Image:
				return (
					<img alt="Bildvorschau" className="max-w-full max-h-36 rounded-md mt-1" src={content} />
				);
			case FileTypes.Audio:
				return (
					<audio controls className="w-full mt-1 rounded">
						<source src={content} />
						Dein Browser unterstützt das Audio-Element nicht.
					</audio>
				);
			case FileTypes.Video:
				return (
					<video controls className="max-w-full max-h-36 rounded-md mt-1 bg-black">
						<source src={content} />
						Dein Browser unterstützt das Video-Element nicht.
					</video>
				);
			case FileTypes.Text:
			default:
				return (
					<p
						className="text-[11px] text-slate-500 break-words leading-snug h-10 overflow-hidden custom-scrollbar-thin mt-1"
						title={content}
					>
						{getShortContent(content)}
					</p>
				);
		}
	};

	// Define base and selected styles for clarity and easier modification
	const baseStyle = "bg-white border-slate-200 shadow-sm hover:shadow-md";
	const selectedStyle = "bg-white border-blue-500 ring-2 ring-blue-500 shadow-lg opacity-100";

	const { t } = useTranslation();
	const ts = (key: string) => t(`phaseNode.${key}`);

	const hasSpoilerContent = !!data.spoilerContent;
	const hasDelayedContent = !!(data.timeDelayedContent && data.timeDelayedContent.length > 0);

	const firstNode = data.id === null ? false : data.id === 1;

	return (
		<div
			className={`
				w-60
				rounded-xl
				p-3
				text-slate-700
				relative
				transition-all duration-150 ease-in-out
				${selected ? selectedStyle : baseStyle}
			`}
		>
			{!firstNode && (
				<Handle
					className={`!w-3.5 !h-3.5 !-top-1 !border-2 !border-white !bg-slate-300 hover:!bg-slate-400 ${
						selected ? "!bg-blue-400 hover:!bg-blue-500 !ring-blue-200" : "!ring-slate-200"
					}`}
					position={Position.Top}
					type="target"
				/>
			)}
			{/* Node Header: Phase Name, ID, and new indicators */}
			<div className="flex items-start justify-between mb-1.5">
				<h1
					className="text-[13px] font-semibold text-slate-800 truncate flex-grow pr-1"
					title={data.phaseName || ts("phaseName")}
				>
					{data.phaseName || ts("phaseName")}
				</h1>
				<div className="flex items-center flex-shrink-0">
					{hasSpoilerContent && (
						<FontAwesomeIcon
							className="text-yellow-500 text-xs mr-1.5"
							icon={faLightbulb}
							title={ts("spoilerAvailable")}
						/>
					)}
					{hasDelayedContent && (
						<FontAwesomeIcon
							className="text-sky-500 text-xs mr-1.5"
							icon={faClock}
							title={ts("delayedContentAvailable")}
						/>
					)}
					<span
						className="ml-1 text-[10px] font-mono text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-md"
						title={`Phase ID: ${data.id}`}
					>
						#{data.id}
					</span>
				</div>
			</div>

			{/* Node Content: Short description */}
			<p
				className="text-[11px] text-slate-500 break-words leading-snug h-10 overflow-hidden custom-scrollbar-thin"
				title={data.content}
			>
				{getShortContent(data.content, 70)}
			</p>

			{/* Optional: Display number of decision options if present */}
			{data.decisionOptions && data.decisionOptions.length > 0 && (
				<div className="mt-2 pt-1.5 border-t border-slate-200/60">
					<p className="text-[10px] text-blue-500 font-medium">
						{data.decisionOptions.length}{" "}
						{data.decisionOptions.length === 1 ? ts("decisionsOption") : ts("decisionsOptions")}
					</p>
				</div>
			)}
			{(!data.decisionOptions || data.decisionOptions.length === 0) && data.decisionName && (
				<div className="mt-2 pt-1.5 border-t border-slate-200/60">
					<p> </p>
				</div>
			)}

			{/* Bottom Handle - customized appearance */}
			<Handle
				className={`!w-3.5 !h-3.5 !-bottom-1 !border-2 !border-white !bg-slate-300 hover:!bg-slate-400 ${
					selected ? "!bg-blue-400 hover:!bg-blue-500 !ring-blue-200" : "!ring-slate-200"
				}`}
				position={Position.Bottom}
				type="source"
			/>
		</div>
	);
}
