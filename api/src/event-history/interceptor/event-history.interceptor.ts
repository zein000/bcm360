import {
	CallHandler,
	ExecutionContext,
	forwardRef,
	Inject,
	Injectable,
	mixin,
	NestInterceptor,
	Type,
} from "@nestjs/common";
import { map, Observable } from "rxjs";

import { EventName } from "../../enums/event-name.enum";
import { EventHistoryService } from "../event-history.service";

/**
 * Factory-Funktion: EventHistoryInterceptor
 *
 * Dieser Interceptor wird verwendet, um Ereignisprotokolle für bestimmte Aktionen
 * zu speichern, z. B. Registrierung oder andere benutzerdefinierte Ereignisse.
 *
 * Der Interceptor nimmt den `eventName` als Argument und speichert das Ereignis
 * nach der Ausführung der Anfrage.
 *
 * Nutzung:
 * - Kann als globaler oder spezifischer Interceptor angewendet werden
 * - Beispiel: `@UseInterceptors(EventHistoryInterceptor(EventName.REGISTRATION))`
 *
 * @param eventName - Name des Ereignisses, das protokolliert werden soll
 * @returns Eine NestInterceptor-Instanz, die das Ereignis speichert
 */
export const EventHistoryInterceptor = (eventName: EventName): Type<NestInterceptor> => {
	@Injectable()
	class EventHistoryInterceptor implements NestInterceptor {
		constructor(
			@Inject(forwardRef(() => EventHistoryService))
			private readonly eventHistoryService: EventHistoryService
		) {}

		/**
		 * Intercept-Methode zur Speicherung des Ereignisses
		 * nach der Bearbeitung der Anfrage.
		 *
		 * @param context - ExecutionContext für die aktuelle Anfrage
		 * @param next - CallHandler für die nächste Verarbeitung im Anfrage-Lifecycle
		 * @returns Eine Observable, die nach der Speicherung des Ereignisses zurückgegeben wird
		 */
		intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
			const request = context.switchToHttp().getRequest();
			const data: Record<string, unknown> = {};
			const userId = request.user?.id;

			// Daten für das Event anpassen
			switch (eventName) {
				case EventName.REGISTRATION:
					data.purpose = request.body.purpose; // Beispiel für Event-Parameter
					break;
				default:
					break;
			}

			// Ereignis nach Bearbeitung der Anfrage speichern
			return next.handle().pipe(
				map((res) => {
					if (userId || res?.user?.id) {
						this.eventHistoryService.saveHistory(eventName, userId || res?.user?.id, data);
					}

					return res;
				})
			);
		}
	}

	// Rückgabe der gemixten Klasse als Interceptor
	return mixin(EventHistoryInterceptor);
};
