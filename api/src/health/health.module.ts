import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";

import { HealthController } from "./health.controller";

/**
 * Klasse: HealthModule
 *
 * Dieses Modul bündelt alle Funktionalitäten zur Gesundheitsprüfung (Health Checks) der Anwendung.
 * Es verwendet das `@nestjs/terminus` Modul, um z. B. die Erreichbarkeit der Datenbank zu prüfen.
 *
 * Verwendungszweck:
 * - Ermöglicht Health-Endpunkte für Load Balancer, Container-Orchestrierung oder Monitoring-Systeme
 * - Wird meist in Infrastruktur-Setups zur Überwachung des Anwendungsstatus verwendet
 *
 * Bestandteile:
 * - `TerminusModule`: NestJS-Modul für standardisierte Health Checks (z. B. für DB, Memory, HTTP, etc.)
 * - `HealthController`: Stellt den `/health`-Endpunkt bereit
 */
@Module({
	imports: [TerminusModule],
	controllers: [HealthController],
})
export class HealthModule {}
