import type { NodePlopAPI } from "node-plop";
import { commandGenerator } from "src/plop-generators/commandGenerator";
import { lintAction } from "src/plop-generators/lintAction";

/**
 * Plopfile entry point.
 *
 * This file registers custom action types and generators for your CLI.
 * In particular, it registers:
 *
 * - A custom "lint" action that lints the generated files using Biome (or your preferred linter).
 * - A "command" generator that creates a new command file and its corresponding test file.
 *
 * Usage:
 *   bun cindrox cook:command <CommandName>
 *
 * @param plop The NodePlopAPI instance provided by node-plop.
 */
export default function (plop: NodePlopAPI): void {
    // Register the custom lint action.
    plop.setActionType("lint", lintAction);
    // Register the "command" generator.
    plop.setGenerator("command", commandGenerator);
}
