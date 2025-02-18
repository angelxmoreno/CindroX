import { exec } from "node:child_process";
import type { CustomActionFunction } from "node-plop";

/**
 * Custom lint action for Plop.
 *
 * This action runs a linter on the generated file using a shell command.
 * It expects a "path" property in the config object and a "name" property in the answers.
 *
 * The renderString function is used to render the file path template with the provided answers.
 *
 * Adjust the command (currently `bun lint:fix`) as needed for your linter setup.
 *
 * @param answers - The answers provided by the user (should include a 'name' property).
 * @param config - The configuration object for this action (should include a 'path').
 * @param data - Contains utility functions such as renderString.
 * @returns A promise that resolves with a success message or rejects with an error message.
 */
export const lintAction: CustomActionFunction = async ({ name }, { path }, { renderString }): Promise<string> => {
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
