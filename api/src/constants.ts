import { join } from "path";

/**
 * Konstante: BCRYPT_HASH_SALT_ROUNDS
 *
 * Gibt die Anzahl der Salt-Runden an, die beim Hashen von Passwörtern mit Bcrypt verwendet werden.
 * Eine höhere Anzahl erhöht die Sicherheit, aber auch die Rechenzeit.
 *
 * Beispiel:
 * bcrypt.hash(password, BCRYPT_HASH_SALT_ROUNDS)
 */
export const BCRYPT_HASH_SALT_ROUNDS = 10;

/**
 * Konstante: ROOT_DIR
 *
 * Definiert das Stammverzeichnis des Projekts relativ zu dieser Datei.
 * Wird häufig verwendet, um absolute Pfade zu generieren (z. B. für Dateisystemzugriffe).
 *
 * Beispiel:
 * join(ROOT_DIR, 'src', 'config')
 */
export const ROOT_DIR = join(__dirname, "..");

/**
 * Konstante: REQUEST_ID_HEADER
 *
 * Der Name des HTTP-Headers, der eine eindeutige Request-ID enthält.
 * Wird verwendet, um Anfragen in Logging- oder Tracing-Systemen zu identifizieren.
 *
 * Beispiel:
 * x-request-id: 123e4567-e89b-12d3-a456-426614174000
 */
export const REQUEST_ID_HEADER = "x-request-id";
