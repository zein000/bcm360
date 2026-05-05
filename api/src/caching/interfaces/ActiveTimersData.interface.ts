/**
 * Interface: ActiveTimersData
 *
 * Dieses Interface beschreibt die Struktur für das Speichern aktiver Timer im Cache.
 * Jeder Eintrag stellt eine Kurs-ID (oder ein anderer eindeutiger Schlüssel) dar,
 * welcher einem numerischen Zeitstempel (z.B. Stage-Endzeitpunkt) zugeordnet ist.
 *
 * Verwendungszweck:
 * - Verwaltung der verbleibenden Zeit pro Kurs oder Szenario im `ScenarioProgressCachingService`
 * - Zugriff über: `ActiveTimersData[courseId]`
 *
 * Beispiel:
 * ```ts
 * {
 *   "course-123": 1712345678901,
 *   "course-456": 1712349876543
 * }
 * ```
 */
export interface ActiveTimersData {
	[key: string]: number;
}
