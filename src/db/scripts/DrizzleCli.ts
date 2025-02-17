// src/db/scripts/DrizzleCli.ts
import { exec } from "node:child_process";
import AppContainer from "@config/container";
import type { Config as DrizzleKitConfig } from "drizzle-kit";
import type { Logger } from "pino";

export class DrizzleCli {
    private config: DrizzleKitConfig;
    private logger: Logger;

    constructor(config?: DrizzleKitConfig, logger?: Logger) {
        // Default config comes from DrizzleModule in the DI container.
        this.config = config ?? AppContainer.resolve("DrizzleModule").drizzleKitConfig;
        // Default logger comes from AppContainer's logger registry.
        this.logger = logger ?? AppContainer.getLogger("DrizzleCli");
    }

    private runDrizzleCommand(command: string, description: string): Promise<void> {
        this.logger.info(`Executing command for ${description}: ${command}`);
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    this.logger.error(`Error during ${description}: ${error.message}`);
                    return reject(error);
                }
                if (stderr) {
                    this.logger.warn(`stderr: ${stderr}`);
                }
                this.logger.info(`${description} completed successfully:\n${stdout}`);
                resolve();
            });
        });
    }

    async migrationsGenerateCommand(migrationName: string): Promise<void> {
        const command = `bun drizzle-kit generate --name ${migrationName} --dialect ${this.config.dialect} --out ${this.config.out} --schema ${this.config.schema}`;
        return this.runDrizzleCommand(command, "Migration Generation");
    }

    async migrationsMigrateCommand(): Promise<void> {
        const command = "bun --bun drizzle-kit migrate --config src/db/scripts/drizzle.config.ts";
        return this.runDrizzleCommand(command, "Migration Execution");
    }

    async migrationsRollbackCommand(): Promise<void> {
        const command = `bun drizzle-kit rollback --dialect ${this.config.dialect} --out ${this.config.out} --schema ${this.config.schema}`;
        return this.runDrizzleCommand(command, "Migration Rollback");
    }

    async migrationsStatusCommand(): Promise<void> {
        const command = `bun drizzle-kit status --dialect ${this.config.dialect} --out ${this.config.out} --schema ${this.config.schema}`;
        return this.runDrizzleCommand(command, "Migration Status Check");
    }
}
