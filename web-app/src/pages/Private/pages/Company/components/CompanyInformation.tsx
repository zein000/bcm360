import { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/system";
import { Card, CardContent, Unstable_Grid2 as Grid, TextField, Typography } from "@mui/material";

import { Button } from "@/components/Button/Button";
import { ButtonColor, ButtonSize } from "@/components/Button/types";
import { useUpdateMutation } from "@/pages/Private/redux/company/company.api";

import { CompanyType, UpdateCompany, UpdateCompanySchema } from "../schema/company";

type CompanyInformationProps = {
	company?: CompanyType;
};

export const CompanyInformation: FunctionComponent<CompanyInformationProps> = ({ company }) => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`company.${key}`);

	const [canEdit, setCanEdit] = useState<boolean>(false);
	const [updateCompany, { isLoading }] = useUpdateMutation();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UpdateCompany>({
		defaultValues: {
			name: company?.name || "",
		},
		resolver: zodResolver(UpdateCompanySchema),
	});

	const onSubmit = async (values: UpdateCompany) => {
		await updateCompany(values).unwrap();

		setCanEdit(false);
	};

	return (
		<>
			<Card>
				<CardContent>
					<Grid container spacing={3}>
						<Grid md={4} xs={12}>
							<Typography variant="h6">{ts("companyInformation")}</Typography>
						</Grid>

						<Grid md={8} xs={12}>
							<Stack spacing={3}>
								<div className="flex flex-col">
									<TextField
										fullWidth
										error={!!errors.name?.message}
										inputProps={{ readOnly: !canEdit }}
										label={ts("name")}
										placeholder={ts("name of your company")}
										size="small"
										variant="filled"
										{...register("name")}
									/>

									{!canEdit && (
										<div className="w-[100px] mr-2">
											<Button
												color={ButtonColor.ACTION_SECONDARY}
												size={ButtonSize.S}
												title={t("basics.edit")}
												onClick={() => setCanEdit(true)}
											/>
										</div>
									)}

									{canEdit && (
										<div className="w-[300px] flex">
											<div className="w-[100px] mr-2">
												<Button
													color={ButtonColor.ACTION_SECONDARY}
													size={ButtonSize.S}
													title={t("basics.cancel")}
													onClick={() => setCanEdit(false)}
												/>
											</div>

											<div className="w-[100px]">
												<Button
													isLoading={isLoading}
													size={ButtonSize.S}
													title={t("basics.save")}
													onClick={handleSubmit(onSubmit)}
												/>
											</div>
										</div>
									)}
								</div>
							</Stack>
						</Grid>
					</Grid>
				</CardContent>
			</Card>
		</>
	);
};
