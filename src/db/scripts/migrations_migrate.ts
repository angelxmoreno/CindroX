import process from "node:process";
// src/db/scripts/migrations_migrate.ts
import { DrizzleCli } from "./DrizzleCli";

async function main() {
    await new DrizzleCli().migrationsMigrateCommand();
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Unexpected error:", error);
        process.exit(1);
    });
