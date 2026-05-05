import { HttpService } from "@nestjs/axios";
import { AxiosBasicCredentials, AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import { JobsOptions, Queue } from "bullmq";
import { ApiApplications } from "src/enums/application.enum";
import { ConfigurationService } from "src/configuration/configuration.service";
import { HttpResponseDTO } from "../common/dto/http-response.dto";
export declare class HttpClientService {
    private readonly httpService;
    private retryQueue;
    private readonly configurationService;
    private readonly logger;
    private validator;
    private proxyUrl;
    private proxyChain;
    private logging;
    constructor(httpService: HttpService, retryQueue: Queue, configurationService: ConfigurationService);
    private parseErrorForRetry;
    proxiedRequest(proxyURL: any, endpoint: any): Promise<any>;
    calcucateCosts(url: string, application: ApiApplications): Promise<number>;
    getCached<R>({ url, headers, params, companyId, listId, application, proxied, ignoreCache, retryMechanism, config, model, referenceId, }: {
        url: string;
        headers?: AxiosRequestHeaders;
        params?: object;
        companyId: number;
        listId?: number;
        application?: ApiApplications;
        proxied?: boolean;
        ignoreCache?: boolean;
        retryMechanism?: boolean;
        config?: AxiosRequestConfig;
        model?: string;
        referenceId?: number;
    }): Promise<HttpResponseDTO<R>>;
    get<R>(url: string, headers?: AxiosRequestHeaders, params?: object): Promise<HttpResponseDTO<R>>;
    postCached<T, R extends object>({ url, data, options, retryMechanism, timeout, companyId, listId, application, model, referenceId, ignoreCache, }: {
        url: string;
        data: T;
        options?: {
            headers?: AxiosRequestHeaders;
            params?: object;
        };
        timeout?: number;
        retryMechanism?: boolean;
        companyId: number;
        listId?: number;
        application?: ApiApplications;
        model: string;
        referenceId: number;
        ignoreCache?: boolean;
    }): Promise<HttpResponseDTO<R>>;
    delete<R extends object>({ url, options, }: {
        url: string;
        options?: {
            headers?: AxiosRequestHeaders;
            params?: object;
            auth?: AxiosBasicCredentials;
        };
    }): Promise<HttpResponseDTO<R>>;
    post<T, R extends object>({ url, data, options, retryJobOptions, retryMechanism, }: {
        url: string;
        data: T;
        options?: {
            headers?: AxiosRequestHeaders;
            params?: object;
            auth?: AxiosBasicCredentials;
        };
        retryMechanism?: boolean;
        retryJobOptions?: JobsOptions;
    }): Promise<HttpResponseDTO<R>>;
    isValid<T extends object>(url: any, user: T): Promise<void>;
    buildBasicAuth(username: string, password?: string): string;
}
