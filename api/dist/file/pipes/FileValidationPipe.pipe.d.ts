import { PipeTransform } from "@nestjs/common";
export declare class FileValidationPipe implements PipeTransform {
    transform(files: Express.Multer.File[]): Express.Multer.File[];
}
