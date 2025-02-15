import "reflect-metadata";
import type { ActionInterface } from "@actions/ActionInterface";
import { appConfig } from "@config/app";
import actionMap from "@config/modules/actionMap";
import { CacheClassModule } from "@config/modules/cache";
import Emittery from "emittery";
import pino, { type Logger } from "pino";
import { type DependencyContainer, container } from "tsyringe";

const parentLogger = pino(appConfig.logger);

interface AppDependencies {
    Logger: pino.Logger;
    EventManager: Emittery;
    Cache: CacheClassModule;
}

const baseContainer: DependencyContainer = container.createChildContainer();
const actionContainer: DependencyContainer = baseContainer.createChildContainer();

baseContainer.register("EventManager", {
    useValue: new Emittery(),
});

baseContainer.register<Logger>("Logger", {
    useValue: parentLogger,
});

baseContainer.register<CacheClassModule>("Cache", {
    useClass: CacheClassModule,
});

actionMap.forEach((actionClass, name) => {
    actionContainer.register(name, {
        useClass: actionClass,
    });
});

class AppContainer {
    private static container = baseContainer;
    private static actions = actionContainer;

    static resolve<T extends keyof AppDependencies>(key: T): AppDependencies[T] {
        return this.container.resolve<AppDependencies[T]>(key);
    }

    static resolveAction<T extends ActionInterface>(actionKey: string): T | undefined {
        return this.actions.isRegistered(actionKey) ? this.actions.resolve<T>(actionKey) : undefined;
    }

    static createChildLogger(moduleName: string) {
        return parentLogger.child({ name: moduleName });
    }
}

export default AppContainer;
