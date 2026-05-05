import { registerAs } from "@nestjs/config";

/**
 * Konfiguration: aws
 *
 * Diese Konfiguration registriert AWS- bzw. MinIO-spezifische Umgebungsvariablen
 * unter dem Schlüssel `"aws"` für den NestJS `ConfigService`.
 *
 * Wird verwendet, um Zugriff auf S3-kompatible Speicherlösungen (z. B. MinIO oder AWS S3) zu ermöglichen.
 *
 * Verwendete Umgebungsvariablen:
 * - MINIO_ENDPOINT:     URL oder Host des MinIO-Servers (z. B. http://localhost:9000)
 * - MINIO_BUCKET:       Name des Buckets, in dem Dateien gespeichert werden
 * - MINIO_ACCESS_KEY:   Zugriffsschlüssel (Access Key) für MinIO/AWS
 * - MINIO_SECRET_KEY:   Geheimschlüssel (Secret Key) für MinIO/AWS
 * - AWS_REGION:         Die Region (nur für AWS erforderlich, z. B. "eu-central-1")
 * - AWS_PATHNAME:       Optionaler Pfad, z. B. Basisordner im Bucket
 *
 * Beispielnutzung:
 * ```ts
 * const accessKey = configService.get("aws.accessKey");
 * const bucket = configService.get("aws.bucketName");
 * ```
 */
export default registerAs("aws", () => ({
	endpoint: process.env.MINIO_ENDPOINT,
	bucketName: process.env.MINIO_BUCKET,
	accessKey: process.env.MINIO_ACCESS_KEY,
	secretAccessKey: process.env.MINIO_SECRET_KEY,
	region: process.env.AWS_REGION,
	pathname: process.env.AWS_PATHNAME,
	port: Number(process.env.MINIO_PORT)
}));
