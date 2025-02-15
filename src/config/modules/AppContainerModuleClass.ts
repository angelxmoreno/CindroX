import type { ActionInterface } from "@actions/ActionInterface";
import type { CacheClassModule } from "@config/modules/cache";
import type Emittery from "emittery";
import type pino from "pino";
import type { DependencyContainer } from "tsyringe";

interface AppDependencies {
    Logger: pino.Logger;
    EventManager: Emittery;
    Cache: CacheClassModule;
}

class AppContainerModuleClass {
    private baseContainer: DependencyContainer;
    private actionsContainer: DependencyContainer;
    private logger: pino.Logger;

    constructor(baseContainer: DependencyContainer, actionsContainer: DependencyContainer, logger: pino.Logger) {
        this.baseContainer = baseContainer;
        this.actionsContainer = actionsContainer;
        this.logger = logger;
    }

    resolve<T extends keyof AppDependencies>(key: T): AppDependencies[T] {
        return this.baseContainer.resolve<AppDependencies[T]>(key);
    }

    resolveAction<T extends ActionInterface>(actionKey: string): T | undefined {
        return this.actionsContainer.isRegistered(actionKey) ? this.actionsContainer.resolve<T>(actionKey) : undefined;
    }

    createChildLogger(moduleName: string) {
        return this.logger.child({ name: moduleName });
    }
}

export default AppContainerModuleClass;
