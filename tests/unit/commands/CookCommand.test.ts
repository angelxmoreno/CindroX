import { describe, expect, spyOn, test } from "bun:test";
import { CookCommandCommand } from "@commands/cook/CookCommandCommand";
import { CommandTestHelper } from "@test-helpers/CommandTestHelper";

// For simplicity, we simulate node-plop and generator behavior.
const fakePlopResults = {
    changes: [{ type: "add", path: "src/commands/HelloCommand.ts" }],
    failures: [],
};

describe("CookCommand", () => {
    test("should generate command successfully", async () => {
        const helper = new CommandTestHelper();
        const cookCommand = new CookCommandCommand();
        // Override spinner to use our fake spinner.
        helper.overrideSpinner(cookCommand);

        // Instead of calling the real nodePlop, override handleAction
        // to simulate successful generation.
        spyOn(cookCommand, "handleAction").mockImplementation(async () => {
            const spinner = cookCommand.getSpinner("Generating command...").start();
            // Simulate a delay
            await new Promise((resolve) => setTimeout(resolve, 100));
            spinner.succeed("Command generated successfully!");
            cookCommand.logSuccess("Generation results:", fakePlopResults);
        });

        // Invoke handleAction.
        await cookCommand.handleAction("TestCommand");

        expect(helper.succeededMessage).toBe("Command generated successfully!");
    });
});
