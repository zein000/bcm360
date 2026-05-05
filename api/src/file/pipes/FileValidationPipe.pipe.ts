import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

/**
 * Klasse: FileValidationPipe
 *
 * Diese Pipe dient zur Validierung hochgeladener Dateien in NestJS-Controllern.
 * Sie wird typischerweise in Kombination mit `@UseInterceptors(FileInterceptor(...))` verwendet.
 *
 * Validiert:
 * - Ob Dateien vorhanden sind
 * - Ob die Datei eine erlaubte Größe (max. 20MB) nicht überschreitet
 * - Ob der MIME-Typ einer Whitelist entspricht
 *
 * Wird die Prüfung nicht bestanden, wird ein `BadRequestException` geworfen.
 *
 * Beispiel-Nutzung:
 * ```ts
 * @Post("upload")
 * @UseInterceptors(FilesInterceptor("files"))
 * upload(@Body(new FileValidationPipe()) files: Express.Multer.File[]) {}
 * ```
 */
@Injectable()
export class FileValidationPipe implements PipeTransform {
  /**
   * Funktion: transform
   *
   * Führt die eigentliche Validierung der hochgeladenen Dateien durch.
   *
   * @param files - Array von Multer-Dateien (aus dem Upload)
   * @returns Die validierten Dateien (unverändert)
   * @throws BadRequestException, wenn Dateien fehlen, zu groß sind oder falsche Typen haben
   */
  transform(files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException("No files provided.");
    }

    files.forEach((file) => {
      // Maximale Dateigröße: 20 MB
      const maxSizeInBytes = 20 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        throw new BadRequestException(
          `File ${file.originalname} exceeds the size limit of 20MB.`
        );
      }

      // Erlaubte MIME-Typen
      const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/svg+xml",
        "application/pdf",
        "video/mp4",
        "video/avi",
        "video/mkv",
        "audio/wav",
        "audio/mpeg",
      ];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `File ${file.originalname} has an invalid type: ${file.mimetype}.`
        );
      }
    });

    return files;
  }
}
