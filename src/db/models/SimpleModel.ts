// src/db/models/SimpleModel.ts
import type { MySqlTableWithColumns } from "drizzle-orm/mysql-core";
import { AbstractMySqlModel } from "./AbstractMySqlModel";

// biome-ignore lint/suspicious/noExplicitAny: The MySQL columns are unknown
export class SimpleModel<Table extends MySqlTableWithColumns<any>> extends AbstractMySqlModel<Table> {
    // No additional functionality—just a concrete implementation.
}
