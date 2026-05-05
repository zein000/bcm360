import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, Unstable_Grid2 as Grid, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { FunctionComponent, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useUpdateMutation } from "@/pages/Private/redux/company/company.api";
import { ButtonColor, ButtonSize } from "@/components/Button/types";
import { Button } from "@/components/Button/Button";

import { CourseType, UpdateCourse, UpdateCourseSchema } from "../schema/course";

type CourseInformationProps = {
	company?: CourseType;
};

export const CourseInformation: FunctionComponent<CourseInformationProps> = ({ company }) => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`company.${key}`);

	const [canEdit, setCanEdit] = useState<boolean>(false);
	const [updateCourse, { isLoading }] = useUpdateMutation();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UpdateCourse>({
		defaultValues: {
			name: company?.name || "",
			json: company?.json || {},
		},
		resolver: zodResolver(UpdateCourseSchema),
	});

	const onSubmit = async (values: UpdateCourse) => {
		await updateCourse(values).unwrap();

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

									<TextField
										fullWidth
										error={!!errors.json?.message}
										inputProps={{ readOnly: !canEdit }}
										label={ts("json")}
										placeholder={ts("json_input")}
										size="medium"
										variant="filled"
										{...register("json")}
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
