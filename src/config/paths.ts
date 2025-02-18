import * as path from "node:path";

const rootPath = path.join(__dirname, "..", "..");
const srcPath = path.join(rootPath, "src");
const unitTestsPath = path.join(rootPath, "tests", "unit");
const cookRecipesPath = path.join(srcPath, "templates", "cook");

export const appPaths = { root: rootPath, src: srcPath, unitTests: unitTestsPath, cookRecipes: cookRecipesPath };
