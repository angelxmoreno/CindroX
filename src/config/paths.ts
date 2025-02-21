import * as path from "node:path";

import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootPath = path.join(__dirname, "..", "..");
const srcPath = path.join(rootPath, "src");
const dbPath = path.join(rootPath, "src", "db");
const unitTestsPath = path.join(rootPath, "tests", "unit");
const cookRecipesPath = path.join(srcPath, "templates", "cook");

export const appPaths = {
    root: rootPath,
    src: srcPath,
    unitTests: unitTestsPath,
    cookRecipes: cookRecipesPath,
    db: dbPath,
};
