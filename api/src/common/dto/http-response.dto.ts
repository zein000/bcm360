import { AxiosError } from "axios";

export type HttpResponseDTO<T> = { success: boolean; data?: T; error?: AxiosError };
