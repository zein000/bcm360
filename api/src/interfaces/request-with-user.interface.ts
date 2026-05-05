import { Request } from "express";
import User from "src/users/models/user.model";

/**
 * Interface: RequestWithUser
 *
 * Dieses Interface erweitert das Standard-Request-Objekt von Express um eine `user`-Eigenschaft.
 *
 * Verwendungszweck:
 * - Wird in Middleware, Guards oder Controllern eingesetzt, um auf den authentifizierten Benutzer zuzugreifen
 * - Typisiert das `req.user` Objekt, nachdem z. B. ein Auth-Guard den Benutzer aus einem JWT extrahiert hat
 *
 * Felder:
 * - user: Instanz des `User`-Modells, das den aktuell authentifizierten Benutzer repräsentiert
 */
interface RequestWithUser extends Request {
	user: User;
}

export default RequestWithUser;
