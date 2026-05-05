import { FileService } from "./file.service";
export declare class FileController {
    private readonly fileService;
    constructor(fileService: FileService);
    uploadFiles(files: Express.Multer.File[]): Promise<string[] | {
        fullFilePath: string;
        fileName: string;
        fileLength: number;
        fileType: import("./enum/FileTypes.enum").FileTypes;
    }[]>;
    deleteFile(filePath: string): Promise<void>;
}
