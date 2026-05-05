import { registerAs } from "@nestjs/config";
import { ROOT_DIR } from "src/constants";
import { join } from "path";

/**
 * Konfiguration: viewEngine
 *
 * Diese Konfiguration definiert alle relevanten Verzeichnisse und Standardwerte
 * für das Rendering von Templates (z.B. HTML-E-Mails mit Handlebars).
 *
 * Sie wird unter dem Namespace `"viewEngine"` registriert und durch das `ViewEngineModule`
 * automatisch geladen.
 *
 * Felder:
 * - partialsDir: Pfad zum Verzeichnis mit Handlebars-Teiltemplates (Partials)
 * - layoutsDir: Pfad zum Verzeichnis mit Layout-Dateien
 * - viewsDir: Pfad zum Verzeichnis mit den Haupt-Templates
 * - staticAssetsDir: Pfad zu öffentlichen Assets (z.B. für Bilder)
 * - defaultLayout: Name des Standard-Layouts, das beim Rendern verwendet wird
 *
 * Hinweis:
 * - Alle Werte können via `.env` überschrieben werden
 * - Falls nicht gesetzt, werden Standardverzeichnisse relativ zum `ROOT_DIR` verwendet
 */
export default registerAs("viewEngine", () => ({
	partialsDir: process.env.PARTIALS_DIR ?? join(ROOT_DIR, "views", "partials"),
	layoutsDir: process.env.LAYOUTS_DIR ?? join(ROOT_DIR, "views", "layouts"),
	viewsDir: process.env.VIEWS_DIR ?? join(ROOT_DIR, "views"),
	staticAssetsDir: process.env.STATIC_ASSETS_DIR ?? join(ROOT_DIR, "public"),
	defaultLayout: process.env.DEFAULT_LAYOUT ?? "default",
}));
