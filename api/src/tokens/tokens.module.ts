import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";

import { TOKEN_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA } from "src/tokens/config/token.config.schema";

import tokenConfig from "./config/token.config";

import { UsersModule } from "../users/users.module";
import ChangeRequest from "./models/change-request.model";
import Token from "./models/token.model";
import { ChangeRequestRepository } from "./repositories/change-request.repository";
import { TokenRepository } from "./repositories/token.repository";
import { TokensController } from "./tokens.controller";
import { TokensService } from "./tokens.service";

/**
 * Klasse: TokensModule
 *
 * Dieses Modul kapselt die gesamte Token-Verwaltung innerhalb der Anwendung.
 * Es enthält Funktionen zur Verarbeitung von Einladungs- und Änderungs-Tokens sowie
 * zur Validierung und zum erneuten Versand.
 *
 * Verwendungszweck:
 * - Validierung von Einladungs- oder Änderungs-Links per Token
 * - Verwaltung von `Token` und `ChangeRequest` Datenbankmodellen
 * - Konfigurierbar über Umgebungsvariablen mittels `tokenConfig`
 *
 * Enthaltene Bestandteile:
 * - `TokensController`: Endpunkte zur Token-Verarbeitung (z.B. /token/validate)
 * - `TokensService`: Geschäftslogik zur Validierung, Erstellung und Wiederverwendung von Tokens
 * - `TokenRepository`: Datenbankzugriff auf Token-Entitäten
 * - `ChangeRequestRepository`: Verwaltung von Änderungsanforderungen (z.B. E-Mail-Änderungen)
 *
 * Exporte:
 * - `TokensService` wird exportiert, um auch in anderen Modulen darauf zugreifen zu können
 */
@Module({
	imports: [
		SequelizeModule.forFeature([Token, ChangeRequest]),
		forwardRef(() => UsersModule),
		ConfigModule.forRoot({
			load: [tokenConfig],
			validationSchema: TOKEN_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA,
		}),
	],
	controllers: [TokensController],
	providers: [TokensService, TokenRepository, ChangeRequestRepository],
	exports: [TokensService],
})
export class TokensModule {}
