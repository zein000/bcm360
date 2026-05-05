import { Global, Module, forwardRef } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import cacheConfig from "./config/caching.config";
import { CACHE_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA } from "./config/caching.config.schema";

import { UsersModule } from "../users/users.module";
import { CachingConfigService } from "./caching-config.service";
import { ClearUserInfoCacheInterceptor } from "./interceptors/clear-user-info.interceptor";
import { BlacklistJwtCachingService } from "./services/blacklist-caching.service";
import { UserInfoCachingService } from "./services/user-info-caching.service";
import { ScenarioProgressCachingService } from "./services/scenario-progress-caching.service";

/**
 * Klasse: CachingModule
 *
 * Dieses globale Modul stellt zentrale Caching-Funktionalitäten zur Verfügung,
 * wie z. B. das Cachen von Benutzerinformationen, JWT-Blacklisting oder Fortschritt in Szenarien.
 *
 * Verwendungszweck:
 * - Zentralisierung der Cache-Konfiguration (Redis, MemoryStore, etc.)
 * - Bereitstellung spezialisierter Services für verschiedene Caching-Anwendungsfälle
 * - Ermöglicht über Interceptor das automatische Leeren von Cacheeinträgen bei Änderungen
 *
 * Besonderheiten:
 * - Nutzt `@Global()`, damit das Modul nur einmal geladen werden muss und global zur Verfügung steht
 * - Konfiguration und Validierung der Umgebungsvariablen erfolgt über `ConfigModule` mit Schema
 * - Asynchrone Registrierung des `CacheModule` mit dynamischer Konfigurationsklasse
 *
 * Exporte:
 * - Alle relevanten Caching-Services und Interceptor werden exportiert zur Wiederverwendung in anderen Modulen
 */
@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			load: [cacheConfig],
			validationSchema: CACHE_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA,
		}),
		CacheModule.registerAsync({
			imports: [
				ConfigModule.forRoot({
					load: [cacheConfig],
				}),
			],
			useClass: CachingConfigService,
		}),
		forwardRef(() => UsersModule),
	],
	controllers: [],
	providers: [
		UserInfoCachingService,
		ClearUserInfoCacheInterceptor,
		BlacklistJwtCachingService,
		ScenarioProgressCachingService,
	],
	exports: [
		UserInfoCachingService,
		ClearUserInfoCacheInterceptor,
		BlacklistJwtCachingService,
		ScenarioProgressCachingService,
	],
})
export class CachingModule {}
