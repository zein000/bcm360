import { PipeTransform, ArgumentMetadata } from "@nestjs/common";
export declare class TrimPipe implements PipeTransform {
    private isObj;
    private trim;
    transform(value: never, metadata: ArgumentMetadata): object;
}
