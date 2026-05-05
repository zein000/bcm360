import { Dispatch, FunctionComponent, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Stack } from "@mui/system";

import { Modal } from "@/components";

import { useCreateCompaniesMutation } from "@/pages/Private/redux/companies/companies.api";

import { ERROR_TYPE, getAllErrors, renderErrorMessages } from "@/utils";

import { InputField } from "@/components/InputField/InputField";

import { FlagHeader } from "@/components/Modals/FlagHeader";

import { CreateCompanies, CreateCompaniesSchema } from "../schema/companies";

interface createCompaniesModalProps {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const CreateCompaniesModal: FunctionComponent<createCompaniesModalProps> = ({
	isOpen,
	setIsOpen,
}) => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`companies.${key}`);
	const [createCompanies, { isLoading, error }] = useCreateCompaniesMutation();

	const {
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<CreateCompanies>({
		defaultValues: {
			name: undefined,
		},
		resolver: zodResolver(CreateCompaniesSchema),
	});

	const [currentFormState, setCurrentFormState] = useState<Partial<CreateCompanies>>({
		name: undefined,
	});

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleSaveFormState = (value: any, name: keyof CreateCompanies) => {
		setCurrentFormState({
			...currentFormState,
			[name]: value,
		});

		setValue(name, value, {
			shouldDirty: true,
			shouldValidate: true,
		});
	};

	const onSubmit = async (values: CreateCompanies) => {
		try {
			await createCompanies(values).unwrap();
			setIsOpen(false);
		} catch (err) {
			console.error(err);
		}
	};

	const formErrors = Object.values(errors).map((error) => error?.message) as ERROR_TYPE[];

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
			</Stack>

			{getAllErrors(error, formErrors).length ? (
				<Box sx={{ mt: 2 }}>{renderErrorMessages(getAllErrors(error, formErrors))}</Box>
			) : null}
		</Modal>
	);
};
