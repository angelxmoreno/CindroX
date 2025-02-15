import "reflect-metadata";
import { appConfig } from "@config/app";
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

const childContainer: DependencyContainer = container.createChildContainer();

childContainer.register("EventManager", {
    useValue: new Emittery(),
});

childContainer.register<Logger>("Logger", {
    useValue: parentLogger,
});

childContainer.register<CacheClassModule>("Cache", {
    useClass: CacheClassModule,
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
