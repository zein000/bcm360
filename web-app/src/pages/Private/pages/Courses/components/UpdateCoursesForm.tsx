import { zodResolver } from "@hookform/resolvers/zod";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Stack } from "@mui/system";

import { useNavigate, useParams } from "react-router-dom";

import { Node, ReactFlowProvider } from "@xyflow/react";

import { PhaseData } from "@/pages/Private/pages/Courses/components/Editor/NodeDataTyps";

import {
	useGetCourseQuery,
	useGetTagsQuery,
	useUpdateCoursesMutation,
} from "@/pages/Private/redux/courses/courses.api";

import { InputField } from "@/components/InputField/InputField";

import { Button } from "@/components/Button/Button";

import { ButtonColor } from "@/components/Button/types";

import { TextArea } from "@/components/TextArea/TextArea";

import { ImageUploader } from "@/components/ImageUploader/ImageUploader";

import { usePageTitle } from "@/utils/usePageTitle";

import { AutoComplete, AutoCompleteItem } from "@/components/AutoComplete/AutoComplete";

import PhaseEditor from "@/pages/Private/pages/Courses/components/Editor/PhaseEdit";

import { DnDProvider } from "@/pages/Private/pages/Courses/components/Editor/DnDContext";

import { VideoUploader } from "@components/VideoUploader/VideoUploader";

import { ScenarioGraphData } from "@/pages/Private/pages/Courses/components/Editor/ScenarioGraph";

import ContentModal from "../../Course/components/ContentModal";
import { EMPTY_COURSE_SCENARIO, IStageContentInfo } from "../constants/emptyCourseScenario";
import { FileAssignment } from "../enums/FileAssignment.enum";
import { CourseTag, UpdateCourses, UpdateCoursesSchema } from "../schema/courses";
import CustomJsonEditor from "./CustomJsonEditor";
import { IFileInfo } from "./FilesUploader";

