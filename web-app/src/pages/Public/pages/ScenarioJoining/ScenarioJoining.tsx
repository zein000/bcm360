import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";

import { useLocation, useNavigate } from "react-router-dom";

import { useEffect } from "react";

import FormTextField from "@/pages/Private/pages/Account/components/FormTextField";

import {
	useAcceptCourseProgressInvitationMutation,
	useCheckIfAlreadyAcceptedMutation,
} from "@/pages/Private/redux/course-progress/course-progress.api";

import { LoadingOverlay } from "@/components";

import { ERROR_TYPE } from "@/utils";

import FormContainer from "../../components/FormContainer";
import { FirstLoginSchema, FirstLoginType } from "./schema/firstLogin";

export default function ScenarioJoining() {
	const { t } = useTranslation();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);

	const token = queryParams.get("token");
	const courseProgressId = queryParams.get("courseProgressId");
	const [acceptInvitation, { error }] = useAcceptCourseProgressInvitationMutation();
	const [checkIfAlreadyAccepted, { isLoading }] = useCheckIfAlreadyAcceptedMutation();
	const navigate = useNavigate();
	const ts = (key: string) => t(`courses.progress.${key}`);
	const initialValues: FirstLoginType = {
		firstName: "",
		lastName: "",
	};

	useEffect(() => {
		async function check() {
			if (token && courseProgressId) {
				const result = await checkIfAlreadyAccepted({
					accessToken: token,
					courseProgressId: courseProgressId,
				}).unwrap();

				if (result.courseProgressId) {
					navigate(`/app/courses/${result.courseProgressId}/progress`);
				}
			}
		}

		check();
	}, [token, courseProgressId, checkIfAlreadyAccepted, navigate]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FirstLoginType>({
		defaultValues: initialValues,
		resolver: zodResolver(FirstLoginSchema),
	});

	const onSubmit = async (values: FirstLoginType) => {
		try {
			if (token && courseProgressId) {
				const result = await acceptInvitation({
					user: {
						firstName: values?.firstName,
						lastName: values?.lastName,
					},
					accessToken: token,
					courseProgressId,
				}).unwrap();

				if (result.courseProgressId) {
					navigate(`/app/courses/${result.courseProgressId}/progress`);
				}
			}
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="w-full h-full flex items-center justify-center">
			{isLoading ? (
				<LoadingOverlay />
			) : (
				<FormContainer
					description={ts("first-login.description")}
					formError={
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						(error as any)?.data?.message === ERROR_TYPE.USER_NOT_FOUND
							? ts(`first-login.${ERROR_TYPE.USER_NOT_FOUND}`)
							: error
					}
					handleSubmit={handleSubmit(onSubmit)}
					isLoading={isLoading}
					submitButtonText={ts("join-course")}
					title={ts("first-login.title")}
				>
					<FormTextField
						errorMessage={errors?.firstName?.message}
						formRegister={register("firstName")}
						label={t("basics.firstName")}
					/>
					<FormTextField
						errorMessage={errors?.lastName?.message}
						formRegister={register("lastName")}
						label={t("basics.lastName")}
					/>
				</FormContainer>
			)}
		</div>
	);
}
