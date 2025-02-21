import { BaseCookCommand } from "@commands/BaseCookCommand";

/**
 * CookCommandCommand generates a new CLI command file using Plop templates.
 *
 * This command mimics CakePHP’s "bake" functionality but uses the term "cook".
 * It loads the TypeScript plop file (e.g., located at src/plop-generators/index.ts),
 * retrieves the generator named "command", and runs it with the provided command name.
 *
 * Usage:
 *   bun cindrox cook:command <name>
 *
 * Example:
 *   bun cindrox cook:command HelloCommand
 */
export class CookCommandCommand extends BaseCookCommand {
    // Define the command's metadata and configuration.
    protected commandName = "cook:command";
    protected commandDescription = "Generate a new CLI command file using Plop templates";
    protected commandArgument = "<name>";
    protected argumentDescription = "The name for the new command (e.g., Hello will create HelloCommand)";
    protected spinnerStartText = "Generating command...";
    protected spinnerSuccessText = "Command generated successfully!";
    protected spinnerFailText = "Command generation failed.";
    protected generatorName = "command";

    constructor() {
        super();
        // Configure the command with the defined properties.
        this.configureCommand();
    }
}
