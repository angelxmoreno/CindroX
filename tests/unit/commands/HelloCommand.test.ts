import { beforeEach, describe, expect, spyOn, test } from "bun:test";
import { HelloCommand } from "@commands/HelloCommand";
import chalk from "chalk";
import type { Ora } from "ora";

/**
 * Fake spinner used to simulate Ora.
 * It provides a start() method that returns itself and a succeed() method
 * that records the message passed to it.
 */
let succeededMessage: string | null = null;
const fakeSpinner = {
    start: function () {
        return this;
    },
    succeed: (message: string) => {
        succeededMessage = message;
    },
    fail: (_message: string) => {
        // For testing, we won't do anything here.
    },
} as unknown as Ora;

describe("HelloCommand", () => {
    beforeEach(() => {
        // Reset the captured message before each test.
        succeededMessage = null;
    });

    test("should use provided name and provided time of day without prompting", async () => {
        const command = new HelloCommand();
        // Spy on prompt methods so they don't get called.
        const inputSpy = spyOn(command, "promptInput");
        const selectSpy = spyOn(command, "promptSelect");
        // Spy on getSpinner so it returns our fake spinner.
        spyOn(command, "getSpinner").mockReturnValue(fakeSpinner);

        // Call handleAction with both name and timeOfDay.
        await command.handleAction("Bob", "morning");

        // Expect no prompts.
        expect(inputSpy).not.toHaveBeenCalled();
        expect(selectSpy).not.toHaveBeenCalled();

        // Expected greeting message.
        const expected = `Hello, ${chalk.blue("Bob")}. Good Morning!`;
        expect(succeededMessage).toBe(expected);
    });

    test("should prompt for name when missing and use provided time of day", async () => {
        const command = new HelloCommand();
        // Spy on promptInput to simulate entering "Alice".
        const inputSpy = spyOn(command, "promptInput").mockResolvedValue("Alice");
        // Spy on promptSelect; should not be called.
        const selectSpy = spyOn(command, "promptSelect");
        spyOn(command, "getSpinner").mockReturnValue(fakeSpinner);

        await command.handleAction(undefined, "evening");

        expect(inputSpy).toHaveBeenCalled();
        expect(selectSpy).not.toHaveBeenCalled();

        const expected = `Hello, ${chalk.blue("Alice")}. Good Evening!`;
        expect(succeededMessage).toBe(expected);
    });

    test("should prompt for time of day when missing and use provided name", async () => {
        const command = new HelloCommand();
        // Spy on promptSelect to simulate selecting "night".
        const selectSpy = spyOn(command, "promptSelect").mockResolvedValue("night");
        // Spy on promptInput; should not be called.
        const inputSpy = spyOn(command, "promptInput");
        spyOn(command, "getSpinner").mockReturnValue(fakeSpinner);

        await command.handleAction("Charlie", undefined);

        expect(inputSpy).not.toHaveBeenCalled();
        expect(selectSpy).toHaveBeenCalled();

        const expected = `Hello, ${chalk.blue("Charlie")}. Good Night!`;
        expect(succeededMessage).toBe(expected);
    });

    test("should prompt for both name and time of day when missing", async () => {
        const command = new HelloCommand();
        // Simulate prompting for name: return "David".
        const inputSpy = spyOn(command, "promptInput").mockResolvedValue("David");
        // Simulate prompting for time of day: return "afternoon".
        const selectSpy = spyOn(command, "promptSelect").mockResolvedValue("afternoon");
        spyOn(command, "getSpinner").mockReturnValue(fakeSpinner);

        await command.handleAction();

        expect(inputSpy).toHaveBeenCalled();
        expect(selectSpy).toHaveBeenCalled();

        const expected = `Hello, ${chalk.blue("David")}. Good Afternoon!`;
        expect(succeededMessage).toBe(expected);
    });
});
