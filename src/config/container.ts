import "reflect-metadata";
import { appConfig } from "@config/app";
import AppContainerModuleClass from "@config/modules/AppContainerModuleClass";
import { LoggerRegistry } from "@config/modules/LoggerRegistry";
import actionMap from "@config/modules/actionMap";
import { CacheClassModule } from "@config/modules/cache";
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

const AppContainer = new AppContainerModuleClass(baseContainer, actionsContainer, loggerRegistry);

export default AppContainer;
