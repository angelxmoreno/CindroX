import "reflect-metadata";
import { appConfig } from "@config/app";
import AppContainerModuleClass from "@config/modules/AppContainerModuleClass";
import { BullMQModule } from "@config/modules/BullMQModule";
import { DrizzleModuleClass } from "@config/modules/DrizzleModuleClass";
import { LoggerRegistry } from "@config/modules/LoggerRegistry";
import actionMap from "@config/modules/actionMap";
import { CacheClassModule } from "@config/modules/cache";
import { QueueLogsModel } from "@db/models/QueueLogsModel";
import { UsersModel } from "@db/models/UsersModel";
import { HelloJob } from "@jobs/HelloJob";
import type { Config as DrizzleKitConfig } from "drizzle-kit";
import type { MySql2Database } from "drizzle-orm/mysql2/driver";
import Emittery from "emittery";
import nodemailer, { type Transporter } from "nodemailer";
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
baseContainer.register<BullMQModule>("BullMQ", {
    useFactory: () =>
        new BullMQModule({
            logger: loggerRegistry.getLogger("Queue"),
            redisUrl: appConfig.bullMq.redisUrl,
            queueNames: [...appConfig.bullMq.queues],
        }),
});

baseContainer.register<HelloJob>("HelloJob", {
    useClass: HelloJob,
});

const mailTransport = nodemailer.createTransport(appConfig.mailer.url);
mailTransport.verify((error) => {
    if (error) {
        loggerRegistry.getLogger("app").fatal(`Unable to use mail transport settings: ${appConfig.mailer.url}`);
    }
});
baseContainer.register<Transporter>("MailTransport", {
    useValue: mailTransport,
});
const AppContainer = new AppContainerModuleClass(baseContainer, actionsContainer);

export default AppContainer;
