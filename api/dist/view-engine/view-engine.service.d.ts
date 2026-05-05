import { ConfigType } from "@nestjs/config";
import viewEngineConfig from "src/view-engine/config/view-engine.config";
export declare class ViewEngineService {
    private config;
    private readonly logger;
    private templates;
    private layouts;
    private partials;
    constructor(config: ConfigType<typeof viewEngineConfig>);
    render<DataType extends Record<string, unknown>>(templateName: string, options?: {
        data?: DataType;
        layout?: string;
    }): string;
}
