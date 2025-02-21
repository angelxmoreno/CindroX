import type { BaseAction } from "@actions/BaseAction";
import type { DrizzleModuleClass } from "@config/modules/DrizzleModuleClass";
import type { LoggerRegistry } from "@config/modules/LoggerRegistry";
import type { CacheClassModule } from "@config/modules/cache";
import type { UsersModel } from "@db/models/UsersModel";
import type { Config as DrizzleKitConfig } from "drizzle-kit";
import type { MySql2Database } from "drizzle-orm/mysql2/driver";
import type Emittery from "emittery";
import type { Logger } from "pino";
import type { DependencyContainer } from "tsyringe";

interface AppDependencies {
    EventManager: Emittery;
    Cache: CacheClassModule;
    DrizzleModule: DrizzleModuleClass;
    db: MySql2Database;
    drizzleKitConfig: DrizzleKitConfig;
    UsersModel: UsersModel;
    Loggers: LoggerRegistry;
}

class AppContainerModuleClass {
    private baseContainer: DependencyContainer;
    private actionsContainer: DependencyContainer;

    constructor(baseContainer: DependencyContainer, actionsContainer: DependencyContainer) {
        this.baseContainer = baseContainer;
        this.actionsContainer = actionsContainer;
    }

    resolve<T extends keyof AppDependencies>(key: T): AppDependencies[T] {
        return this.baseContainer.resolve<AppDependencies[T]>(key);
    }

    resolveAction<T extends BaseAction>(actionKey: string): T | undefined {
        return this.actionsContainer.isRegistered(actionKey) ? this.actionsContainer.resolve<T>(actionKey) : undefined;
    }

    getLogger(moduleName: string): Logger {
        return this.resolve("Loggers").getLogger(moduleName);
    }
}

export default AppContainerModuleClass;
