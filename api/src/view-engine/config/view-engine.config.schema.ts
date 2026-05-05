import * as Joi from "joi";

/**
 * Konstante: VIEW_ENGINE_ENVIRONMENT_VARIABLES_SCHEMA
 *
 * Dieses Joi-Validierungsschema stellt sicher, dass alle notwendigen Umgebungsvariablen
 * für die View-/Template-Engine vorhanden und korrekt definiert sind.
 * Es wird im Rahmen des `ConfigModule` für das ViewEngineModule verwendet.
 *
 * Felder:
 * - LAYOUTS_DIR: Pfad zum Layout-Verzeichnis
 * - PARTIALS_DIR: Pfad zum Partials-Verzeichnis
 * - VIEWS_DIR: Pfad zum Templates-Verzeichnis (eigentliche Views)
 * - STATIC_ASSETS_DIR: Optionaler Pfad zu statischen Assets (z. B. Bilder, CSS)
 * - DEFAULT_LAYOUT: Name des Standard-Layouts (ohne Dateiendung)
 */
export const VIEW_ENGINE_ENVIRONMENT_VARIABLES_SCHEMA = Joi.object({
	LAYOUTS_DIR: Joi.string(),
	PARTIALS_DIR: Joi.string(),
	VIEWS_DIR: Joi.string(),
	STATIC_ASSETS_DIR: Joi.string(),
	DEFAULT_LAYOUT: Joi.string(),
});
