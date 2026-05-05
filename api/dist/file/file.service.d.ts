import { ConfigType } from "@nestjs/config";
import awsConfig from "./aws.config/aws.config";
import { FileTypes } from "src/file/enum/FileTypes.enum";
export declare class FileService {
    private config;
    private readonly logger;
    private readonly client;
    private readonly fullBucketPrefix;
    private readonly fullBucketPrefixWithPort;
    constructor(config: ConfigType<typeof awsConfig>);
    uploadTempFile(path: string, file: string): Promise<string>;
    uploadFiles(files: Express.Multer.File[], isReturnOnlyLinks?: boolean): Promise<{
        fullFilePath: string;
        fileName: string;
        fileLength: number;
        fileType: FileTypes;
    }[] | string[]>;
    deleteFile(path: string): Promise<void>;
    deleteFiles(paths: string[]): Promise<{
        Error?: {
            Code?: string;
            Message?: string;
            Key?: string;
            VersionId?: string;
        };
    }[]>;
}
