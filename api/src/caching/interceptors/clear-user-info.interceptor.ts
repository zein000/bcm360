import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { UserInfoDTO } from "src/users/dto/user-info.dto";
import User from "../../users/models/user.model";
import { UserInfoCachingService } from "../services/user-info-caching.service";

/**
 * Klasse: ClearUserInfoCacheInterceptor
 *
 * Dieser Interceptor löscht automatisch den Benutzer-Cache, wenn ein Benutzerobjekt
 * (entweder als `User` oder `UserInfoDTO`) in der Response zurückgegeben wird.
 *
 * Verwendungszweck:
 * - Sicherstellen, dass nach einer Änderung an Benutzerinformationen (z. B. Update, Passwortänderung)
 *   der veraltete Cache-Eintrag entfernt wird
 * - Wird typischerweise bei `@UseInterceptors()` in Controller-Routen verwendet
 *
 * Funktionsweise:
 * - Prüft die Response des Handlers
 * - Wenn es sich um ein Benutzerobjekt handelt, wird `userInfoCaching.clearUser(...)` aufgerufen
 */
@Injectable()
export class ClearUserInfoCacheInterceptor implements NestInterceptor {
	constructor(private readonly userInfoCaching: UserInfoCachingService) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		return next.handle().pipe(
			map((data) => {
				if (data instanceof User || data instanceof UserInfoDTO) {
					this.userInfoCaching.clearUser(data);
				}
				return data;
			})
		);
	}
}
