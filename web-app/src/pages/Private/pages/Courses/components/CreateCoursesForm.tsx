import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/system";
import React, { FunctionComponent, useEffect, useState } from "react"; // Added React import
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Node, ReactFlowProvider } from "@xyflow/react"; // Added Node and ReactFlowProvider

import {
	useCreateCoursesMutation,
	useGetTagsQuery,
} from "@/pages/Private/redux/courses/courses.api";
import { InputField } from "@/components/InputField/InputField";
import { Button } from "@/components/Button/Button";
import { ButtonColor } from "@/components/Button/types";
import { TextArea } from "@/components/TextArea/TextArea";
import { ImageUploader } from "@/components/ImageUploader/ImageUploader";
import { VideoUploader } from "@/components/VideoUploader/VideoUploader";
import { usePageTitle } from "@/utils/usePageTitle";
import { AutoComplete, AutoCompleteItem } from "@/components/AutoComplete/AutoComplete";

// Assuming paths - adjust if your structure is different
import { ScenarioGraphData } from "@/pages/Private/pages/Courses/components/Editor/ScenarioGraph";

import { DnDProvider } from "./Editor/DnDContext";
import PhaseEditor from "./Editor/PhaseEdit";
import { PhaseData } from "./Editor/NodeDataTyps";

import { EMPTY_COURSE_SCENARIO, IStageContentInfo } from "../constants/emptyCourseScenario";
import { CourseTag, CreateCourses, CreateCoursesSchema } from "../schema/courses";
import CustomJsonEditor from "./CustomJsonEditor";
import FilesUploader, { IFileInfo } from "./FilesUploader";
import ContentModal from "../../Course/components/ContentModal";
import { FileAssignment } from "../enums/FileAssignment.enum";

