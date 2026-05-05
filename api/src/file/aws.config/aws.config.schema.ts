import * as Joi from "joi";

/**
 * Konstante: AWS_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA
 *
 * Dieses Joi-Schema validiert alle Umgebungsvariablen, die für die AWS- bzw. MinIO-Konfiguration benötigt werden.
 * Es stellt sicher, dass beim Start der Anwendung alle relevanten Informationen vorhanden sind.
 *
 * Typische Verwendung:
 * - In `ConfigModule.forRoot({ validationSchema })` eingebunden
 * - Schützt vor fehlerhafter oder unvollständiger Konfiguration im Deployment
 *
 * Erwartete Umgebungsvariablen:
 * - MINIO_BUCKET:      Name des verwendeten Buckets
 * - MINIO_ACCESS_KEY:  Zugriffsschlüssel (Access Key) für MinIO/AWS
 * - MINIO_SECRET_KEY:  Geheimschlüssel (Secret Key) für MinIO/AWS
 * - AWS_REGION:        AWS-Region (z. B. "eu-central-1")
 * - AWS_PATHNAME:      Basis-Pfad oder Bucket-Pfad (z. B. für URL-Generierung)
 */
export const AWS_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA = Joi.object({
	MINIO_BUCKET: Joi.string().required(),
	MINIO_ACCESS_KEY: Joi.string().required(),
	MINIO_SECRET_KEY: Joi.string().required(),
	AWS_REGION: Joi.string().required(),
	AWS_PATHNAME: Joi.string().required(),
});
