// Importiert ein Enum mit zusätzlichen Status-Tags, die später als Schlüssel genutzt werden
import { AdditionalStatusInfoTags } from "../enum/AdditionalStatusInfoTags.enum";

// Diese Konstante enthält standardisierte Systemnachrichten, die z. B. in Protokollen oder WebSocket-Nachrichten verwendet werden können.
// Sie basiert auf einer festen Schlüssel-Wert-Zuordnung. Die Schlüssel stammen teils aus dem Enum,
// teils sind es frei definierte Strings. Die Werte sind die dazugehörigen Benutzer-Meldungen.
export const ProtocolKeyMessages = {

    // Wenn der Status-Tag "TIMEUP" (Zeit abgelaufen) gemeldet wird, wird diese Nachricht verwendet.
    [AdditionalStatusInfoTags.TIMEUP]: "Die Zeit ist um",

    // Erfolgssituation – z. B. Benutzer hat die Aufgabe erfolgreich abgeschlossen
    [AdditionalStatusInfoTags.SUCCESS]: "Erfolg",

    // Fehlgeschlagene Aufgabe oder Entscheidung
    [AdditionalStatusInfoTags.FAILURE]: "Versagen",

    // Wenn ein Benutzer in einer Phase eine Hilfe („Spoiler“) anfordert
    "requested-spoiler": "Angeforderte Hilfe für Phase {{phaseNumber}}",

    // Wenn mehrere Benutzer zu einem Szenario eingeladen wurden
    "invited-users": "Eingeladen {{usersString}}",

    // Wird angezeigt, wenn ein Benutzer einer Einladung gefolgt ist
    "user-joined": "Sie haben die Einladung angenommen und sind dem Szenario beigetreten.",

    // Wenn ein Benutzer aus einem Szenario entfernt wurde (z. B. durch den Admin)
    "removed-user": "{{userData}} aus dem Szenario entfernt",

} as const; // `as const` sorgt dafür, dass die Schlüssel und Werte als Literal-Typen behandelt werden
