export interface IAppConfig {
    webAppDomain: string;
    throttleTtl: number;
    throttleLimit: number;
    logLevel: string;
    env: string;
    logToken?: string | false;
}
declare const _default: (() => IAppConfig) & import("@nestjs/config").ConfigFactoryKeyHost<IAppConfig>;
export default _default;
