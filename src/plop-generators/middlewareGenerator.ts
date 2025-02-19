import path from "node:path";
import { appPaths } from "@config/paths";

/**
 * Actions array for the "middleware" generator.
 *
 * This generator performs the following steps:
 * 1. Adds a new middleware file at src/middleware/{{camelCase name}}Middleware.ts using a Handlebars template.
 * 2. Lints the generated middleware file.
 * 3. Appends an import statement for the new middleware to server/index.ts.
 * 4. Appends a server.use() call to server/index.ts to integrate the new middleware.
 * 5. Lints the updated server/index.ts.
 * 6. Adds a corresponding test file at tests/unit/middleware/{{camelCase name}}Middleware.test.ts.
 * 7. Lints the generated test file.
 */
const actions = [
    {
        type: "add",
        path: `${appPaths.src}/middleware/{{camelCase name}}Middleware.ts`,
        templateFile: path.join(appPaths.cookRecipes, "middleware.hbs"),
    },
    {
        type: "lint",
        path: `${appPaths.src}/middleware/{{camelCase name}}Middleware.ts`,
    },
    {
        type: "append",
        path: path.join(appPaths.src, "server/index.ts"),
        pattern: /import \{ Hono.*/gi,
        template: 'import { {{camelCase name}}Middleware } from "@middleware/{{camelCase name}}Middleware";',
    },
    {
        type: "append",
        path: path.join(appPaths.src, "server/index.ts"),
        pattern: /const server = new Hono.*/gi,
        template: "server.use({{camelCase name}}Middleware);",
    },
    {
        type: "lint",
        path: path.join(appPaths.src, "server/index.ts"),
    },
    {
        type: "add",
        path: `${appPaths.unitTests}/middleware/{{camelCase name}}Middleware.test.ts`,
        templateFile: path.join(appPaths.cookRecipes, "middleware.test.hbs"),
    },
    {
        type: "lint",
        path: `${appPaths.unitTests}/middleware/{{camelCase name}}Middleware.test.ts`,
    },
];

/**
 * Generator for creating a new Hono middleware file and integrating it into the server.
 *
 * This generator prompts for the middleware name (e.g., "Auth") and uses that name to:
 * - Generate a middleware file at src/middleware/{{camelCase name}}Middleware.ts.
 * - Append an import statement and a server.use() call to server/index.ts.
 * - Generate a corresponding test file at tests/unit/middleware/{{camelCase name}}Middleware.test.ts.
 * - Lint all generated and updated files.
 *
 * Usage:
 *   bun cindrox cook:middleware <name>
 *
 * Example:
 *   bun cindrox cook:middleware Auth
 */
export const middlewareGenerator = {
    description: "Generate a new Hono middleware file and integrate it into the server",
    prompts: [
        {
            type: "input",
            name: "name",
            message: "Enter the middleware name (e.g., Auth):",
        },
    ],
    actions,
};
