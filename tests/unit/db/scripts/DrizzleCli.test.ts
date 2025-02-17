// tests/unit/db/scripts/DrizzleCli.test.ts
import { expect, spyOn, test } from "bun:test";
import * as childProcess from "node:child_process";
import { DrizzleCli } from "@db/scripts/DrizzleCli";
import type { Config as DrizzleKitConfig } from "drizzle-kit";
import type { Logger } from "pino";

// Set up the exec spy BEFORE importing DrizzleCli.
const fakeExec = (_cmd: string, callback: (error: Error | null, stdout: string, stderr: string) => void) => {
    callback(null, "success", "");
    return {};
};

const execSpy = spyOn(childProcess, "exec").mockImplementation(fakeExec as unknown as typeof childProcess.exec);

// Dummy configuration matching DrizzleKitConfig shape.
const dummyConfig: DrizzleKitConfig = {
    dialect: "mysql",
    out: "/dummy/out",
    schema: "/dummy/schema",
};

// Dummy logger with stubbed methods.
const dummyLogger = {
    info: () => {},
    warn: () => {},
    error: () => {},
} as unknown as Logger;

test("DrizzleCli.migrationsGenerateCommand builds and executes the correct command", async () => {
    const cli = new DrizzleCli(dummyConfig, dummyLogger);
    const migrationName = "test_migration";

    await cli.migrationsGenerateCommand(migrationName);

    const expectedCommand = `bun drizzle-kit generate --name ${migrationName} --dialect ${dummyConfig.dialect} --out ${dummyConfig.out} --schema ${dummyConfig.schema}`;
    expect(execSpy).toHaveBeenCalledTimes(1);
    const actualCommand = execSpy.mock.calls[0][0];
    expect(actualCommand).toBe(expectedCommand);
});
