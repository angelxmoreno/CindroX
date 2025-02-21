import "reflect-metadata";
import { appConfig } from "@config/app";
import AppContainerModuleClass from "@config/modules/AppContainerModuleClass";
import { DrizzleModuleClass } from "@config/modules/DrizzleModuleClass";
import { LoggerRegistry } from "@config/modules/LoggerRegistry";
import actionMap from "@config/modules/actionMap";
import { CacheClassModule } from "@config/modules/cache";
import { QueueLogsModel } from "@db/models/QueueLogsModel";
import { UsersModel } from "@db/models/UsersModel";
import type { Config as DrizzleKitConfig } from "drizzle-kit";
import type { MySql2Database } from "drizzle-orm/mysql2/driver";
import Emittery from "emittery";
import pino from "pino";
import { type DependencyContainer, container } from "tsyringe";

const baseContainer: DependencyContainer = container.createChildContainer();
const actionsContainer: DependencyContainer = baseContainer.createChildContainer();

baseContainer.register("EventManager", {
    useValue: new Emittery(),
});

const loggerRegistry = new LoggerRegistry(pino(appConfig.logger));
baseContainer.register<LoggerRegistry>("Loggers", {
    useValue: loggerRegistry,
});

baseContainer.register<CacheClassModule>("Cache", {
    useClass: CacheClassModule,
});

for (const [actionName, actionClass] of actionMap.entries()) {
    actionsContainer.register(actionName, { useClass: actionClass });
}

const drizzleModule = new DrizzleModuleClass(appConfig.database, loggerRegistry.getLogger("Database"));
baseContainer.register<DrizzleModuleClass>("DrizzleModule", {
    useValue: drizzleModule,
});
baseContainer.register<MySql2Database>("db", {
    useValue: drizzleModule.db,
});
baseContainer.register<DrizzleKitConfig>("drizzleKitConfig", {
    useValue: drizzleModule.drizzleKitConfig,
});
baseContainer.register<UsersModel>("UsersModel", {
    useClass: UsersModel,
});
baseContainer.register<QueueLogsModel>("QueueLogsModel", {
    useClass: QueueLogsModel,
});
const AppContainer = new AppContainerModuleClass(baseContainer, actionsContainer);

export default AppContainer;
