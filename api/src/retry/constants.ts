/**
 * Konstante: RETRY_QUEUE_NAME
 *
 * Definiert den Namen der Warteschlange für die Wiederholungsjobs.
 * Alle Jobs, die erneut ausgeführt werden müssen, werden dieser Warteschlange hinzugefügt.
 */
export const RETRY_QUEUE_NAME = "retry";

/**
 * Konstante: RETRY_QUEUE_JOBS_PREFIX
 *
 * Ein Präfix, das verwendet wird, um spezifische Job-Typen in der Wiederholungswarteschlange zu kennzeichnen.
 * In diesem Fall handelt es sich um "request"-basierte Jobs, die ausgeführt werden sollen.
 */
export const RETRY_QUEUE_JOBS_PREFIX = "request";
