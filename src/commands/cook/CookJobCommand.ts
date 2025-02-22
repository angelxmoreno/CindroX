import { BaseCookCommand } from "@commands/BaseCookCommand";

/**
 * CookJobCommand generates a new job class using Plop templates.
 *
 * This command mimics CakePHP’s "bake" functionality (using the term "cook")
 * and loads the Plop file, retrieves the generator named "job", and runs it with the provided job name.
 *
 * Usage:
 * ```sh
 * bun cindrox cook:job <name> --queue <queueName> --di
 * ```
 *
 * Example:
 * ```sh
 * bun cindrox cook:job SendUserMail --queue=emailQueue --di
 * ```
 */
export class CookJobCommand extends BaseCookCommand {
    // Command name used in CLI.
    protected commandName = "cook:job";
    // Description for the command.
    protected commandDescription = "Generate a new job class using Plop templates";
    // Define the positional argument. Here, only the job name is required.
    protected commandArgument = "<name>";
    // Description for the argument.
    protected argumentDescription = "The name for the new job (e.g., Mail will create MailJob)";
    // Spinner text shown at the start of job generation.
    protected spinnerStartText = "Generating job...";
    // Spinner text shown when job generation is successful.
    protected spinnerSuccessText = "Job generated successfully!";
    // Spinner text shown if job generation fails.
    protected spinnerFailText = "Job generation failed.";
    // The name of the Plop generator to use (should match the generator registered in your plopfile).
    protected generatorName = "job";

    constructor() {
        super();
        // Configure the command with the defined properties.
        this.configureCommand();
    }

    /**
     * Configures the command with additional CLI options.
     *
     * Calls the base `configureCommand()` method and adds job-specific options.
     */
    protected configureCommand(): void {
        super.configureCommand();
        this.option("-q, --queue <queueName>", "Specify the worker queue name");
        this.option("-d, --di", "Inject job into the Dependency Injection container", false);
    }

    /**
     * Gathers user inputs and returns them as generator data.
     * Overrides the BaseCookCommand.getGeneratorData to add job-specific options.
     *
     * @param name - The job name entered by the user.
     * @param options - CLI options (e.g., queue name and DI flag).
     * @returns Data object for Plop generator.
     */
    protected getGeneratorData(name: string, options: { queue?: string; di?: boolean }) {
        return {
            // The job name entered by the user.
            name,
            // Use the provided queue name or default to "defaultQueue".
            queueName: options.queue || "defaultQueue",
            // Use the DI flag; if not provided, default to false.
            registerDI: options.di || false,
        };
    }
}
