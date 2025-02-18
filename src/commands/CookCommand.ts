import * as path from "node:path";
import nodePlop from "node-plop";
import { BaseCommand } from "./BaseCommand";

/**
 * CookCommand generates a new CLI command file using Plop templates.
 *
 * This command mimics CakePHP’s "bake" functionality but uses the term "cook".
 * It loads the TypeScript plopFile located at src/config/plopFile.ts, retrieves
 * the generator named "command", and runs it with the provided command name.
 *
 * Usage:
 *   bun cindrox cook:command <name>
 *
 * Example:
 *   bun cindrox cook:command HelloCommand
 */
export class CookCommand extends BaseCommand {
    protected commandName = "cook:command";
    protected commandDescription = "Generate a new CLI command file using Plop templates";
    protected commandArgument = "<name>";
    protected argumentDescription = "The name for the new command (e.g., Hello)";

    constructor() {
        super();
        this.configureCommand();
    }

    /**
     * Executes the command action.
     *
     * Loads the plopFile (written in TypeScript) from src/config/plopFile.ts using ts-node,
     * retrieves the "command" generator, and runs it with the provided name.
     *
     * @param name - The name of the command to generate.
     */
    public async handleAction(name: string): Promise<void> {
        const spinner = this.getSpinner("Generating command...").start();
        try {
            const plopFilePath = path.join(__dirname, "..", "config", "plopFile.ts");
            const plop = await nodePlop(plopFilePath);
            const generator = plop.getGenerator("command");
            const results = await generator.runActions({ name });
            if (results.failures.length > 0) {
                throw new Error(results.failures[0].error);
            }
            spinner.succeed("Command generated successfully!");
            this.logSuccess("Generation results:");
            for (const change of results.changes) {
                this.logSuccess(`${change.type}: ${change.path}`);
            }
        } catch (error) {
            spinner.fail("Command generation failed");
            this.logError(error);
        }
    }
}
