import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import awsConfig from "./aws.config/aws.config";
import { AWS_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA } from "./aws.config/aws.config.schema";

import { FileController } from "./file.controller";
import { FileService } from "./file.service";

/**
 * Modul: FileModule
 *
 * Dieses Modul kapselt alle Datei-bezogenen Funktionalitäten:
 * - Upload und Löschung von Dateien
 * - AWS S3 / MinIO Konfiguration über das ConfigModule
 *
 * Es registriert die Umgebungsvariablen mit Validierung und stellt den FileService
 * und Controller für den Rest der Anwendung bereit.
 */
@Module({
	imports: [
		/**
		 * Lädt AWS/MinIO-Konfiguration und validiert notwendige ENV-Variablen.
		 * Die Konfiguration wird unter dem Schlüssel `aws` registriert.
		 */
		ConfigModule.forRoot({
			load: [awsConfig],
			validationSchema: AWS_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA,
		}),
	],
	controllers: [FileController], // REST-Endpunkte für Datei-Upload/Löschung
	providers: [FileService],      // Logik für Interaktion mit dem Speicherservice
	exports: [FileService],        // Ermöglicht Nutzung des Services in anderen Modulen
})
export class FileModule {}
