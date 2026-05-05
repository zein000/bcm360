/**
 * Klasse: CourseProgressModule
 *
 * Dieses globale Modul stellt die zentrale Logik zur Verwaltung des Kursfortschritts dar.
 * Es kapselt Funktionen wie Fortschrittsverfolgung, Protokollierung von Entscheidungen und Nachrichten,
 * WebSocket-Kommunikation, Authentifizierung und Konfigurationsmanagement.
 *
 * Es integriert verschiedene Datenbankmodelle, stellt HTTP-Controller und WebSocket-Gateways bereit
 * und bindet externe Module wie Authentifizierung, E-Mail, Zeitplanung und JWT-Handling ein.
 */

import { Global, Module } from "@nestjs/common";
import { CourseProgressService } from "./course-progress.service";
import { CourseProgressController } from "./course-progress.controller";
import CourseProgress from "./models/course-progress.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { CourseProgressRepository } from "./repositories/course-progress.repository";
import { CourseProgressGateway } from "./course-progress.gateway";
import { AuthModule } from "src/auth/auth.module";
import { CourseModule } from "src/courses/course.module";
import ProtocolHistories from "./models/protocol-histories.model";
import ProtocolDecisions from "./models/protocol-decisions.model";
import ProtocolMessages from "./models/protocol-messages.model";
import { MailModule } from "src/mail/mail.module";
import { ConfigModule } from "@nestjs/config";
import appConfig from "src/app/config/app.config";
import { JwtModule } from "@nestjs/jwt";
import jwtConfig from "src/auth/config/jwt.config";
import { JWTOptionsService } from "src/auth/jwt-options.service";
import CourseProgressUsers from "./models/course-progress-users.model";
import CourseProgressContent from "./models/course-progress-content.model";
import { ExportScenarioProgressService } from "./export-scenario-progress.service";
import ProtocolDecisionUserModel from "./models/protocol-decision-user.model";
import { ScheduleModule } from "@nestjs/schedule";
import { CourseProgressContentRepository } from "./repositories/course-progress-content.repository";
import { CourseProgressUsersRepository } from "./repositories/course-progress-users.repository";
import { ProtocolDecisionRepository } from "./repositories/protocol-decisions.repository";
import { ProtocolHistoryRepository } from "./repositories/protocol-history.repository";
import { ProtocolMessagesRepository } from "./repositories/protocol-messages.repository";

@Global() // Macht dieses Modul global verfügbar (muss nicht explizit importiert werden)
@Module({
	imports: [
		/**
		 * Importiert Datenbankmodelle für Sequelize ORM, die für das Kursfortschritts-Feature nötig sind.
		 */
		SequelizeModule.forFeature([
			CourseProgress,
			ProtocolHistories,
			ProtocolDecisions,
			ProtocolMessages,
			CourseProgressUsers,
			CourseProgressContent,
			ProtocolDecisionUserModel,
		]),

		/**
		 * Importiert weitere funktionale Module:
		 * - AuthModule: für Authentifizierung & Autorisierung
		 * - CourseModule: für Kursmanagement
		 * - MailModule: für E-Mail-Versand
		 * - ScheduleModule: für geplante Tasks (z. B. regelmäßige Aktionen)
		 */
		AuthModule,
		CourseModule,
		MailModule,
		ScheduleModule.forRoot(),

		/**
		 * Lädt globale Konfiguration (z. B. Umgebungsvariablen)
		 */
		ConfigModule.forRoot({
			load: [appConfig],
		}),

		/**
		 * Konfiguriert JWT-Modul asynchron mit Konfiguration aus Datei (z. B. geheimer Schlüssel, Ablaufzeit)
		 */
		JwtModule.registerAsync({
			imports: [
				ConfigModule.forRoot({
					load: [jwtConfig],
				}),
			],
			useClass: JWTOptionsService,
		}),
	],

	/**
	 * HTTP-Routing über Controller für Kursfortschritts-Endpunkte
	 */
	controllers: [CourseProgressController],

	/**
	 * Businesslogik, Repositories für Datenbankzugriffe,
	 * Gateways für WebSocket-Kommunikation
	 */
	providers: [
		CourseProgressService,
		CourseProgressRepository,
		CourseProgressGateway,
		ExportScenarioProgressService,
		CourseProgressContentRepository,
		CourseProgressUsersRepository,
		ProtocolDecisionRepository,
		ProtocolHistoryRepository,
		ProtocolMessagesRepository,
	],

	/**
	 * Exportiert Kernbestandteile für Wiederverwendung in anderen Modulen
	 */
	exports: [
		CourseProgressService,
		CourseProgressRepository,
		CourseProgressGateway,
	],
})
export class CourseProgressModule {}
