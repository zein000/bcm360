"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const basicAuth = require("express-basic-auth");
const express_handlebars_1 = require("express-handlebars");
const helmet_1 = require("helmet");
const nestjs_pino_1 = require("nestjs-pino");
const client = require("prom-client");
const app_module_1 = require("./app/app.module");
const trim_pipe_1 = require("./common/pipes/trim.pipe");
const view_engine_config_1 = require("./view-engine/config/view-engine.config");
const cluster = require("cluster");
const net = require("net");
const os_1 = require("os");
const collectDefaultMetrics = client.collectDefaultMetrics;
const express = require("express");
const metricsServer = express();
const register = new client.AggregatorRegistry();
collectDefaultMetrics();
const _viewEngineConfig = (0, view_engine_config_1.default)();
const clusterModule = cluster;
let numCPUs = process.env.SCRAPE === "yes" ? (0, os_1.cpus)().length / 3 : 1;
if (process.env.NODE_ENV === "development") {
    numCPUs = 1;
}
else {
    if (numCPUs > 4) {
        numCPUs = 4;
    }
}
const workers = {};
let index = 0;
const getWorkerIndex = () => {
    index += 1;
    if (index === numCPUs) {
        index = 0;
    }
    return index;
};
async function bootstrap() {
    if (clusterModule.isPrimary) {
        console.log(`
				 Master server started,proccess.pid:${process.pid},
				 number of cpus: ${numCPUs}
		`);
        for (let i = 0; i < numCPUs; i++) {
            workers[i] = clusterModule.fork();
            workers[i].on("exit", (worker, code) => {
                console.log(`
						  Worker with code: ${code} Restarting...
				`);
                workers[i] = clusterModule.fork();
            });
            workers[i].on("error", (worker, code) => {
                console.log(`
						  Error in Worker with code: ${code}
				`);
            });
        }
        metricsServer.get("/metrics", async (req, res) => {
            try {
                const metrics = await register.clusterMetrics();
                res.set("Content-Type", register.contentType);
                res.send(metrics);
            }
            catch (ex) {
                res.statusCode = 500;
                res.send(ex.message);
            }
        });
        metricsServer.listen(4001);
        console.log("Cluster metrics server listening to 4001, metrics exposed on /cluster_metrics");
        net
            .createServer({ pauseOnConnect: true }, (connection) => {
            const workerIndex = getWorkerIndex();
            workers[workerIndex].send("sticky-session:connection", connection);
        })
            .listen(process.env.PORT || 3000);
    }
    else {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, {
            bufferLogs: true,
            rawBody: true,
        });
        app.useStaticAssets(_viewEngineConfig.staticAssetsDir);
        app.setBaseViewsDir(_viewEngineConfig.viewsDir);
        const viewEngine = (0, express_handlebars_1.engine)({
            extname: "hbs",
            partialsDir: _viewEngineConfig.partialsDir,
            defaultLayout: _viewEngineConfig.defaultLayout,
            layoutsDir: _viewEngineConfig.layoutsDir,
        });
        app.engine("hbs", viewEngine);
        app.setViewEngine("hbs");
        app.useLogger(app.get(nestjs_pino_1.Logger));
        app.setGlobalPrefix("api");
        if (process.env.ACTIVATE_SWAGGERER === "true") {
            app.use(["/docs", "/docs-json"], basicAuth({
                challenge: true,
                users: {
                    [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
                },
            }));
            const config = new swagger_1.DocumentBuilder()
                .setTitle("Pitchdeck")
                .setDescription("Pitchdeck REST API documentation")
                .setVersion("1.0")
                .addBearerAuth()
                .addBasicAuth()
                .build();
            const document = swagger_1.SwaggerModule.createDocument(app, config);
            const customOptions = {
                swaggerOptions: {
                    persistAuthorization: true,
                },
                customSiteTitle: "Pitchdeck REST API",
            };
            swagger_1.SwaggerModule.setup("docs", app, document, customOptions);
        }
        app.useGlobalPipes(new trim_pipe_1.TrimPipe(), new common_1.ValidationPipe({ transform: true, whitelist: true }));
        app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector)));
        app.enableCors();
        app.use((0, helmet_1.default)());
        console.log("Listening on port", process.env.PORT);
        const server = await app.listen(0);
        process.on("message", (message, connection) => {
            if (message !== "sticky-session:connection") {
                return;
            }
            server.emit("connection", connection);
            connection.resume();
        });
    }
}
bootstrap();
//# sourceMappingURL=main.js.map