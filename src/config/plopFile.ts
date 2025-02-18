import { exec } from "node:child_process";
import * as path from "node:path";
import type { CustomActionFunction, NodePlopAPI } from "node-plop";

/**
 * PlopFile for generating CLI command files along with their tests.
 *
 * This generator, named "command", prompts the user for the command name
 * and generates two files:
 *  - A command file at src/commands/{{properCase name}}Command.ts
 *  - A test file at tests/unit/commands/{{properCase name}}Command.test.ts
 *
 * After generating each file, it runs a custom "lint" action to ensure that the generated
 * file passes Biome (or your preferred linter).
 *
 * Usage:
 *   bun cindrox cook:command <CommandName>
 *
 * @param plop The plop API instance.
 */
export default function (plop: NodePlopAPI): void {
    const rootPath = path.join(__dirname, "..", "..");
    const srcPath = path.join(rootPath, "src");
    const unitTestsPath = path.join(rootPath, "tests", "unit");
    const cookRecipesPath = path.join(srcPath, "templates", "cook");

    const lintAction: CustomActionFunction = async ({ name }, { path }, { renderString }): Promise<string> => {
        if (!path) {
            return "No path specified for linting.";
        }
        if (!name) {
            return "No file name specified for linting.";
        }
        const actualPath = renderString(path, { name });

        // Construct the linter command. Adjust this command as needed for your Biome setup.
        const cmd = `bun lint:fix ${actualPath}`;
        return new Promise((resolve, reject) => {
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    reject(`Linting failed: ${stderr || error.message}`);
                } else {
                    resolve(`Linting successful: ${stdout}`);
                }
            });
        });
    };
    const actions = [
        {
            type: "add",
            path: `${srcPath}/commands/{{properCase name}}Command.ts`,
            templateFile: path.join(cookRecipesPath, "command.hbs"),
        },
        {
            type: "lint",
            path: `${srcPath}/commands/{{properCase name}}Command.ts`,
        },
        {
            type: "add",
            path: `${unitTestsPath}/commands/{{properCase name}}Command.test.ts`,
            templateFile: path.join(cookRecipesPath, "command.test.hbs"),
        },
        {
            type: "lint",
            path: `${unitTestsPath}/commands/{{properCase name}}Command.test.ts`,
        },
    ];
    const config = {
        description: "Generate a new CLI command file",
        prompts: [
            {
                type: "input",
                name: "name",
                message: "Enter the command name (e.g., Hello):",
            },
        ],
        actions,
    };
    plop.setActionType("lint", lintAction);
    plop.setGenerator("command", config);
}
