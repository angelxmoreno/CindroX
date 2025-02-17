import "reflect-metadata";
import { appConfig } from "@config/app";
import AppContainerModuleClass from "@config/modules/AppContainerModuleClass";
import { DrizzleModuleClass } from "@config/modules/DrizzleModuleClass";
import { LoggerRegistry } from "@config/modules/LoggerRegistry";
import actionMap from "@config/modules/actionMap";
import { CacheClassModule } from "@config/modules/cache";
import { UsersModel } from "@db/models/UsersModel";
import type { Config as DrizzleKitConfig } from "drizzle-kit";
import type { MySql2Database } from "drizzle-orm/mysql2/driver";
import Emittery from "emittery";
import pino, { type Logger } from "pino";
import { type DependencyContainer, container } from "tsyringe";

const parentLogger = pino(appConfig.logger);
const loggerRegistry = new LoggerRegistry(parentLogger);
const baseContainer: DependencyContainer = container.createChildContainer();
const actionsContainer: DependencyContainer = baseContainer.createChildContainer();

baseContainer.register("EventManager", {
    useValue: new Emittery(),
});

baseContainer.register<Logger>("Logger", {
    useValue: parentLogger,
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
const AppContainer = new AppContainerModuleClass(baseContainer, actionsContainer, loggerRegistry);

export default AppContainer;
