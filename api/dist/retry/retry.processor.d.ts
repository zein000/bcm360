import { WorkerHost } from "@nestjs/bullmq";
import { Job as BullQJob } from "bullmq";
import { HttpRequestDTO } from "src/http-client/dto/http-request.dto";
import { HttpClientService } from "src/http-client/http-client.service";
export declare class RetryProcessor extends WorkerHost {
    private readonly httpClient;
    private readonly logger;
    constructor(httpClient: HttpClientService);
    process(job: BullQJob<any, any, string>): Promise<void>;
    handleRequest(job: BullQJob<HttpRequestDTO>): Promise<void>;
}
