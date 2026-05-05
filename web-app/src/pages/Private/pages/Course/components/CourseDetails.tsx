import { FunctionComponent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useNavigate, useParams } from "react-router-dom";

import { faTrashCan } from "@fortawesome/pro-regular-svg-icons";

import { TextField } from "@mui/material";

import { usePageTitle } from "@/utils/usePageTitle";

import {
	useDeleteCoursesMutation,
	useGetCourseQuery,
	useGetRelatedCoursesQuery,
} from "@/pages/Private/redux/courses/courses.api";

import { Icon, LoadingOverlay, Modal, PermissionCheck } from "@/components";
import { Button } from "@/components/Button/Button";
import { ButtonColor, ButtonSize } from "@/components/Button/types";

import VideoContainer from "@/components/VideoUploader/VideoContainer";

import { SvgIcon } from "@/components/Icon/SvgIcon";

import { ReactComponent as EditPen } from "@assets/icons/pen.svg";

import { Tab, TabsContainer } from "@/components/Tabs/TabsContainer";

import { PermissionRoles } from "@/enum";

import { ROUTE_CONFIG } from "@/routes/config";

import CourseTag from "../../Courses/components/CourseList/CourseTag";
import StartCourseModal from "../../Courses/components/StartCourseModal";
import { FileAssignment } from "../../Courses/enums/FileAssignment.enum";
import { CourseType } from "../schema/course";
import Breadcrumbs from "./Breadcrumbs";
import RelatedCoursesContainer from "./CourseDetails/RelatedCoursesContainer";

type CourseDetailsProps = {
	company?: CourseType;
};

export const CourseDetails: FunctionComponent<CourseDetailsProps> = ({}) => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`course.${key}`);
	const { id = 0 } = useParams();
	const { data, isFetching } = useGetCourseQuery(+id);
	const { data: relatedCoursesData, isFetching: isRelatedCoursesDataFetching } =
		useGetRelatedCoursesQuery(+id);
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const [isStaringCourseModalOpen, setIsStaringCourseModalOpen] = useState<boolean>(false);
	const [deleteCourses, { isLoading: isDeleteLoading }] = useDeleteCoursesMutation();
	const navigate = useNavigate();
	const { trailerVideo } = useMemo(() => {
		const trailerVideo = data?.courseFiles?.find(
			(file) => file.fileAssignment === FileAssignment.TrailerVideo
		);

		return { trailerVideo };
	}, [data]);

	usePageTitle(ts("title"));

	const handleDeleteModal = () => {
		if (data?.id) {
			setShowDeleteModal(true);
		}
	};

	const handleDeleteCourses = async () => {
		if (!data?.id) {
			return;
		}

		try {
			await deleteCourses(data?.id ?? 0).unwrap();
			setShowDeleteModal(false);
			navigate(ROUTE_CONFIG.COURSES);
		} catch (err) {
			console.error(err);
		}
	};

	if (isFetching) {
		return <LoadingOverlay />;
	}

	return (
		<>
			<div className="w-full flex-1">
				<Breadcrumbs
					items={[
						{
							title: ts("all-scenarios"),
							url: ROUTE_CONFIG.COURSES,
						},
						{
							title: data?.name ?? "",
							url: `${ROUTE_CONFIG.COURSES}/${id}`,
						},
					]}
				/>
				<div className="p-6 flex gap-6">
					<div className="w-[75%] flex-1 space-y-6">
						{trailerVideo?.fullFilePath && (
							<VideoContainer
								isDefaultControlsEnabled
								isShowDeleteButton={false}
								videoContainerClassName="h-[500px]"
								videoUrl={trailerVideo?.fullFilePath ?? null}
							/>
						)}

						<TabsContainer
							addiTionalHeaderComponent={
								<div className="w-full flex items-center justify-end gap-2">
									<PermissionCheck requiredPermissions={[PermissionRoles.USER]}>
										<Button
											className="!h-[44px] !font-medium !text-[14px] !px-6 !w-fit !rounded-xl"
											color={ButtonColor.ACTION}
											size={ButtonSize.ML}
											title={ts("get-started")}
											onClick={() => setIsStaringCourseModalOpen(true)}
										></Button>
									</PermissionCheck>
									<PermissionCheck requiredPermissions={[PermissionRoles.MANAGE_COURSES]}>
										<>
											<Button
												className="!h-[44px] !min-w-[44px] !max-w-[44px] !p-0 !rounded-xl"
												color={ButtonColor.ACTION_SECONDARY}
												image={<SvgIcon className="w-5 h-5" svgIcon={EditPen} />}
												size={ButtonSize.ML}
												title=""
												onClick={() => navigate(`${ROUTE_CONFIG.COURSES}/edit/${id}`)}
											></Button>
											<Button
												className="!h-[44px] !min-w-[44px] !max-w-[44px] !p-0 !rounded-xl"
												color={ButtonColor.ACTION_SECONDARY}
												image={<Icon className="w-5 h-5" icon={faTrashCan} />}
												size={ButtonSize.ML}
												title=""
												onClick={() => handleDeleteModal()}
											></Button>
										</>
									</PermissionCheck>
								</div>
							}
						>
							<Tab title={ts("overview")}>
								<h3 className="text-[28px] font-semibold text-primary-gray mb-3">
									{data?.name ?? ""}
								</h3>
								<CourseTag
									className="mb-3 block w-fit text-primary-blue-hover"
									tag={data?.tag?.name}
								/>
								<p className="text-primary-gray-lighter text-[14px]">{data?.description ?? ""}</p>
							</Tab>
							<Tab title={ts("for-whom")}>
								<h3 className="text-[28px] font-semibold text-primary-gray mb-3">
									{ts("for-whom")}
								</h3>
								<p className="text-primary-gray-lighter text-[14px]">{data?.forWhom ?? ""}</p>
							</Tab>
						</TabsContainer>
					</div>
					<div className="w-[25%] space-y-3">
						<RelatedCoursesContainer
							isRelatedCoursesDataFetching={isRelatedCoursesDataFetching}
							relatedCourses={relatedCoursesData ?? []}
						/>
					</div>
				</div>
			</div>
			{showDeleteModal && (
				<Modal
					handleClose={() => setShowDeleteModal(false)}
					handleSave={handleDeleteCourses}
					isLoading={isDeleteLoading}
					isOpened={showDeleteModal}
					submitButtonColor="error"
					submitButtonText={t("basics.delete")}
					title={t("courses.delete.title")}
				>
					<TextField
						fullWidth
						defaultValue={data?.name}
						inputProps={{ readOnly: true }}
						label={t("basics.name")}
					/>
				</Modal>
			)}
			{isStaringCourseModalOpen && data?.id && (
				<StartCourseModal
					isOpen={isStaringCourseModalOpen}
					setIsOpen={setIsStaringCourseModalOpen}
					trainingInfo={data}
				/>
			)}
		</>
	);
};
