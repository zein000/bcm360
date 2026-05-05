import { FileTypes } from "../enum/FileTypes.enum";

/**
 * Konstante: FileTypeToMimetype
 *
 * Diese Map ordnet MIME-Typen einem logischen Dateityp zu (Image, Video, Audio, Text).
 * Sie wird verwendet, um aus einem Dateiupload (z. B. `mimetype` aus Multer oder File-API)
 * einen internen Typen (`FileTypes`) abzuleiten.
 *
 * Anwendungsfälle:
 * - Validierung und Klassifikation von hochgeladenen Dateien
 * - UI-Darstellung je nach Dateityp
 * - Weiterverarbeitung abhängig vom Typ (z. B. Thumbnail nur für Bilder)
 *
 * Beispiel:
 * ```ts
 * const fileType = FileTypeToMimetype["image/png"]; // → FileTypes.Image
 * ```
 */
export const FileTypeToMimetype = {
	"image/jpeg": FileTypes.Image,
	"image/png": FileTypes.Image,
	"image/gif": FileTypes.Image,
	"image/svg+xml": FileTypes.Image,

	"application/pdf": FileTypes.Text,

	"video/mp4": FileTypes.Video,
	"video/avi": FileTypes.Video,
	"video/mkv": FileTypes.Video,

	"audio/mpeg": FileTypes.Audio,
	"audio/wav": FileTypes.Audio,
};
