import "reflect-metadata";
import { appConfig } from "@config/app";
import Emittery from "emittery";
import pino, { type Logger } from "pino";
import { type DependencyContainer, container } from "tsyringe";

const parentLogger = pino({
    level: appConfig.logger.level,
    transport: appConfig.logger.transport,
});

interface AppDependencies {
    Logger: pino.Logger;
    EventManager: Emittery;
}

const childContainer: DependencyContainer = container.createChildContainer();

childContainer.register("EventManager", {
    useValue: new Emittery(),
});

childContainer.register<Logger>("Logger", {
    useValue: parentLogger,
});

class AppContainer {
    private static container = childContainer;

    static resolve<T extends keyof AppDependencies>(key: T): AppDependencies[T] {
        return this.container.resolve<AppDependencies[T]>(key);
    }

    static createChildLogger(moduleName: string) {
        return parentLogger.child({ name: moduleName });
    }
}

export default AppContainer;
