import { BaseCookCommand } from "@commands/BaseCookCommand";

/**
 * CookMiddlewareCommand generates a new Hono middleware file using Plop templates.
 *
 * This command mimics CakePHP’s "bake" functionality (using the term "cook")
 * and loads the TypeScript plop file (e.g., located at src/plop-generators/index.ts),
 * retrieves the generator named "middleware", and runs it with the provided middleware name.
 *
 * Usage:
 *   bun cindrox cook:middleware <name>
 *
 * Example:
 *   bun cindrox cook:middleware Auth
 */
export class CookMiddlewareCommand extends BaseCookCommand {
    // Define the command's metadata and configuration.
    protected commandName = "cook:middleware";
    protected commandDescription = "Generate a new Hono middleware file using Plop templates";
    protected commandArgument = "<name>";
    protected argumentDescription = "The name for the new middleware (e.g., Auth will create authMiddleware)";
    protected spinnerStartText = "Generating middleware...";
    protected spinnerSuccessText = "Middleware generated successfully!";
    protected spinnerFailText = "Middleware generation failed.";
    protected generatorName = "middleware";

    constructor() {
        super();
        // Configure the command with the defined properties.
        this.configureCommand();
    }
}
