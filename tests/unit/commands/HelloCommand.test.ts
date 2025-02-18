// tests/unit/commands/HelloCommand.test.ts
import { beforeEach, describe, expect, spyOn, test } from "bun:test";
import { HelloCommand } from "@commands/HelloCommand";
import { CommandTestHelper } from "@test-helpers/CommandTestHelper";
import chalk from "chalk";

describe("HelloCommand", () => {
    let helper: CommandTestHelper;

    beforeEach(() => {
        // Initialize a new helper instance before each test.
        helper = new CommandTestHelper();
    });

    test("should use provided name and provided time of day without prompting", async () => {
        const command = new HelloCommand();

        // Override the spinner using the helper.
        helper.overrideSpinner(command);

        // Spy on prompt methods so they aren't called.
        const inputSpy = spyOn(command, "promptInput");
        const selectSpy = spyOn(command, "promptSelect");

        // Call handleAction with both name and timeOfDay.
        await command.handleAction("Bob", "morning");

        // Expect that neither prompt was called.
        expect(inputSpy).not.toHaveBeenCalled();
        expect(selectSpy).not.toHaveBeenCalled();

        // Expected greeting message.
        const expected = `Hello, ${chalk.blue("Bob")}. Good Morning!`;
        expect(helper.succeededMessage).toBe(expected);
    });

    test("should prompt for name when missing and use provided time of day", async () => {
        const command = new HelloCommand();

        // Override spinner.
        helper.overrideSpinner(command);

        // Spy on promptInput to simulate entering "Alice".
        const inputSpy = spyOn(command, "promptInput").mockResolvedValue("Alice");
        // Spy on promptSelect; should not be called.
        const selectSpy = spyOn(command, "promptSelect");

        await command.handleAction(undefined, "evening");

        expect(inputSpy).toHaveBeenCalled();
        expect(selectSpy).not.toHaveBeenCalled();

        const expected = `Hello, ${chalk.blue("Alice")}. Good Evening!`;
        expect(helper.succeededMessage).toBe(expected);
    });

    test("should prompt for time of day when missing and use provided name", async () => {
        const command = new HelloCommand();
        helper.overrideSpinner(command);

        // Spy on promptSelect to simulate selecting "night".
        const selectSpy = spyOn(command, "promptSelect").mockResolvedValue("night");
        // Spy on promptInput; should not be called.
        const inputSpy = spyOn(command, "promptInput");

        await command.handleAction("Charlie", undefined);

        expect(inputSpy).not.toHaveBeenCalled();
        expect(selectSpy).toHaveBeenCalled();

        const expected = `Hello, ${chalk.blue("Charlie")}. Good Night!`;
        expect(helper.succeededMessage).toBe(expected);
    });

    test("should prompt for both name and time of day when missing", async () => {
        const command = new HelloCommand();
        helper.overrideSpinner(command);

        // Simulate prompting for name: return "David".
        const inputSpy = spyOn(command, "promptInput").mockResolvedValue("David");
        // Simulate prompting for time of day: return "afternoon".
        const selectSpy = spyOn(command, "promptSelect").mockResolvedValue("afternoon");

        await command.handleAction();

        expect(inputSpy).toHaveBeenCalled();
        expect(selectSpy).toHaveBeenCalled();

        const expected = `Hello, ${chalk.blue("David")}. Good Afternoon!`;
        expect(helper.succeededMessage).toBe(expected);
    });
});
