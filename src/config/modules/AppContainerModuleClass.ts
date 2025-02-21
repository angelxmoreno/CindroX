import type { BaseAction } from "@actions/BaseAction";
import type { BullMQModule } from "@config/modules/BullMQModule";
import type { DrizzleModuleClass } from "@config/modules/DrizzleModuleClass";
import type { LoggerRegistry } from "@config/modules/LoggerRegistry";
import type { CacheClassModule } from "@config/modules/cache";
import type { QueueLogsModel } from "@db/models/QueueLogsModel";
import type { UsersModel } from "@db/models/UsersModel";
import type { HelloJob } from "@jobs/HelloJob";
import type { Config as DrizzleKitConfig } from "drizzle-kit";
import type { MySql2Database } from "drizzle-orm/mysql2/driver";
import type Emittery from "emittery";
import type { Transporter } from "nodemailer";
import type { Logger } from "pino";
import type { DependencyContainer } from "tsyringe";

interface AppDependencies {
    EventManager: Emittery;
    Cache: CacheClassModule;
    BullMQ: BullMQModule;
    DrizzleModule: DrizzleModuleClass;
    db: MySql2Database;
    drizzleKitConfig: DrizzleKitConfig;
    UsersModel: UsersModel;
    QueueLogsModel: QueueLogsModel;
    Loggers: LoggerRegistry;
    HelloJob: HelloJob;
    MailTransport: Transporter;
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
