import { FileAssignment } from "../pages/Courses/enums/FileAssignment.enum";
import {
	useDeleteCourseFileMutation,
	useUploadCourseFilesMutation,
} from "../redux/courses/courses.api";

export const useCourseFiles = () => {
	const [uploadCourseFiles, { isLoading: isUploading }] = useUploadCourseFilesMutation();
	const [deleteCourseFile, { isLoading: isDeleting }] = useDeleteCourseFileMutation();

	const upload = async (files: File[], fileAssignment: FileAssignment = FileAssignment.Content) => {
		try {
			const formData = new FormData();

			files.forEach((file) => {
				formData.append("files", file);
			});

			formData.append("fileAssignment", fileAssignment);

			return uploadCourseFiles(formData).unwrap();
		} catch (e) {
			console.log("Error uploading", e);
		}
	};

	const removeFile = async (filePath: string) => {
		try {
			await deleteCourseFile(filePath).unwrap();
			console.log("File deleted successfully");
		} catch (e) {
			console.log("Error deleting file", e);
		}
	};

	return {
		uploadCourseFiles: upload,
		deleteCourseFile: removeFile,
		isLoading: isUploading || isDeleting,
	};
};
