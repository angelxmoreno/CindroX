import * as process from "node:process";
// src/db/scripts/migrations_generate.ts
import { DrizzleCli } from "./DrizzleCli";

async function main() {
    const migrationName = process.argv[2] || "new_migration";
    await new DrizzleCli().migrationsGenerateCommand(migrationName);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Unexpected error:", error);
        process.exit(1);
    });