export const CreateCoursesForm: FunctionComponent = () => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`courses.${key}`);
	const { data: tags } = useGetTagsQuery();

	usePageTitle(ts("create.title"));
	const navigate = useNavigate();
	const [createCourses, { isLoading }] = useCreateCoursesMutation();

	const {
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<CreateCourses>({
		defaultValues: {
			name: undefined,
			json: EMPTY_COURSE_SCENARIO,
			description: undefined,
			tag: undefined,
			forWhom: undefined,
		},
		resolver: zodResolver(CreateCoursesSchema),
	});

	const [currentFormState, setCurrentFormState] = useState<Partial<CreateCourses>>({
		name: undefined,
		json: EMPTY_COURSE_SCENARIO, // Ensure this is a valid initial JSON structure
		tag: undefined,
		description: undefined,
		forWhom: undefined,
	});
	const [files, setFiles] = useState<IFileInfo[]>([]);
	const [thumbnailImageFileInfo, setThumbnailImageFileInfo] = useState<IFileInfo | null>(null);
	const [trailerVideoFileInfo, setTrailerFileInfo] = useState<IFileInfo | null>(null);
	const [largeImageFileInfo, setLargeImageFileInfo] = useState<IFileInfo | null>(null);
	const [currentShowingContentInfo, setCurrentShowingContentInfo] =
		useState<IStageContentInfo | null>(null);
	const [nodeToSelectAfterRender, setNodeToSelectAfterRender] = useState<Node<PhaseData> | null>(
		null
	);

	// State for selected node in ScenarioGraph
	const [selectedNode, setSelectedNode] = useState<Node | null>(null);

	const DRAFT_KEY = "create-course-draft";

	useEffect(() => {
		const savedDraftJson = localStorage.getItem(DRAFT_KEY);

		if (savedDraftJson) {
			try {
				const draft = JSON.parse(savedDraftJson);

				// Lokalen State und react-hook-form State aktualisieren
				if (draft.formState) {
					setCurrentFormState(draft.formState);
					Object.keys(draft.formState).forEach((key) => {
						setValue(key as keyof CreateCourses, draft.formState[key]);
					});
				}

				// File-States wiederherstellen
				setFiles(draft.files || []);
				setThumbnailImageFileInfo(draft.thumbnail || null);
				setTrailerFileInfo(draft.trailer || null);
				setLargeImageFileInfo(draft.largeImage || null);
			} catch (e) {
				console.error("Fehler beim Laden des Kurs-Entwurfs:", e);
				localStorage.removeItem(DRAFT_KEY); // Fehlerhaften Entwurf löschen
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setValue]); // Läuft nur einmal beim Mounten

	useEffect(() => {
		const draft = {
			formState: currentFormState,
			files,
			thumbnail: thumbnailImageFileInfo,
			trailer: trailerVideoFileInfo,
			largeImage: largeImageFileInfo,
		};

		// Prüfen, ob der Graph verändert wurde (mehr als die Start-Node enthält)
		const isGraphModified = (currentFormState.json?.Content?.length ?? 0) > 1;

		// Prüfen, ob irgendein anderes Feld oder eine Datei hinzugefügt wurde
		const isFormStarted =
			currentFormState.name ||
			currentFormState.description ||
			currentFormState.forWhom ||
			files.length > 0 ||
			thumbnailImageFileInfo ||
			trailerVideoFileInfo ||
			largeImageFileInfo;

		// Speichere den Entwurf, wenn der Graph oder das Formular bearbeitet wurde.
		if (isGraphModified || isFormStarted) {
			localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
		}
	}, [currentFormState, files, largeImageFileInfo, thumbnailImageFileInfo, trailerVideoFileInfo]);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleSaveFormState = (value: any, name: keyof CreateCourses) => {
		setCurrentFormState((prevState) => ({
			...prevState,
			[name]: value,
		}));

		setValue(name, value, {
			shouldDirty: true,
			shouldValidate: true,
		});
	};

	const onSubmit = async (values: CreateCourses) => {
		try {
			const courseFiles = [
				...files.map((fileInfo) => ({
					// General course files
					id: fileInfo.id,
					fullFilePath: fileInfo.fullFilePath,
					fileName: fileInfo.fileName,
					fileLength: fileInfo.fileLength,
					fileType: fileInfo.fileType,
					fileAssignment: fileInfo.fileAssignment || FileAssignment.Content, // Ensure assignment
				})),
				...(thumbnailImageFileInfo
					? [{ ...thumbnailImageFileInfo, fileAssignment: FileAssignment.Thumbnail }]
					: []),
				...(trailerVideoFileInfo
					? [{ ...trailerVideoFileInfo, fileAssignment: FileAssignment.TrailerVideo }]
					: []),
				...(largeImageFileInfo
					? [{ ...largeImageFileInfo, fileAssignment: FileAssignment.LargeImage }]
					: []),
			];
			const result = await createCourses({
				...values, // Contains name, description, forWhom, tag from form
				json:
					typeof currentFormState.json === "string"
						? JSON.parse(currentFormState.json || "{}") // Should be object already
						: currentFormState.json || EMPTY_COURSE_SCENARIO,
				courseFiles: courseFiles,
			}).unwrap();

			if (result?.id) {
				localStorage.removeItem(DRAFT_KEY);
				navigate(`/app/courses/edit/${result.id}`, { replace: true });
			}
		} catch (err) {
			console.error("Error creating course:", err);
		}
	};
	const handleClose = () => {
		localStorage.removeItem(DRAFT_KEY);
		navigate(-1);
	};

	const handleSetTags = (value?: AutoCompleteItem) => {
		if (value && value?.title) {
			handleSaveFormState(
				{
					id: value?.id ?? -1, // Ensure ID is a number
					name: value.title,
				} as CourseTag,
				"tag"
			);
		}
	};

	const handleNodeConnection = (nodeToSelect: Node<PhaseData>, newGraphData: ScenarioGraphData) => {
		// 1. Das Update der Formulardaten bleibt gleich
		handleSaveFormState(newGraphData, "json");

		// 2. Anstatt direkt zu selektieren, speichern wir den Knoten für später
		setNodeToSelectAfterRender(nodeToSelect);
	};

	useEffect(() => {
		// Prüfen, ob ein Knoten zur Auswahl "wartet"
		if (nodeToSelectAfterRender) {
			// 1. Den Knoten jetzt WIRKLICH auswählen
			setSelectedNode(nodeToSelectAfterRender);

			// 2. WICHTIG: Den temporären Zustand sofort zurücksetzen,
			// damit dieser Effekt nicht in einer Endlosschleife läuft.
			setNodeToSelectAfterRender(null);
		}
	}, [nodeToSelectAfterRender]);

	// Handlers for ScenarioGraph node interaction
	const handleNodeClick = (_event: React.MouseEvent, node: Node) => {
		setSelectedNode(node);
	};

	const handlePaneClick = () => {
		setSelectedNode(null);
	};

	return (
		<ReactFlowProvider>
			<DnDProvider>
				<>
					<div className="flex flex-col h-[calc(100vh-97px)]">
						<div className="flex flex-col md:flex-row w-full h-[calc(100%-80px)] bg-brand-white p-6 gap-8 border border-[#EAECF0] rounded-md shadow-custom-xs">
							{/* Left Panel: PhaseEditor or General Course Details */}
							<Stack
								className="w-full md:w-[30%] h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600 pr-4"
								spacing={"12px"}
							>
								{selectedNode ? (
									<PhaseEditor node={selectedNode as Node<PhaseData>} />
								) : (
									<>
										<div className="flex flex-col md:flex-row gap-6 w-full">
											<InputField
												containerClassName="w-full md:w-3/3"
												error={!!errors.name?.message}
												errorMessage={errors.name?.message}
												handleChange={(e) => handleSaveFormState(e.target.value, "name")}
												label={ts("name") + "*"}
												name={"name"}
												placeholder={ts("name")}
												value={currentFormState?.name || ""}
											/>
											<AutoComplete
												data={
													tags
														?.filter((tag) => !!tag?.id && !!tag?.name)
														?.map((tag) => ({ id: tag?.id ?? -1, title: tag?.name ?? "" })) ?? []
												}
												handleSearch={() => {
													/* Implement if needed */
												}}
												handleSelect={handleSetTags}
												label={ts("tags") + "*"}
												position="bottom"
												selectedItem={currentFormState?.tag?.name ?? ""}
											/>
										</div>
										<InputField
											containerClassName="w-full"
											error={!!errors.json?.message}
											handleChange={(e) => {
												const newAuthor = e.target.value;
												const updatedJson = {
													...currentFormState?.json,
													author: newAuthor,
												};

												handleSaveFormState(updatedJson, "json");
											}}
											label={ts("author")}
											name="author"
											value={currentFormState?.json?.author || ""}
										/>
										<TextArea
											className={`bg-white !h-full !overflow-hidden`}
											containerClassName="!h-[80%] overflow-auto scrollbar-hide"
											errorMessage={errors.description?.message}
											handleChange={(e) => handleSaveFormState(e.target.value, "description")}
											label={ts("description") + "*"}
											labelClassName="!mb-0"
											mainContainerClassName="!min-h-[15%] !max-h-[15%]"
											name={"description"}
											placeholder={ts("description")}
											showError={false}
											value={currentFormState?.description || ""}
										/>
										<TextArea
											className={`bg-white !h-full !overflow-hidden`}
											containerClassName="!h-[80%] overflow-auto scrollbar-hide"
											errorMessage={errors.forWhom?.message}
											handleChange={(e) => handleSaveFormState(e.target.value, "forWhom")}
											label={ts("for-whom") + "*"}
											labelClassName="!mb-0"
											mainContainerClassName="!min-h-[15%] !max-h-[15%]"
											name={"forWhom"}
											placeholder={ts("for-whom")}
											showError={false}
											value={currentFormState?.forWhom || ""}
										/>
										<ImageUploader
											border
											aspectRatio={310 / 183}
											currentImgFileInfo={thumbnailImageFileInfo}
											description={t("basics.thumbnail-description")}
											fileAssignment={FileAssignment.Thumbnail}
											imagePrefix="course-thumbnail"
											label={t("basics.thumbnail")}
											maxFileSizeInBytes={2 * 1024 * 1024}
											setCurrentContentInfo={setCurrentShowingContentInfo}
											setCurrentImgFileInfo={setThumbnailImageFileInfo}
										/>
										<ImageUploader
											border
											aspectRatio={1330 / 459}
											currentImgFileInfo={largeImageFileInfo}
											description={t("basics.large-image-description")}
											fileAssignment={FileAssignment.LargeImage}
											imagePrefix="course-large-image"
											label={t("basics.large-image")}
											maxFileSizeInBytes={2 * 1024 * 1024}
											setCurrentContentInfo={setCurrentShowingContentInfo}
											setCurrentImgFileInfo={setLargeImageFileInfo}
										/>
										<VideoUploader
											border
											currentVideoFileInfo={trailerVideoFileInfo}
											description={t("basics.trailer-video-description")}
											fileAssignment={FileAssignment.TrailerVideo}
											label={t("basics.trailer-video")}
											maxFileSizeInBytes={30 * 1024 * 1024}
											setCurrentContentInfo={setCurrentShowingContentInfo}
											setCurrentVideoFileInfo={setTrailerFileInfo}
											videoPrefix="course-trailer-video"
										/>
									</>
								)}
							</Stack>

							{/* Right Panel: CustomJsonEditor */}
							<Stack className="w-full md:w-[70%] space-y-4">
								<CustomJsonEditor
									containerClassName="!h-[100%]"
									editorsClassName="!min-h-[85%]"
									externalErrorMessage={(errors?.json?.message as string) || ""}
									value={currentFormState?.json ?? EMPTY_COURSE_SCENARIO}
									onChange={(value) => handleSaveFormState(value, "json")}
									onConnectionNodeSelect={handleNodeConnection}
									onNodeClick={handleNodeClick}
									onPaneClick={handlePaneClick}
								/>
							</Stack>
						</div>

						{/* Action Buttons */}
						<Stack
							alignItems="center"
							direction="row"
							flexWrap="wrap"
							justifyContent={"flex-end"}
							marginTop={2}
							pr={4}
							spacing={2}
						>
							<div className="w-fit">
								<Button
									className="!h-[44px]"
									color={ButtonColor.ACTION_SECONDARY}
									title={t("basics.cancel")}
									onClick={handleClose}
								/>
							</div>
							<div className="w-fit">
								<Button
									className="!h-[44px]"
									color={ButtonColor.ACTION}
									isLoading={isLoading} // Add isLoading to prevent double click
									title={t("basics.safeAndCancel")} // Assuming this means save then close
									onClick={() =>
										handleSubmit(async (data) => {
											await onSubmit(data);
											navigate(-1); // Navigation is handled inside onSubmit on success
										})()
									}
								/>
							</div>
							<div className="w-fit">
								<Button
									className="!h-[44px]"
									color={ButtonColor.ACTION}
									disabled={isLoading}
									isLoading={isLoading}
									title={t("basics.save")}
									onClick={handleSubmit(onSubmit)}
								/>
							</div>
						</Stack>
					</div>
					<ContentModal
						contentInfo={currentShowingContentInfo}
						setCurrentContentInfo={setCurrentShowingContentInfo}
					/>
				</>
			</DnDProvider>
		</ReactFlowProvider>
	);
};
