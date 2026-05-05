import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

/**
 * Klasse: ApiKeyAuthGuard
 *
 * Dieser Guard schützt HTTP-Endpunkte mithilfe eines statischen API-Schlüssels,
 * der in den Headern (`api-key`) übermittelt und mit einer Umgebungsvariablen (`API_KEY`) verglichen wird.
 *
 * Verwendung:
 * - Ideal für einfache, systeminterne oder externe Integrationen (z.B. Webhooks, externe Tools)
 * - Kann z.B. mit `@UseGuards(ApiKeyAuthGuard)` auf beliebige Routen angewendet werden
 *
 * Hinweis:
 * - Die Header-Bezeichnung `api-key` und Umgebungsvariable `API_KEY` können angepasst werden
 */
@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();

		const apiKey = request.headers['api-key']; // Header-Feld für den API-Schlüssel

		if (!apiKey) {
			throw new UnauthorizedException('API key is missing.');
		}

		// Prüfung gegen Umgebungsvariable
		if (apiKey !== process.env.API_KEY) {
			throw new UnauthorizedException('Invalid API key.');
		}

		return true;
	}
}
