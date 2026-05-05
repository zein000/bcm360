import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { LoggerModule } from "nestjs-pino";

import { CacheModule } from "@nestjs/cache-manager";

import { TwoFactorAuthenticationModule } from "../2fa/2fa.module";
import { AuthModule } from "../auth/auth.module";
import { DatabaseModule } from "../database/database.module";
import { MailModule } from "../mail/mail.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { RolesModule } from "../roles/roles.module";
import { UsersModule } from "../users/users.module";

import { CachingModule } from "../caching/caching.module";
import { RequestIdMiddleware } from "../common/middlewares/request-id.middleware";
import { ConfigurationModule } from "../configuration/configuration.module";
import { REQUEST_ID_HEADER } from "../constants";
import { EventHistoryModule } from "../event-history/event-history.module";
import { HealthModule } from "../health/health.module";
import { SeederModule } from "../seeder/seeder.module";
import { ViewEngineModule } from "../view-engine/view-engine.module";
import appConfig from "./config/app.config";

import { JwtTwoFactorGuard } from "src/auth/guards/jwt-two-factor.guard";
import { CompanyModule } from "src/company/company.module";
import { CourseProgressModule } from "src/course-progress/course-progress.module";
import { CourseModule } from "src/courses/course.module";
import { FeaturesModule } from "src/features/features.module";
import { FileModule } from "src/file/file.module";
import { RetryModule } from "../retry/retry.module";

/**
 * Klasse: AppModule
 *
 * Das Hauptmodul der Anwendung. Es importiert und initialisiert alle anderen Module
 * und globale Middleware, Guards und Konfigurationsdienste.
 *
 * Features:
 * - Globale Logger-Integration via `nestjs-pino`
 * - Caching, Konfiguration, Datenbank und Schedulers
 * - Health Checks, Throttling (Rate-Limiting) und Seeder-Support
 * - Optional: Retry-Mechanismus für externe Services
 * - Middleware zur Anreicherung von Requests mit Request-ID (`RequestIdMiddleware`)
 *
 * Hinweise:
 * - `APP_GUARD` registriert den `ThrottlerGuard` global
 * - Logging-Verhalten wird basierend auf `logToken` dynamisch angepasst (Cloud vs. lokal)
 */
@Module({
	imports: [
		ConfigModule.forRoot({
			cache: false,
			envFilePath: ".env",
		}),
		CacheModule.register(),
		ScheduleModule.forRoot(),
		LoggerModule.forRoot({
			pinoHttp: {
				level: appConfig().logLevel,
				genReqId: (request) => request.headers[REQUEST_ID_HEADER],
				redact: ["req.headers.authorization", "req.body.password", "req.body.confirmPassword"],
				serializers: {
					req(req) {
						req.body = req.raw.body;
						delete req.body;
						delete req.headers;
						return req;
					},
					res(res) {
						delete res.headers;
						return res;
					},
				},
				transport: appConfig().logToken
					? {
							target: "@logtail/pino",
							options: {
								sourceToken: appConfig().logToken,
							},
						}
					: {
							target: "pino-pretty",
							options: {
								colorize: true,
							},
						},
			},
		}),
		ThrottlerModule.forRoot([
			{
				ttl: appConfig().throttleTtl,
				limit: appConfig().throttleLimit,
			},
		]),
		// Core system modules
		HealthModule,
		ViewEngineModule,
		DatabaseModule,
		UsersModule,
		MailModule,
		AuthModule,
		TwoFactorAuthenticationModule,
		RolesModule,
		PermissionsModule,
		CourseProgressModule,
		ConfigurationModule,
		RetryModule,
		SeederModule,
		EventHistoryModule,
		CachingModule,
		CompanyModule,
		CourseModule,
		FeaturesModule,
		FileModule,
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {
	/**
	 * Registriert globale Middleware — z.B. zur Generierung und Übergabe von Request-IDs.
	 */
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(RequestIdMiddleware).forRoutes("*");
	}
}
