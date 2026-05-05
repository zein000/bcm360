import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, FunctionComponent, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Box, Stack } from "@mui/system";

import { Modal } from "@/components";
import { ERROR_TYPE, getAllErrors, renderErrorMessages } from "@/utils";

import { useUpdateCoursesMutation } from "@/pages/Private/redux/courses/courses.api";

import { InputField } from "@/components/InputField/InputField";
import { FlagHeader } from "@/components/Modals/FlagHeader";

import CustomJsonEditor, { ensureValidPositions } from "./CustomJsonEditor"; // alle aus derselben Datei
import { EMPTY_COURSE_SCENARIO } from "../constants/emptyCourseScenario";
import { Courses, UpdateCourses, UpdateCoursesSchema } from "../schema/courses";

interface updateCoursesModalProps {
	courses: Courses;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const UpdateCoursesModal: FunctionComponent<updateCoursesModalProps> = ({
	courses,
	isOpen,
	setIsOpen,
}) => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`courses.${key}`);
	const [update, { isLoading, error }] = useUpdateCoursesMutation();
	const [currentFormState, setCurrentFormState] = useState<UpdateCourses>({
		name: courses.name,
		json: courses.json || {},
	});

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleSaveFormState = (value: any, name: keyof UpdateCourses) => {
		// Alte Positionsdaten aus currentFormState holen
		const prevContent = currentFormState?.json?.Content ?? [];

		if (name === "json" && value?.Content) {
			value.Content = value.Content.map((newNode: any) => {
				const oldNode = prevContent.find((n: any) => n.id === newNode.id);

				if (oldNode && oldNode.position) {
					newNode.position = oldNode.position; // Alte Position übernehmen
				}

				return newNode;
			});
		}

		const correctedValue = ensureValidPositions(value);

		setCurrentFormState({
			...currentFormState,
			[name]: correctedValue,
		});

		setValue(name, correctedValue, {
			shouldDirty: true,
			shouldValidate: true,
		});
	};

	const {
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm<UpdateCourses>({
		defaultValues: {
			name: courses.name,
			json: courses.json || {},
		},
		resolver: zodResolver(UpdateCoursesSchema),
	});

	const formErrors = Object.values(errors).map((error) => error?.message) as ERROR_TYPE[];

	const onSubmit = async (values: UpdateCourses) => {
		try {
			await update({
				...values,
				json:
					typeof currentFormState?.json !== "string"
						? JSON.stringify(currentFormState?.json || {})
						: currentFormState?.json || "{}",
				id: currentFormState?.id,
			}).unwrap();
			setIsOpen(false);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Modal
			aboveHeader={<FlagHeader onClick={() => console.log("Flag icon clicked!")} />}
			handleClose={() => setIsOpen(false)}
			handleSave={handleSubmit(onSubmit)}
			isLoading={isLoading}
			isOpened={isOpen}
			submitButtonText={t("basics.confirm")}
			title={ts("update.title")}
		>
			<Stack spacing={2}>
				<InputField
					error={!!errors.name?.message}
					handleChange={(e) => handleSaveFormState(e.target.value, "name")}
					label={ts("name")}
					name={"name"}
					placeholder={ts("name")}
					value={currentFormState?.name ?? ""}
				/>
				<CustomJsonEditor
					value={currentFormState?.json ?? EMPTY_COURSE_SCENARIO}
					onChange={(value) => handleSaveFormState(value, "json")}
				/>
			</Stack>
			{getAllErrors(error, formErrors).length ? (
				<Box sx={{ mt: 2 }}>{renderErrorMessages(getAllErrors(error, formErrors))}</Box>
			) : null}
		</Modal>
	);
};
