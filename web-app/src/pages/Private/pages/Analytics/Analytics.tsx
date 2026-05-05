import { useTranslation } from "react-i18next";

import { useState } from "react";

import { faTrash } from "@fortawesome/pro-solid-svg-icons";

import { usePageTitle } from "@/utils/usePageTitle";

import { Icon, Modal } from "@/components";

import { formatDateRange } from "@/utils/formateDateRange";

import { useDeleteScenarioProgressMutation } from "../../redux/course-progress/course-progress.api";
import CourseProgressTable from "./components/CourseProgressTable";
import { CourseProgress } from "./schema/course-progress";

export default function Analytics() {
	const { t } = useTranslation();
	const ts = (key: string, options = {}) => t(`analytics.${key}`, options);
	const [showDeleteModal, setShowDeleteModal] = useState<CourseProgress | null>(null);
	const [deleteScenarioProgress, { isLoading: isDeleteLoading }] =
		useDeleteScenarioProgressMutation();

	usePageTitle(ts("page-title"));

	const handleCourseProgressDelete = async () => {
		if (!showDeleteModal?.id) {
			return;
		}

		try {
			await deleteScenarioProgress(showDeleteModal?.id).unwrap();
			setShowDeleteModal(null);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<>
			<CourseProgressTable handleCourseProgressDelete={setShowDeleteModal} />
			{showDeleteModal && (
				<Modal
					aboveHeader={
						<div
							className="flex justify-center items-center rounded-xl border-[0.28px] border-[#E6E6EC] cursor-pointer pointer-events-auto"
							style={{
								width: "44px",
								height: "44px",
								boxShadow: "0px 1.38px 2.75px 0px #1018280F",
							}}
						>
							<Icon className="w-[20px] h-[20px] text-primary-blue" icon={faTrash} />
						</div>
					}
					dialogContentClassName="!p-0 overflow-auto mr-1 custom-scrollbar"
					handleClose={() => setShowDeleteModal(null)}
					handleSave={handleCourseProgressDelete}
					isLoading={isDeleteLoading}
					isOpened={!!showDeleteModal}
					submitButtonColor="error"
					submitButtonText={t("basics.delete")}
					title=""
				>
					<div className="mt-3 space-y-[6px]">
						<h2 className="text-[20px] text-primary-blue font-semibold">
							{ts("delete-scenario-progress-title")}
						</h2>
						<p className="text-primary-gray-lighter text-[14px]">
							{ts("sure-want-to-delete-report", {
								courseName: showDeleteModal?.course?.name,
								period: formatDateRange(
									showDeleteModal.createdAt,
									showDeleteModal?.finishDate ?? new Date()
								),
							})}
						</p>
					</div>
				</Modal>
			)}
		</>
	);
}
