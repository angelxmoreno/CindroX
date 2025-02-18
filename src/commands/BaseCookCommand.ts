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
 * - spinnerFailText: Text displayed when generation fails.
 * - generatorName: The name of the Plop generator to run.
 *
 * The handleAction() method loads the plop file (from a configured path), retrieves the
 * appropriate generator, runs its actions with the provided name, and logs the results.
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
     * Executes the cook command action.
     *
     * Loads the Plop file (assumed to be written in TypeScript and located under plop-generators),
     * retrieves the generator specified by `this.generatorName`, runs its actions with the provided
     * name, and logs the results. In case of any failures, an error is logged.
     *
     * @param name - The name to pass to the generator actions.
     */
    public async handleAction(name: string): Promise<void> {
        const spinner = this.getSpinner(this.spinnerStartText).start();
        try {
            // Construct the path to the plop file.
            const plopFilePath = path.join(__dirname, "..", "plop-generators", "index.ts");
            const plop = await nodePlop(plopFilePath);
            // Retrieve the generator using the abstract generatorName.
            const generator = plop.getGenerator(this.generatorName);
            // Run the generator's actions with the provided name.
            const results = await generator.runActions({ name });
            // If any failures occurred during generation, throw an error.
            if (results.failures.length > 0) {
                throw new Error(results.failures[0].error);
            }
            // Signal success via the spinner.
            spinner.succeed(this.spinnerSuccessText);
            // Log detailed generation results.
            this.logSuccess("Generation results:");
            for (const change of results.changes) {
                this.logSuccess(`${change.type}: ${change.path}`);
            }
        } catch (error) {
            // Signal failure via the spinner and log the error.
            spinner.fail(this.spinnerFailText);
            this.logError(error);
        }
    }
}
