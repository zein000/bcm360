import { Dispatch, FunctionComponent, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Box, Stack } from "@mui/system";

import { Modal } from "@/components";
import { ERROR_TYPE, getAllErrors, renderErrorMessages } from "@/utils";

import { useUpdateCompaniesMutation } from "@/pages/Private/redux/companies/companies.api";

import { InputField } from "@/components/InputField/InputField";

import { FlagHeader } from "@/components/Modals/FlagHeader";

import { Companies, UpdateCompanies, UpdateCompaniesSchema } from "../schema/companies";

interface updateCompaniesModalProps {
	companies: Companies;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const UpdateCompaniesModal: FunctionComponent<updateCompaniesModalProps> = ({
	companies,
	isOpen,
	setIsOpen,
}) => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`companies.${key}`);
	const [update, { isLoading, error }] = useUpdateCompaniesMutation();

	const [currentFormState, setCurrentFormState] = useState<UpdateCompanies>({
		name: companies.name,
	});

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleSaveFormState = (value: any, name: keyof UpdateCompanies) => {
		setCurrentFormState({
			...currentFormState,
			[name]: value,
		});

		setValue(name, value, {
			shouldDirty: true,
			shouldValidate: true,
		});
	};

	const {
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm<UpdateCompanies>({
		defaultValues: {
			name: companies.name,
		},
		resolver: zodResolver(UpdateCompaniesSchema),
	});

	const formErrors = Object.values(errors).map((error) => error?.message) as ERROR_TYPE[];

	const onSubmit = async (values: UpdateCompanies) => {
		try {
			await update({ ...values, id: companies.id }).unwrap();
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
					value={currentFormState.name}
				/>
			</Stack>
			{getAllErrors(error, formErrors).length ? (
				<Box sx={{ mt: 2 }}>{renderErrorMessages(getAllErrors(error, formErrors))}</Box>
			) : null}
		</Modal>
	);
};
