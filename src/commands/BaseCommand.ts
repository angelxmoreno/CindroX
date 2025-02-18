import { input, select } from "@inquirer/prompts";
// @ts-ignore
import type { InputConfig, SelectConfig } from "@types/inquirer-prompts";
import chalk from "chalk";
import { Command } from "commander";
import ora, { type Options as OraOptions, type Ora } from "ora";

/**
 * BaseCommand provides default configuration for CLI commands.
 *
 * Subclasses must define:
 *  - commandName: The unique name of the command.
 *  - commandDescription: A short description of what the command does.
 *  - commandArgument: The argument(s) that the command accepts.
 *  - argumentDescription: A description for the argument(s).
 *
 * Subclasses must also implement the abstract method handleAction()
 * which contains the command-specific logic.
 *
 * Additionally, BaseCommand exposes helper methods to prompt for input,
 * prompt for selections, and create a spinner. This abstraction improves
 * testability by allowing these interactions to be stubbed or overridden.
 *
 * Usage:
 *  In a subclass, set the required properties and implement handleAction.
 *  Then, call this.configureCommand() in the subclass constructor.
 */
export abstract class BaseCommand extends Command {
    // Abstract properties for command configuration.
    protected abstract commandName: string;
    protected abstract commandDescription: string;
    protected abstract commandArgument: string;
    protected abstract argumentDescription: string;

    /**
     * Abstract method that subclasses must implement to define the command's behavior.
     *
     * @param args - The command-line arguments passed to the command.
     */
    public abstract handleAction(...args: unknown[]): Promise<void>;

    /**
     * Configures the command using the subclass's properties.
     * This method sets the command's name, description, expected arguments,
     * and binds the action handler.
     *
     * Subclasses should call this method in their constructor after setting their properties.
     */
    protected configureCommand(): void {
        // Set the command's name.
        this.name(this.commandName);
        // Set a short description for the command.
        this.description(this.commandDescription);
        // Define the expected argument(s) and their description.
        this.argument(this.commandArgument, this.argumentDescription);
        // Bind the action handler (the command's logic) to this instance.
        this.action(this.handleAction.bind(this));
    }

    /**
     * Helper method to prompt the user for free-text input.
     *
     * @param config - Configuration options for the input prompt.
     * @returns A promise that resolves to the user's input.
     */
    public async promptInput(config: InputConfig): Promise<string> {
        return input(config);
    }

    /**
     * Helper method to prompt the user to select from a list of choices.
     *
     * @param config - Configuration options for the select prompt.
     * @returns A promise that resolves to the selected value.
     */
    public async promptSelect(config: SelectConfig<string>): Promise<string> {
        return select(config);
    }

    /**
     * Helper method to create and return an Ora spinner.
     * This makes it easier to stub or override spinner behavior in tests.
     *
     * @param options - A string message or an OraOptions object.
     * @returns An Ora spinner instance.
     */
    public getSpinner(options: string | OraOptions): Ora {
        return ora(options);
    }

    /**
     * Helper method to log success messages using chalk.
     *
     * @param msg - The success message.
     * @param data - Optional additional data to log.
     */
    public logSuccess(msg: string, data?: unknown): void {
        if (data) {
            console.log(chalk.green(msg), data);
        } else {
            console.log(chalk.green(msg));
        }
    }

    /**
     * Helper method to log errors.
     *
     * @param error - The error to log.
     * @param verbose - If true, logs detailed error information.
     */
    public logError(error: unknown, verbose = false): void {
        let message = (error as Error).message;
        if (!message) {
            message = "Unknown Error";
        }
        console.error(message);
        if (verbose) {
            console.error(error);
        }
    }
}
