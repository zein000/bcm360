import { api } from "./api";

export const filesApi = api.injectEndpoints({
	endpoints: (builder) => ({
		uploadFilesToBucket: builder.mutation<string[], FormData>({
			query: (body) => ({
				url: "files/upload",
				method: "POST",
				body,
			}),
		}),
		deleteFilesFromBucket: builder.mutation<void, string[]>({
			query: (filePath) => ({
				url: `files/delete`,
				method: "DELETE",
				body: {
					filePath,
				},
			}),
		}),
	}),
});

export const { useUploadFilesToBucketMutation, useDeleteFilesFromBucketMutation } = filesApi;
export const filesApiReducer = filesApi.reducer;
export const filesApiMiddleware = filesApi.middleware;
