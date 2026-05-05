import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { HealthCheckService, HealthCheck, SequelizeHealthIndicator } from "@nestjs/terminus";

/**
 * Klasse: HealthController
 *
 * Dieser Controller stellt einen Endpunkt zur Verfügung, mit dem der Gesundheitszustand
 * der Anwendung überprüft werden kann – insbesondere die Verbindung zur Datenbank.
 *
 * Verwendungszweck:
 * - Wird z. B. von Monitoring-Systemen (wie Kubernetes, Docker, Prometheus) genutzt
 *   um Health- oder Readiness-Probes durchzuführen.
 * - Liefert standardisierte Statusmeldungen im JSON-Format
 *
 * Endpunkt:
 * - `GET /health` → Führt einen einfachen Datenbank-"Ping" durch
 *
 * Verwendete Tools:
 * - `@nestjs/terminus`: Erweiterung für Health Checks in NestJS
 * - `SequelizeHealthIndicator`: Prüft, ob die Sequelize-Datenbankverbindung aktiv ist
 */
@ApiTags("health")
@Controller("health")
export class HealthController {
	constructor(
		private health: HealthCheckService,
		private db: SequelizeHealthIndicator
	) {}

	@Get()
	@HealthCheck()
	check() {
		return this.health.check([
			() => this.db.pingCheck("database")
		]);
	}
}
