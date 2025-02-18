import { spyOn } from "bun:test";
import type { BaseCommand } from "@commands/BaseCommand";
import type { Ora } from "ora";

/**
 * CommandTestHelper provides reusable functions for testing commands.
 * It includes a fake spinner that captures success messages, and a helper
 * method to override a command's getSpinner() method.
 */
export class CommandTestHelper {
    // A fake spinner that records the success message.
    public fakeSpinner: Ora;
    public succeededMessage: string | null = null;

    constructor() {
        this.fakeSpinner = this.createFakeSpinner();
    }

    /**
     * Creates a fake spinner that records its success message.
     */
    private createFakeSpinner(): Ora {
        const spinner = {
            start: () => spinner,
            succeed: (msg: string) => {
                this.succeededMessage = msg;
                return spinner;
            },
            fail: (_msg: string) => spinner,
        } as unknown as Ora;
        return spinner;
    }

    /**
     * Overrides the provided command instance's getSpinner method
     * so that it returns our fake spinner.
     *
     * @param commandInstance - The command instance whose getSpinner is to be overridden.
     */
    public overrideSpinner(commandInstance: BaseCommand): void {
        spyOn(commandInstance, "getSpinner").mockReturnValue(this.fakeSpinner);
    }
}
