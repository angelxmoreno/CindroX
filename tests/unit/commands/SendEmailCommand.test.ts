import { beforeEach, describe, expect, it, mock, spyOn } from "bun:test";
import { SendEmailCommand } from "@commands/SendEmailCommand";
import { CommandTestHelper } from "@test-helpers/CommandTestHelper";
import { MockedUsersModel } from "@test-helpers/mocks/MockedUsersModel";

/**
 * Test suite for SendEmailCommand.
 */
describe("SendEmailCommand", () => {
    let helper: CommandTestHelper;

    beforeEach(() => {
        // Initialize a new helper instance before each test.
        helper = new CommandTestHelper();
    });

    it("should execute command successfully", async () => {
        const command = new SendEmailCommand();

        // Override spinner to capture output using the CommandTestHelper.
        helper.overrideSpinner(command);

        // Optionally override any prompt methods if needed:
        // spyOn(command, "promptInput").mockResolvedValue("TestInput");
        // spyOn(command, "promptSelect").mockResolvedValue("test");

        spyOn(command, "getUserById").mockImplementation((id: number) => MockedUsersModel.findById(id));
        spyOn(command, "sendEmail").mockImplementation(mock());
        // Call handleAction (cast to any if it's protected).
        await command.handleAction(1, "new-user", { job: false });

        // Assert that the fake spinner captured a success message.
        expect(helper.succeededMessage).toBeDefined();
        // You can add additional assertions as needed.
    });
});
