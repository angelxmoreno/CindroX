import path from "node:path";
import { appPaths } from "@config/paths";

/**
 * Actions array for the "command" generator.
 *
 * This generator performs the following steps:
 * 1. Adds a new command file at the specified location using a Handlebars template.
 * 2. Lints the generated command file.
 * 3. Appends an import statement to your CLI entry file.
 * 4. Appends a command registration to your CLI entry file.
 * 5. Lints the updated CLI entry file.
 * 6. Adds a corresponding test file for the new command.
 * 7. Lints the generated test file.
 */
const actions = [
    {
        type: "add",
        path: `${appPaths.src}/commands/{{properCase name}}Command.ts`,
        templateFile: path.join(appPaths.cookRecipes, "command.hbs"),
    },
    {
        type: "lint",
        path: `${appPaths.src}/commands/{{properCase name}}Command.ts`,
    },
    {
        type: "append",
        path: path.join(appPaths.src, "cli.ts"),
        pattern: /import \{ Command.*/gi,
        template: 'import { {{properCase name}}Command } from "@commands/{{properCase name}}Command";',
    },
    {
        type: "append",
        path: path.join(appPaths.src, "cli.ts"),
        pattern: /(program.name.*)/gi,
        template: "program.addCommand(new {{properCase name}}Command());",
    },
    {
        type: "lint",
        path: path.join(appPaths.src, "cli.ts"),
    },
    {
        type: "add",
        path: `${appPaths.unitTests}/commands/{{properCase name}}Command.test.ts`,
        templateFile: path.join(appPaths.cookRecipes, "command.test.hbs"),
    },
    {
        type: "lint",
        path: `${appPaths.unitTests}/commands/{{properCase name}}Command.test.ts`,
    },
];

/**
 * Generator for creating a new CLI command file along with its test.
 *
 * Prompts the user for the command name (e.g., "Hello") and uses that name
 * to generate the command file, update the CLI entry point, and create a test file.
 */
export const commandGenerator = {
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
