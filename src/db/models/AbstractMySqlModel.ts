import { eq } from "drizzle-orm";
import type { MySqlTableWithColumns } from "drizzle-orm/mysql-core";
import type { MySql2Database } from "drizzle-orm/mysql2/driver";

/**
 * AbstractMySqlModel provides common CRUD operations for MySQL.
 *
 * @template Table - A MySqlTable instance that includes the type inference properties
 * `$inferSelect` and `$inferInsert`.
 */
// biome-ignore lint/suspicious/noExplicitAny: The MySQL columns are unknown
export abstract class AbstractMySqlModel<Table extends MySqlTableWithColumns<any>> {
    protected db: MySql2Database;
    protected table: Table;

    constructor(db: MySql2Database, table: Table) {
        this.db = db;
        this.table = table;
    }

    /**
     * Create a new record.
     * Uses .$returningId() to retrieve the new record's ID, then queries the table.
     * @param data - The data for insertion.
     * @returns The newly inserted record.
     */
    async create(data: Table["$inferInsert"]): Promise<Table["$inferSelect"]> {
        // Insert and get the inserted record's ID using MySQL-specific returning method.
        const [created] = await this.db.insert(this.table).values(data).$returningId();
        const { id } = created as { id: number };
        // Fetch and return the full inserted record.
        const record = await this.findById(id);
        if (!record) {
            throw new Error("Failed to retrieve record after insertion");
        }
        return record;
    }

    /**
     * Find a record by its primary key (assumed to be named 'id').
     * @param id - The primary key value.
     * @returns The record if found, or null otherwise.
     */
    async findById(id: number): Promise<Table["$inferSelect"] | null> {
        const result = await this.db.select().from(this.table).where(eq(this.table.id, id));
        return result[0] ?? null;
    }

    /**
     * Find all records in the table.
     * @returns An array of all records.
     */
    async findAll(): Promise<Table["$inferSelect"][]> {
        return this.db.select().from(this.table);
    }

    /**
     * Update a record by its primary key.
     * Since MySQL doesn't support returning updated records, we query after updating.
     * @param id - The primary key value.
     * @param data - The fields to update.
     * @returns The updated record.
     */
    async update(id: number, data: Partial<Table["$inferInsert"]>): Promise<Table["$inferSelect"]> {
        await this.db.update(this.table).set(data).where(eq(this.table.id, id));
        const [record] = await this.db.select().from(this.table).where(eq(this.table.id, id));
        return record;
    }

    /**
     * Delete a record by its primary key.
     * @param id - The primary key value.
     */
    async delete(id: number): Promise<void> {
        await this.db.delete(this.table).where(eq(this.table.id, id));
    }
}
