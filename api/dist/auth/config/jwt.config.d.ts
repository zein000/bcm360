declare const _default: (() => {
    secret: string;
    expiration: string;
    refreshSecret: string;
    refreshExpiration: string;
    otpSecret: string;
    otpJWTExpiration: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    secret: string;
    expiration: string;
    refreshSecret: string;
    refreshExpiration: string;
    otpSecret: string;
    otpJWTExpiration: string;
}>;
export default _default;
