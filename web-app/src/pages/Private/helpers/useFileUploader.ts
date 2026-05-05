import {
	useDeleteFilesFromBucketMutation,
	useUploadFilesToBucketMutation,
} from "@/redux/files.api";

export const useFilesUploader = () => {
	const [uploadFilesToBucket, { isLoading: isUploading }] = useUploadFilesToBucketMutation();
	const [deleteFilesFromBucket, { isLoading: isDeleting }] = useDeleteFilesFromBucketMutation();

	const upload = async (files: File[]) => {
		try {
			const formData = new FormData();

			files.forEach((file) => {
				formData.append("files", file);
			});

			return uploadFilesToBucket(formData).unwrap();
		} catch (e) {
			console.log("Error uploading", e);

			return [];
		}
	};

	const removeFile = async (filePaths: string[]) => {
		try {
			return await deleteFilesFromBucket(filePaths).unwrap();
		} catch (e) {
			console.log("Error deleting file", e);
		}
	};

	return {
		uploadFilesToBucket: upload,
		deleteFilesFromBucket: removeFile,
		isLoading: isUploading || isDeleting,
	};
};
