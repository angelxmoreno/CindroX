import chalk from "chalk";
import { BaseCommand } from "./BaseCommand";

/**
 * HelloCommand greets a user with a friendly message that includes a time-of-day greeting.
 *
 * Usage:
 *   bun cindrox say:hello [name] [timeOfDay]
 *
 * If name is not provided, you'll be prompted to enter it.
 * If timeOfDay is not provided, you'll be prompted to select one.
 *
 * Example:
 *   bun cindrox say:hello James afternoon
 *   bun cindrox say:hello
 */
export class HelloCommand extends BaseCommand {
    protected commandName = "say:hello";
    protected commandDescription =
        "Greet a user with a friendly message. Optionally pass the name and time-of-day, or be prompted for them.";
    protected commandArgument = "[name] [timeOfDay]";
    protected argumentDescription =
        "Optional: The name of the person to greet and the time of day (morning, afternoon, evening, night).";

    constructor() {
        super();
        this.configureCommand();
    }

    /**
     * Executes the command action.
     *
     * If the name or timeOfDay is missing, prompts the user to provide them.
     *
     * @param name - (Optional) The name of the person to greet.
     * @param timeOfDay - (Optional) The time of day ("morning", "afternoon", "evening", or "night").
     */
    public async handleAction(name?: string, timeOfDay?: string): Promise<void> {
        let person = name;
        let tod = timeOfDay;
        // If timeOfDay is an object (empty object), treat it as undefined.
        if (typeof tod === "object") {
            tod = undefined;
        }

        // Prompt for name if not provided.
        if (!person) {
            person = await this.promptInput({ message: "Enter your name:" });
        }

        // Prompt for time of day if not provided.
        if (!tod) {
            tod = await this.promptSelect({
                message: "Select the time of day:",
                choices: [
                    { name: "Morning", value: "morning" },
                    { name: "Afternoon", value: "afternoon" },
                    { name: "Evening", value: "evening" },
                    { name: "Night", value: "night" },
                ],
            });
        }

        const spinner = this.getSpinner("Sending greeting...").start();

        try {
            // Simulate an asynchronous operation.
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Capitalize the first letter of the time of day.
            const formattedTime = tod.charAt(0).toUpperCase() + tod.slice(1);
            const message = `Hello, ${chalk.blue(person)}. Good ${formattedTime}!`;
            spinner.succeed(message);
        } catch (error) {
            spinner.fail("Failed to send greeting");
            console.error("Error sending greeting:", error);
        }
    }
}
