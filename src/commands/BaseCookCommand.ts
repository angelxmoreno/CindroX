import path from "node:path";
import { BaseCommand } from "@commands/BaseCommand";
import nodePlop from "node-plop";

/**
 * BaseCookCommand serves as an abstract base for all "cook" commands.
 *
 * This class extends BaseCommand and encapsulates common logic for generating files
 * using Plop. Subclasses must specify:
 *
 * - spinnerStartText: Text displayed when the spinner starts.
 * - spinnerSuccessText: Text displayed when the generation is successful.
 * - spinnerFailText: Text displayed if generation fails.
 * - generatorName: The name of the Plop generator to run.
 *
 * The handleAction() method loads the Plop file (assumed to be written in TypeScript and located under plop-generators),
 * retrieves the appropriate generator, runs its actions with the provided parameters, and logs the results.
 */
export abstract class BaseCookCommand extends BaseCommand {
    // Text to display when starting the spinner.
    protected abstract spinnerStartText: string;
    // Text to display on successful generation.
    protected abstract spinnerSuccessText: string;
    // Text to display if generation fails.
    protected abstract spinnerFailText: string;
    // Name of the generator to be used from the plop file.
    protected abstract generatorName: string;

    /**
     * Subclasses can override this method to provide additional generator data.
     *
     * @param name - The name entered by the user.
     * @param options - Additional CLI options (subclass-defined).
     * @returns An object containing the generator input data.
     */
    protected getGeneratorData(name: string, options: Record<string, unknown> = {}): Record<string, unknown> {
        // By default, return the name along with any additional options.
        return { name, ...options };
    }

    /**
     * Executes the cook command action.
     *
     * Loads the Plop file (assumed to be written in TypeScript and located under plop-generators),
     * retrieves the generator specified by `this.generatorName`, runs its actions with the provided
     * name and options, and logs the results.
     *
     * @param name - The name to pass to the generator actions.
     * @param options - Additional CLI options (subclass-defined).
     */
    public async handleAction(name: string, options: Record<string, unknown> = {}): Promise<void> {
        // Start a spinner to indicate progress.
        const spinner = this.getSpinner(this.spinnerStartText).start();
        try {
            // Build the path to the plop file.
            const plopFilePath = path.join(__dirname, "..", "plop-generators", "index.ts");
            // Load the plop instance using the specified plop file.
            const plop = await nodePlop(plopFilePath);
            // Retrieve the generator by name.
            const generator = plop.getGenerator(this.generatorName);
            // Get the generator data (including additional CLI options).
            const generatorData = this.getGeneratorData(name, options);
            // Execute the generator actions.
            const results = await generator.runActions(generatorData);
            // If any failures occurred during generation, throw an error.
            if (results.failures.length > 0) {
                throw new Error(results.failures[0].error);
            }
            // Signal success via the spinner.
            spinner.succeed(this.spinnerSuccessText);
            // Log detailed generation results.
            this.logSuccess("Generation results:");
            for (const change of results.changes) {
                if (change.type !== "function") {
                    this.logSuccess(`${change.type}: ${change.path}`);
                }
            }
        } catch (error) {
            // Signal failure via the spinner and log the error.
            spinner.fail(this.spinnerFailText);
            this.logError(error);
        }
    }
}
