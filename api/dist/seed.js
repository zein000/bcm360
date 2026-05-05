"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const seeder_1 = require("./seeder/seeder");
const seeder_module_1 = require("./seeder/seeder.module");
async function bootstrap() {
    const appContext = await core_1.NestFactory.createApplicationContext(seeder_module_1.SeederModule);
    const seeder = appContext.get(seeder_1.Seeder);
    try {
        await seeder.seed();
    }
    finally {
        appContext.close();
    }
}
bootstrap();
//# sourceMappingURL=seed.js.map