import { Dispatch, FunctionComponent, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Stack } from "@mui/system";

import { JsonEditor } from "json-edit-react";

import { Modal } from "@/components";

import { useCreateCoursesMutation } from "@/pages/Private/redux/courses/courses.api";

import { ERROR_TYPE, getAllErrors, renderErrorMessages } from "@/utils";

import { InputField } from "@/components/InputField/InputField";

import { FlagHeader } from "@/components/Modals/FlagHeader";

import { TextArea } from "@/components/TextArea/TextArea";

import { Button } from "@/components/Button/Button";

import { CreateCourses, CreateCoursesSchema } from "../schema/courses";

interface createCoursesModalProps {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const CreateCoursesModal: FunctionComponent<createCoursesModalProps> = ({
	isOpen,
	setIsOpen,
}) => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`courses.${key}`);
	const [createCourses, { isLoading, error }] = useCreateCoursesMutation();

	const [jsonEditor, setJsonEditor] = useState<boolean>(true);

	const {
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<CreateCourses>({
		defaultValues: {
			name: undefined,
			json: undefined,
		},
		resolver: zodResolver(CreateCoursesSchema),
	});

	const [currentFormState, setCurrentFormState] = useState<Partial<CreateCourses>>({
		name: undefined,
		json: undefined,
	});

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleSaveFormState = (value: any, name: keyof CreateCourses) => {
		setCurrentFormState({
			...currentFormState,
			[name]: value,
		});

		setValue(name, value, {
			shouldDirty: true,
			shouldValidate: true,
		});
	};

	const onSubmit = async (values: CreateCourses) => {
		try {
			await createCourses({
				...values,
				json:
					typeof currentFormState.json === "string"
						? JSON.parse(currentFormState.json || "{}")
						: currentFormState.json || {},
			}).unwrap();
			setIsOpen(false);
		} catch (err) {
			console.error(err);
		}
	};

	const formErrors = Object.values(errors).map((error) => error?.message) as ERROR_TYPE[];

	console.log(currentFormState.json);

	return (
		<Modal
			aboveHeader={<FlagHeader onClick={() => console.log("Flag icon clicked!")} />}
			handleClose={() => setIsOpen(false)}
			handleSave={handleSubmit(onSubmit)}
			isLoading={isLoading}
			isOpened={isOpen}
			submitButtonText={t("basics.confirm")}
			title={ts("create.title")}
		>
			<Stack spacing={2}>
				<InputField
					error={!!errors.name?.message}
					handleChange={(e) => handleSaveFormState(e.target.value, "name")}
					label={t("name")}
					name={"name"}
					placeholder={t("name")}
					value={currentFormState.name ?? ""}
				/>

				{!jsonEditor && (
					<TextArea
						handleChange={(e) => handleSaveFormState(JSON.parse(e.target.value), "json")}
						label={ts("json")}
						name={"json"}
						placeholder={ts("json")}
						showError={false}
						value={JSON.stringify(currentFormState.json) || ""}
					/>
				)}

				{jsonEditor && (
					<JsonEditor
						data={currentFormState.json || {}}
						setData={(data) => {
							handleSaveFormState(data, "json");
						}}
					/>
				)}

				<Button title={jsonEditor ? "Text" : "JSON"} onClick={() => setJsonEditor(!jsonEditor)} />
			</Stack>

			{getAllErrors(error, formErrors).length ? (
				<Box sx={{ mt: 2 }}>{renderErrorMessages(getAllErrors(error, formErrors))}</Box>
			) : null}
		</Modal>
	);
};
