import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import Handlebars from "handlebars";
import { ConfigType } from "@nestjs/config";
import { lstatSync, readdirSync, readFileSync } from "fs";
import { join } from "path";

import viewEngineConfig from "src/view-engine/config/view-engine.config";

/**
 * Klasse: ViewEngineService
 *
 * Dieser Service ist für das Laden, Kompilieren und Rendern von Handlebars-Templates zuständig.
 * Er wird z.B. im `MailService` verwendet, um HTML-E-Mails mit Layouts und Partials dynamisch zu erzeugen.
 *
 * Features:
 * - Lädt und kompiliert Views, Layouts und Partials beim Initialisieren aus definierten Verzeichnissen
 * - Unterstützt dynamisches Daten-Rendering über `render(...)`
 * - Nutzt standardmäßig ein Layout, kann aber auch ohne oder mit anderem Layout gerendert werden
 */
@Injectable()
export class ViewEngineService {
	private readonly logger = new Logger(ViewEngineService.name);

	private templates: Record<string, (data?: Record<string, unknown>) => string> = {};
	private layouts: typeof this.templates = {};
	private partials: typeof this.templates = {};

	constructor(
		@Inject(viewEngineConfig.KEY)
		private config: ConfigType<typeof viewEngineConfig>
	) {
		// Lade Partials und registriere sie bei Handlebars
		for (const file of readdirSync(config.partialsDir)) {
			const fileName = file.split(".")[0];
			const fileContents = readFileSync(join(config.partialsDir, file)).toString();

			this.partials[fileName] = Handlebars.compile(fileContents);
			Handlebars.registerPartial(fileName, this.partials[fileName]);
		}

		// Lade Layouts
		for (const file of readdirSync(config.layoutsDir)) {
			const fileName = file.split(".")[0];
			const fileContents = readFileSync(join(config.layoutsDir, file)).toString();

			this.layouts[fileName] = Handlebars.compile(fileContents);
		}

		// Lade Templates
		for (const file of readdirSync(config.viewsDir)) {
			const fileInfo = lstatSync(join(config.viewsDir, file));

			if (!fileInfo.isDirectory()) {
				const fileName = file.split(".")[0];
				const fileContents = readFileSync(join(config.viewsDir, file)).toString();

				this.templates[fileName] = Handlebars.compile(fileContents);
			}
		}
	}

	/**
	 * Rendert ein Template mit optionalem Layout und Daten.
	 *
	 * @param templateName - Name der zu rendernden View-Datei (ohne Dateiendung)
	 * @param options - Optional: Daten-Objekt und Layout-Name
	 * @returns Gerenderter HTML-String
	 * @throws InternalServerErrorException, wenn Template/Layout nicht existiert oder Rendern fehlschlägt
	 */
	render<DataType extends Record<string, unknown>>(
		templateName: string,
		options?: { data?: DataType; layout?: string }
	) {
		let layout = this.config.defaultLayout;

		if (options?.layout !== undefined) {
			layout = options.layout;
		}

		if (!this.templates[templateName]) {
			this.logger.error(`Template with name ${templateName} does not exist`);
			throw new InternalServerErrorException("VIEW_ENGINE_TEMPLATE_NOT_FOUND");
		}

		if (layout && !this.layouts[layout]) {
			this.logger.error(`Template layout with name ${layout} does not exist`);
			throw new InternalServerErrorException("VIEW_ENGINE_TEMPLATE_LAYOUT_NOT_FOUND");
		}

		try {
			const templateResult = this.templates[templateName](options?.data);
			return layout ? this.layouts[layout]({ body: templateResult }) : templateResult;
		} catch (error) {
			this.logger.error(
				error,
				`Failed to render template ${templateName} with data ${JSON.stringify(options?.data)}`
			);
			throw new InternalServerErrorException("VIEW_ENGINE_RENDER");
		}
	}
}
