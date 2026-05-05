import { NestFactory } from "@nestjs/core";

import { Seeder } from "./seeder/seeder";
import { SeederModule } from "./seeder/seeder.module";

/**
 * Datei: main.ts
 *
 * Diese Datei dient als Einstiegspunkt für das Seeder-Skript des Projekts.
 *
 * Ziel: Initialisierung und Ausführung von Seed-Daten mithilfe von NestJS'
 * Dependency Injection und Lifecycle-Management.
 *
 * Ablauf:
 * 1. Es wird ein NestJS Application Context auf Basis des `SeederModule` erstellt.
 * 2. Aus dem Context wird eine Instanz der `Seeder` Klasse geladen.
 * 3. Die `seed()` Methode dieser Klasse wird aufgerufen, um Seed-Daten in die Datenbank zu schreiben.
 * 4. Danach wird der Application Context sauber geschlossen, unabhängig davon, ob der Seed-Vorgang erfolgreich war oder nicht.
 */

async function bootstrap() {
	const appContext = await NestFactory.createApplicationContext(SeederModule);
	const seeder = appContext.get(Seeder);

	try {
		await seeder.seed();
	} finally {
		appContext.close();
	}
}

bootstrap();
