import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

import { useTranslation } from "react-i18next";

import { FormLabel, MenuItem, Stack, TextField, Typography } from "@mui/material";

import { faRocket } from "@fortawesome/pro-regular-svg-icons";

import { useNavigate } from "react-router-dom";

import { Icon, Modal } from "@/components";
import { ButtonColor } from "@/components/Button/types";
import { FlagHeader } from "@/components/Modals/FlagHeader";
import { useAppSelector } from "@/redux/hooks";

import { useStartScenarioMutation } from "@/pages/Private/redux/course-progress/course-progress.api";

import { ROUTE_CONFIG } from "@/routes/config";

import { Courses } from "../schema/courses";

interface IStartCourseModalProps {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	trainingInfo?: Courses;
}

export default function StartCourseModal({
	isOpen,
	setIsOpen,
	trainingInfo,
}: IStartCourseModalProps) {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const ts = (key: string, options = {}) => t(`courses.${key}`, options);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [startCourse, { isLoading, error: requestError }] = useStartScenarioMutation();
	const courses = useAppSelector((state) => state.courses?.courses);
	const [selectedCourseId, setSelectedCourseId] = useState(trainingInfo?.id ?? -1);
	const [error, setError] = useState("");
	const currentUserAuth = useAppSelector((state) => state.auth?.user);

	const handleSelectCourse = (event: ChangeEvent<{ value: unknown }>) => {
		if (event?.target?.value) {
			setSelectedCourseId(+event?.target?.value);
		}
	};

	const onStartCourseHandler = async () => {
		if (selectedCourseId !== -1 && currentUserAuth) {
			setError("");
			try {
				const result = await startCourse({
					courseId: selectedCourseId,
					userId: currentUserAuth.id,
				}).unwrap();

				if (result?.id) {
					navigate(`${ROUTE_CONFIG.COURSES}/${result.id}/progress`);
				}
			} catch (err) {
				console.error(err);
			}

			setIsOpen(false);
		} else {
			setError(ts("start.please-select"));
		}
	};

	return (
		<Modal
			aboveHeader={<FlagHeader onClick={() => console.log("Flag icon clicked!")} />}
			dialogContentClassName="!p-2"
			handleClose={() => setIsOpen(false)}
			handleSave={onStartCourseHandler}
			isLoading={isLoading}
			isOpened={isOpen}
			submitButtonColor={ButtonColor.ACTION}
			submitButtonIcon={
				<div className="mr-2 flex items-center justify-center">
					<Icon className="w-4 h-4" icon={faRocket} />
				</div>
			}
			submitButtonText={ts("start.title")}
			title={ts("start.title")}
		>
			<Stack spacing={0.4}>
				{!trainingInfo && (
					<FormLabel component="label" sx={{ color: "#344054" }}>
						{ts("start.label")}
					</FormLabel>
				)}
				{!trainingInfo && (
					<TextField
						select
						FormHelperTextProps={{
							sx: {
								fontSize: "0.825rem",
								color: "#FF0000",
							},
						}}
						InputProps={{
							sx: {
								fontSize: "1rem",
								color: "#101828",
								fontWeight: "400",
								lineHeight: "1.5rem",
								"&:focus-visible": {
									outline: "none",
									inset: "none",
									border: "none",
								},
								"&:focus": {
									outline: "none",
									boxShadow: "none",
									inset: "none",
									border: "none",
								},
								backgroundColor: "#fff",
							},
						}}
						disabled={!!trainingInfo}
						error={!!error}
						helperText={error}
						sx={{
							"& .MuiOutlinedInput-root": {
								"& fieldset": {
									border: "1px solid #D0D5DD",
								},
								"&:hover fieldset": {
									border: "1px solid #3E478470",
								},
								"&.Mui-focused fieldset": {
									border: "none",
									outline: "none",
									inset: "none",
								},
								mb: !!error ? "-2px" : "20px",
							},
						}}
						value={selectedCourseId}
						variant="outlined"
						onChange={handleSelectCourse}
					>
						<MenuItem disabled value={-1}>
							{t("basics.pleaseSelect")}
						</MenuItem>
						{courses?.map((course) => (
							<MenuItem key={course.id} value={course.id}>
								{course.name}
							</MenuItem>
						))}
					</TextField>
				)}
				{!!trainingInfo && (
					<Typography
						sx={{ fontWeight: "400", fontSize: "16px", color: "#475467", mb: "0px" }}
						variant="body1"
					>
						{ts("start.start-training-description", { trainingName: trainingInfo?.name })}
					</Typography>
				)}
			</Stack>
		</Modal>
	);
}