export const UpdateCoursesForm: FunctionComponent = () => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`courses.${key}`);

	usePageTitle(ts("update.title"));
	const { id = 0 } = useParams();
	const navigate = useNavigate();

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { data } = useGetCourseQuery(+id);
	const { data: tags } = useGetTagsQuery();
	const [update, { isLoading }] = useUpdateCoursesMutation();
	const [currentFormState, setCurrentFormState] = useState<UpdateCourses>();
	const [thumbnailImageFileInfo, setThumbnailImageFileInfo] = useState<IFileInfo | null>(null);
	const [trailerVideoFileInfo, setTrailerFileInfo] = useState<IFileInfo | null>(null);
	const [largeImageFileInfo, setLargeImageFileInfo] = useState<IFileInfo | null>(null);
	const [currentShowingContentInfo, setCurrentShowingContentInfo] =
		useState<IStageContentInfo | null>(null);
	const [nodeToSelectAfterRender, setNodeToSelectAfterRender] = useState<Node<PhaseData> | null>(
		null
	);
	const [selectedNode, setSelectedNode] = useState<Node | null>(null);

	const [files, setFiles] = useState<IFileInfo[]>([]);

	useEffect(() => {
		if (data) {
			const formState = {
				id: +id,
				name: data.name,
				description: data?.description,
				forWhom: data?.forWhom,
				json: Object.keys(data.json).length ? data?.json : EMPTY_COURSE_SCENARIO,
				tag: data?.tag,
			};

			setCurrentFormState({
				...formState,
			});

			if (data?.courseFiles?.length) {
				const { contentFiles, largeImage, thumbnail, trailer } = data.courseFiles.reduce(
					(acc, item) => {
						if (item.fileAssignment === FileAssignment.Content) {
							acc.contentFiles.push(item);
						} else if (item.fileAssignment === FileAssignment.LargeImage) {
							acc.largeImage = item;
						} else if (item.fileAssignment === FileAssignment.Thumbnail) {
							acc.thumbnail = item;
						} else if (item.fileAssignment === FileAssignment.TrailerVideo) {
							acc.trailer = item;
						}

						return acc;
					},
					{
						contentFiles: [] as typeof data.courseFiles,
						largeImage: null as (typeof data.courseFiles)[number] | null,
						thumbnail: null as (typeof data.courseFiles)[number] | null,
						trailer: null as (typeof data.courseFiles)[number] | null,
					}
				);

				setFiles(contentFiles);
				setLargeImageFileInfo(largeImage);
				setThumbnailImageFileInfo(thumbnail);
				setTrailerFileInfo(trailer);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleSaveFormState = (value: any, name: keyof UpdateCourses) => {
		console.log(name, value);
		setCurrentFormState((prevState) => ({
			...prevState,
			[name]: value,
		}));

		setValue(name, value, {
			shouldDirty: true,
			shouldValidate: true,
		});
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

	const {
		setValue,
		handleSubmit,
		reset,
		formState: { errors, isDirty },
	} = useForm<UpdateCourses>({
		defaultValues: {
			name: currentFormState?.name,
			description: currentFormState?.description,
			forWhom: currentFormState?.forWhom,
			json: currentFormState?.json || EMPTY_COURSE_SCENARIO,
			tag: currentFormState?.tag,
		},
		resolver: zodResolver(UpdateCoursesSchema),
	});

	useEffect(() => {
		if (currentFormState) {
			setValue("name", currentFormState.name, { shouldDirty: false });
			setValue("description", currentFormState.description, { shouldDirty: false });
			setValue("forWhom", currentFormState.forWhom, { shouldDirty: false });
			setValue("json", currentFormState.json, { shouldDirty: false });
			setValue("tag", currentFormState.tag, { shouldDirty: false });
			setValue("image_small", currentFormState.image_small, { shouldDirty: false });
			setValue("image_big", currentFormState.image_big, { shouldDirty: false });
			setValue("trailer_video", currentFormState.trailer_video, { shouldDirty: false });
			setValue("course_file", currentFormState.course_file, { shouldDirty: false });
		}
	}, [currentFormState, setValue]);

	const onSubmit = async (values: UpdateCourses) => {
		if (!isDirty) {
			return;
		}

		try {
			const courseFiles = [
				...files.map((fileInfo) => ({
					id: fileInfo.id,
					fullFilePath: fileInfo.fullFilePath,
					fileName: fileInfo.fileName,
					fileLength: fileInfo.fileLength,
					fileType: fileInfo.fileType,
					fileAssignment: fileInfo.fileAssignment,
				})),
				...(thumbnailImageFileInfo ? [thumbnailImageFileInfo] : []),
				...(trailerVideoFileInfo ? [trailerVideoFileInfo] : []),
				...(largeImageFileInfo ? [largeImageFileInfo] : []),
			];

			await update({
				...values,
				name: values?.name ? values.name : currentFormState?.name,
				tag: values?.tag ? values.tag : currentFormState?.tag,
				description: values?.description ? values.description : currentFormState?.description,
				forWhom: values?.forWhom ? values.forWhom : currentFormState?.forWhom,
				json:
					typeof currentFormState?.json !== "string"
						? JSON.stringify(currentFormState?.json || {})
						: currentFormState?.json || "{}",
				id: currentFormState?.id,
				courseFiles: courseFiles,
			}).unwrap();
			localStorage.removeItem(`scenario-draft-${id}`);
			reset(undefined, { keepValues: true });
		} catch (err) {
			console.error(err);
		}
	};

	const handleClose = () => {
		localStorage.removeItem(`scenario-draft-${id}`);
		navigate(-1);
	};

	const handleSetTags = (value?: AutoCompleteItem) => {
		if (value && value?.title) {
			handleSaveFormState(
				{
					id: value?.id ?? -1,
					name: value.title,
				} as CourseTag,
				"tag"
			);
		}
	};

	const handleNodeClick = (event: React.MouseEvent, node: Node) => {
		setSelectedNode(node);
	};

	const handlePaneClick = () => {
		setSelectedNode(null);
	};

	// 1. Stack links bei Update Szenario, 2. Rechts, 3. Unten mit den 2 Knoepfen
	return (
		<ReactFlowProvider>
			<DnDProvider>
				<>
					<div className="flex flex-col h-[calc(100vh-97px)]">
						<div className="flex flex-col md:flex-row w-full h-[calc(100%-80px)] bg-brand-white p-6 gap-8 border border-[#EAECF0] rounded-md shadow-custom-xs">
							{/* This is the Stack for the left panel (PhaseEditor or general course details) */}
							<Stack
								className="w-full md:w-[30%] h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600 pr-4"
								spacing={"12px"}
							>
								{" "}
								{/* MODIFIED HERE */}
								{selectedNode ? (
									<PhaseEditor node={selectedNode as Node<PhaseData>} />
								) : (
									<>
										{/* General course editing fields like name, description, tags, image uploaders, etc. */}
										<div className="flex flex-col md:flex-row gap-6 w-full">
											<InputField
												containerClassName="w-full md:w-3/3"
												error={!!errors.name?.message}
												errorMessage={errors.name?.message}
												handleChange={(e) => {
													const newName = e.target.value;

													// Kursname aktualisieren
													handleSaveFormState(newName, "name");

													// scenarioName im JSON aktualisieren
													const updatedJson = {
														...currentFormState?.json,
														scenarioName: newName,
													};

													handleSaveFormState(updatedJson, "json");
												}}
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
												// eslint-disable-next-line @typescript-eslint/no-empty-function
												handleSearch={() => {}}
												handleSelect={handleSetTags}
												label={ts("tags") + "*"}
												selectedItem={currentFormState?.tag?.name ?? ""}
											/>
										</div>

										{/* AUTHOR FIELD – direkt nach Tags */}
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
											handleChange={(e) => handleSaveFormState(e.target.value, "image_small")}
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
											handleChange={(e) => handleSaveFormState(e.target.value, "image_big")}
											imagePrefix="course-large-image"
											label={t("basics.large-image")}
											maxFileSizeInBytes={2 * 1024 * 1024}
											setCurrentContentInfo={setCurrentShowingContentInfo}
											setCurrentImgFileInfo={setLargeImageFileInfo}
										/>
										<VideoUploader
											border
											currentVideoFileInfo={trailerVideoFileInfo} // Ensure these state variables are correctly managed
											fileAssignment={FileAssignment.TrailerVideo}
											handleChange={(e) => {
												// This handleChange on VideoUploader might not be what you intend for form state
												e.stopPropagation();
												// handleSaveFormState(e.target.value, "trailer_video"); // "trailer_video" isn't in PhaseData
											}}
											label={t("basics.trailer-video")}
											maxFileSizeInBytes={30 * 1024 * 1024}
											setCurrentContentInfo={setCurrentShowingContentInfo} // Ensure these props are correctly used
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
									courseId={+id}
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
								></Button>
							</div>
							<div className="w-fit">
								<Button
									className="!h-[44px]"
									color={ButtonColor.ACTION}
									title={t("basics.safeAndCancel")}
									onClick={() =>
										handleSubmit(async (data) => {
											await onSubmit(data); // warte auf das Speichern
											localStorage.removeItem(`scenario-draft-${id}`);
											handleClose(); // erst dann schließen
										})()
									}
								></Button>
							</div>
							<div className="w-fit">
								<Button
									className="!h-[44px]"
									color={ButtonColor.ACTION}
									disabled={isLoading}
									isLoading={isLoading}
									title={t("basics.save")}
									onClick={handleSubmit(onSubmit)}
								></Button>
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
