import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import * as Minio from "minio";

import awsConfig from "./aws.config/aws.config";
import { FileTypes } from "src/file/enum/FileTypes.enum";
import { FileTypeToMimetype } from "./contants/FileTypeToMimetype";

/**
 * Service: FileService
 *
 * Dieser Service kapselt alle Dateioperationen für einen S3-kompatiblen Speicher (z. B. MinIO, AWS S3).
 * Unterstützt:
 * - Datei-Upload (mit Typ-Erkennung)
 * - Datei-Löschung
 * - Generierung von vollständigen Pfaden (public links)
 *
 * Verwendet MinIO SDK für die S3-API-Kommunikation.
 */
@Injectable()
export class FileService {
	private readonly logger = new Logger(FileService.name);

	/** MinIO-Client für Upload/Löschung */
	private readonly client: Minio.Client;

	/** Prefix für vollständige Pfade z. B. https://s3.endpoint/bucketName/ */
	private readonly fullBucketPrefix: string;
	private readonly fullBucketPrefixWithPort: string;

	constructor(
		@Inject(awsConfig.KEY)
		private config: ConfigType<typeof awsConfig>
	) {
		this.client = new Minio.Client({
			endPoint: config.endpoint || "127.0.0.1",
			port: config.port,
			accessKey: config.accessKey,
			secretKey: config.secretAccessKey,
			region: config.region,
			useSSL: false,
		});
		this.fullBucketPrefix = `http://${this.config.endpoint}/${this.config.bucketName}/`;
		this.fullBucketPrefixWithPort = `http://${this.config.endpoint}:${this.config.port}/${this.config.bucketName}/`;
	}

	/**
	 * Funktion: uploadTempFile
	 *
	 * Lädt eine temporäre Datei aus dem lokalen Dateisystem in den S3-Bucket hoch.
	 *
	 * @param path - Lokaler Dateipfad
	 * @param file - Zieldateiname im Bucket
	 * @returns Vollständiger Pfad innerhalb des Buckets (bucketName/pfad)
	 */
	async uploadTempFile(path: string, file: string): Promise<string> {
		try {
			await this.client.fPutObject(this.config.bucketName, file, path);
			return `${this.config.bucketName}/${file}`;
		} catch (e) {
			this.logger.error(e.message, e.stack);
		}
	}

	/**
	 * Funktion: uploadFiles
	 *
	 * Lädt mehrere Dateien aus einem Multer-Upload in den Bucket hoch.
	 * Optional: Gibt nur URLs zurück oder detaillierte File-Objekte inkl. Typ & Größe.
	 *
	 * @param files - Array von Multer-Dateien
	 * @param isReturnOnlyLinks - true: Nur URLs zurückgeben, false: mit Metadaten
	 * @returns Liste der hochgeladenen Dateien (als Link oder mit Details)
	 */
	async uploadFiles(
		files: Express.Multer.File[],
		isReturnOnlyLinks = false
	): Promise<
		{ fullFilePath: string; fileName: string; fileLength: number; fileType: FileTypes }[] | string[]
	> {
		try {
			const filePaths = [];
			for (const file of files) {
				const path = `${this.config.pathname}/public/${Date.now()}-${file.originalname}`;
				await this.client.putObject(this.config.bucketName, path, file.buffer);

				if (isReturnOnlyLinks) {
					filePaths.push(this.fullBucketPrefix + path);
				} else {
					let fileType = FileTypes.Unknown;
					if (file?.mimetype && FileTypeToMimetype[file?.mimetype]) {
						fileType = FileTypeToMimetype[file.mimetype];
					}
					filePaths.push({
						fileType,
						fullFilePath: this.fullBucketPrefixWithPort + path,
						fileName: file.originalname,
						fileLength: file.size,
					});
				}
			}
			return filePaths;
		} catch (e) {
			this.logger.error(e.message, e.stack);
			throw e;
		}
	}

	/**
	 * Funktion: deleteFile
	 *
	 * Löscht eine einzelne Datei aus dem Bucket anhand ihres vollständigen Pfads.
	 *
	 * @param path - Vollständige URL oder Pfad zur Datei
	 */
	async deleteFile(path: string) {
		try {
			const objectLocalPath = path.replace(this.fullBucketPrefix, "");
			await this.client.removeObject(this.config.bucketName, objectLocalPath);
		} catch (e) {
			this.logger.error(`Error deleting file at ${path}: ${e.message}`, e.stack);
		}
	}

	/**
	 * Funktion: deleteFiles
	 *
	 * Löscht mehrere Dateien aus dem Bucket anhand ihrer vollständigen Pfade.
	 *
	 * @param paths - Liste der URLs oder Pfade
	 */
	async deleteFiles(paths: string[]) {
		try {
			const objectLocalPaths = paths.map((path) => path.replace(this.fullBucketPrefix, ""));
			return this.client.removeObjects(this.config.bucketName, objectLocalPaths);
		} catch (e) {
			this.logger.error(`Error deleting files at ${paths.join(", ")}: ${e.message}`, e.stack);
		}
	}
}
