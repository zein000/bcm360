import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule } from "@nestjs/config";

import { UserBlacklistModule } from "src/user-blacklist/user-blacklist.module";
import { MailModule } from "src/mail/mail.module";
import { RolesModule } from "src/roles/roles.module";
import { TokensModule } from "src/tokens/tokens.module";

import Company from "src/company/models/company.model";

import appConfig from "../app/config/app.config";
import { AuthModule } from "../auth/auth.module";
import { UsersController } from "./users.controller";
import { CachingModule } from "../caching/caching.module";
import { EventHistoryModule } from "../event-history/event-history.module";
import Role from "../roles/models/role.model";
import User from "./models/user.model";
import { UserRepository } from "./repositories/user.repository";
import { UsersSeeder } from "./users.seeder";
import { UsersService } from "./users.service";
/**
 * Modul: UsersModule
 *
 * Dieses Modul kapselt sämtliche Funktionalitäten rund um Benutzerverwaltung,
 * einschließlich:
 * - Authentifizierung und Login/Logout
 * - Einladungen und Passwortmanagement
 * - Rollen- und Rechteverwaltung
 * - Benutzerabfragen und Updates
 *
 * Es bindet notwendige Services wie Rollen, Mailversand, Tokenmanagement,
 * Caching und Event History ein.
 *
 * Außerdem registriert es Sequelize-Modelle für User, Role und Company.
 */
@Module({
	imports: [
		// Registriert die Modelle für Sequelize
		SequelizeModule.forFeature([User, Role, Company]),

		// Ermöglicht Authentifizierung und Tokenmanagement
		forwardRef(() => AuthModule),
		forwardRef(() => TokensModule),
		forwardRef(() => RolesModule),

		// Weitere Integrationen
		forwardRef(() => CachingModule),
		forwardRef(() => UserBlacklistModule),
		MailModule,
		EventHistoryModule,

		// Konfigurationsmanagement (z. B. Umgebungsvariablen)
		ConfigModule.forRoot({
			load: [appConfig],
		}),
	],

	// REST-Controller zur Benutzerverwaltung
	controllers: [UsersController],

	// Services und Repositories
	providers: [UsersService, UserRepository, UsersSeeder],

	// Exportiert diese für andere Module (z. B. AuthModule)
	exports: [UsersService, UserRepository, UsersSeeder],
})
export class UsersModule {}
