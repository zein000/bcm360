/**
 * In dieser Datei wird das Cluster-Setup für die NestJS-Anwendung konfiguriert,
 * um mehrere Worker-Prozesse parallel laufen zu lassen. Zudem wird ein Prometheus-
 * Metrikserver bereitgestellt, damit Metriken des Clusters gesammelt und ausgewertet
 * werden können.
 */

import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from "@nestjs/swagger";
import * as basicAuth from "express-basic-auth";
import { engine as hbs } from "express-handlebars";
import helmet from "helmet";
import { Logger } from "nestjs-pino";
import * as client from "prom-client";

import { AppModule } from "./app/app.module";
import { TrimPipe } from "./common/pipes/trim.pipe";
import viewEngineConfig from "./view-engine/config/view-engine.config";

import * as cluster from "cluster";
import * as net from "net";
import { cpus } from "os";

// Initialisiert die Prometheus Standard-Metriken
const collectDefaultMetrics = client.collectDefaultMetrics;

// Express-Server für Metriken
const express = require("express");
const metricsServer = express();

// Aggregierter Registry-Handler für Prometheus
const register = new client.AggregatorRegistry();

// Standardmetriken sammeln
collectDefaultMetrics();

// Lädt die View-Engine-Konfiguration
const _viewEngineConfig = viewEngineConfig();

// Type Casting für das Cluster-Modul
const clusterModule = cluster as unknown as cluster.Cluster;

// Bestimmt die Anzahl der CPU-Kerne, auf denen die Anwendung laufen soll
let numCPUs = process.env.SCRAPE === "yes" ? cpus().length / 3 : 1;

// Im Entwicklungsmodus wird die Anzahl der Worker auf 1 reduziert
if (process.env.NODE_ENV === "development") {
	numCPUs = 1;
} else {
	// Begrenzung auf maximal 4 Worker, falls mehr CPU-Kerne verfügbar sind
	if (numCPUs > 4) {
		numCPUs = 4;
	}
}

// Objekt zum Verwalten aller Worker-Prozesse
const workers = {};

// Index, um nacheinander die Worker zu belasten
let index = 0;
const getWorkerIndex = () => {
	index += 1;
	if (index === numCPUs) {
		index = 0;
	}
	return index;
};

/**
 * Funktion: bootstrap
 *
 * Diese Funktion ist der Einstiegspunkt der Anwendung und startet entweder den Master-Prozess
 * (Cluster) oder einen Worker-Prozess (NestJS-Anwendung). Der Master-Prozess kümmert sich um das
 * Forken neuer Worker und das Weiterleiten eingehender Verbindungen (Sticky Sessions).
 *
 * - Im Master-Prozess:
 *    - Starten mehrerer Worker-Prozesse
 *    - Erstellen eines Servers für Prometheus-Metriken
 *    - TCP-Server für eingehende Verbindungen (Sticky Session)
 *
 * - Im Worker-Prozess:
 *    - Starten der eigentlichen NestJS-Anwendung
 */
async function bootstrap() {
	if (clusterModule.isPrimary) {
		// Master-Prozess
		console.log(`
				 Master server started,proccess.pid:${process.pid},
				 number of cpus: ${numCPUs}
		`);

		// Worker-Prozesse forken
		for (let i = 0; i < numCPUs; i++) {
			workers[i] = clusterModule.fork();

			// Worker-Neustart bei Exit
			workers[i].on("exit", (worker, code) => {
				console.log(`
						  Worker with code: ${code} Restarting...
				`);
				workers[i] = clusterModule.fork();
			});

			// Fehlerlogging bei Worker-Fehlern
			workers[i].on("error", (worker, code) => {
				console.log(`
						  Error in Worker with code: ${code}
				`);
				// workers[i] = clusterModule.fork();
			});
		}

		// Endpunkt für Prometheus-Metriken
		metricsServer.get("/metrics", async (req, res) => {
			try {
				const metrics = await register.clusterMetrics();
				res.set("Content-Type", register.contentType);
				res.send(metrics);
			} catch (ex) {
				res.statusCode = 500;
				res.send(ex.message);
			}
		});

		// Metrikserver starten
		metricsServer.listen(4001);
		console.log("Cluster metrics server listening to 4001, metrics exposed on /cluster_metrics");

		// TCP-Server (Sticky Session)
		net
			.createServer({ pauseOnConnect: true }, (connection) => {
				const workerIndex = getWorkerIndex();
				// Verbindung an den entsprechenden Worker weiterleiten
				workers[workerIndex].send("sticky-session:connection", connection);
			})
			.listen(process.env.PORT || 3000);
	} else {
		// Worker-Prozess: Nest-Anwendung starten
		const app = await NestFactory.create<NestExpressApplication>(AppModule, {
			bufferLogs: true,
			rawBody: true,
		});
		// Handlebars-Konfiguration
		app.useStaticAssets(_viewEngineConfig.staticAssetsDir);
		app.setBaseViewsDir(_viewEngineConfig.viewsDir);
		const viewEngine = hbs({
			extname: "hbs",
			partialsDir: _viewEngineConfig.partialsDir,
			defaultLayout: _viewEngineConfig.defaultLayout,
			layoutsDir: _viewEngineConfig.layoutsDir,
		});

		// Setzt Handlebars als View-Engine
		app.engine("hbs", viewEngine);
		app.setViewEngine("hbs");

		// Logger-Konfiguration
		app.useLogger(app.get(Logger));

		// Setzt einen globalen Prefix für alle Routen
		app.setGlobalPrefix("api");

		// Swagger-Konfiguration aktivieren, falls in den Umgebungsvariablen angegeben
		if (process.env.ACTIVATE_SWAGGERER === "true") {
			// Basic Auth für den Swagger-API-Docs-Zugang
			app.use(
				["/docs", "/docs-json"],
				basicAuth({
					challenge: true,
					users: {
						[process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
					},
				})
			);

			// Swagger-Dokumentation erstellen
			const config = new DocumentBuilder()
				.setTitle("Pitchdeck")
				.setDescription("Pitchdeck REST API documentation")
				.setVersion("1.0")
				.addBearerAuth()
				.addBasicAuth()
				.build();
			const document = SwaggerModule.createDocument(app, config);

			const customOptions: SwaggerCustomOptions = {
				swaggerOptions: {
					persistAuthorization: true,
				},
				customSiteTitle: "Pitchdeck REST API",
			};

			// Swagger-UI und API-Dokumentation einrichten
			SwaggerModule.setup("docs", app, document, customOptions);
		}

		// Globale Pipes und Interceptors für Validierung und Serialisierung einrichten
		app.useGlobalPipes(new TrimPipe(), new ValidationPipe({ transform: true, whitelist: true }));
		app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

		// Cross-Origin Resource Sharing (CORS) aktivieren
		app.enableCors();

		// Sicherheit mittels Helmet hinzufügen
		app.use(helmet());

		console.log("Listening on port", process.env.PORT);

		// Server starten
		const server = await app.listen(0);

		// Verbindungsmanagement für Sticky Sessions
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		process.on("message", (message, connection: any) => {
			if (message !== "sticky-session:connection") {
				return;
			}

			// Verbindung an den richtigen Worker weiterleiten
			server.emit("connection", connection);
			connection.resume();
		});
	}
}

bootstrap();