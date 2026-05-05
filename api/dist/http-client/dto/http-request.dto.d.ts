import { HttpClientService } from "../http-client.service";
export type HttpRequestDTO = {
    method: "post" | "get" | "delete" | "put" | "patch";
    url: string;
    data: Parameters<HttpClientService["post"]>["0"]["data"];
    options: Parameters<HttpClientService["post"]>["0"]["options"];
    timeout?: number;
};
