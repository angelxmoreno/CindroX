import { eq, getTableColumns } from "drizzle-orm";
import type { MySqlTableWithColumns } from "drizzle-orm/mysql-core";
import type { MySql2Database } from "drizzle-orm/mysql2/driver";

/**
 * AbstractMySqlModel provides common CRUD operations for MySQL.
 *
 * @template Table - A MySqlTable instance that includes type inference properties
 * such as `$inferSelect` and `$inferInsert`.
 *
 * This abstract class centralizes common database operations (create, read, update, delete)
 * and also handles column selection by excluding any sensitive or hidden fields.
 *
 * Subclasses should define the `hiddenColumns` array (if needed) to prevent sensitive fields
 * from being selected in queries.
 */
// biome-ignore lint/suspicious/noExplicitAny: The MySQL columns are unknown
export abstract class AbstractMySqlModel<Table extends MySqlTableWithColumns<any>> {
    protected db: MySql2Database;
    protected table: Table;
    /**
     * An array of column names to be excluded from select queries.
     */
    protected hiddenColumns: string[] = [];

    /**
     * Constructs a new instance of AbstractMySqlModel.
     *
     * @param db - The MySQL database connection.
     * @param table - The table associated with the model.
     */
    constructor(db: MySql2Database, table: Table) {
        this.db = db;
        this.table = table;
    }

    /**
     * Creates a new record in the table.
     *
     * This method inserts the provided data using the MySQL-specific
     * `$returningId()` method to fetch the newly created record's ID,
     * then queries the table to retrieve and return the full record.
     *
     * @param data - The data to insert (of type Table["$inferInsert"]).
     * @returns A Promise resolving to the inserted record (of type Table["$inferSelect"]).
     * @throws An error if the record cannot be retrieved after insertion.
     */
    async create(data: Table["$inferInsert"]): Promise<Table["$inferSelect"]> {
        // Insert the record and get the inserted record's ID.
        const [created] = await this.db.insert(this.table).values(data).$returningId();
        const { id } = created as { id: number };
        // Retrieve and return the full inserted record.
        const record = await this.findById(id);
        if (!record) {
            throw new Error("Failed to retrieve record after insertion");
        }
        return record;
    }

    /**
     * Finds a record by its primary key (assumed to be 'id').
     *
     * @param id - The primary key value.
     * @returns A Promise resolving to the record if found, or null otherwise.
     */
    async findById(id: number): Promise<Table["$inferSelect"] | null> {
        const result = await this.db.select(this.getColumns()).from(this.table).where(eq(this.table.id, id));
        return result[0] ?? null;
    }

    /**
     * Retrieves all records from the table.
     *
     * @returns A Promise resolving to an array of records.
     */
    async findAll(): Promise<Table["$inferSelect"][]> {
        return this.db.select(this.getColumns()).from(this.table);
    }

    /**
     * Updates a record by its primary key.
     *
     * Since MySQL doesn't support returning the updated record directly,
     * this method first performs the update and then queries the table
     * to retrieve the updated record.
     *
     * @param id - The primary key value.
     * @param data - A partial set of fields to update.
     * @returns A Promise resolving to the updated record.
     */
    async update(id: number, data: Partial<Table["$inferInsert"]>): Promise<Table["$inferSelect"]> {
        await this.db.update(this.table).set(data).where(eq(this.table.id, id));
        const [record] = await this.db.select().from(this.table).where(eq(this.table.id, id));
        return record;
    }

    /**
     * Deletes a record by its primary key.
     *
     * @param id - The primary key value.
     * @returns A Promise that resolves when the deletion is complete.
     */
    async delete(id: number): Promise<void> {
        await this.db.delete(this.table).where(eq(this.table.id, id));
    }

    /**
     * Returns a record of column definitions for the model's table,
     * excluding any columns marked as hidden.
     *
     * This method uses Drizzle's `getTableColumns` function to obtain an object
     * where each key is a column name and the value is its definition. It then filters
     * out any columns included in the `hiddenColumns` array.
     *
     * @returns A record of column definitions with sensitive fields excluded.
     */
    protected getColumns(): Table["_"]["columns"] {
        // Retrieve all column definitions from the table.
        const allColumns = getTableColumns(this.table);
        // Filter out columns that are marked as hidden.
        return Object.fromEntries(Object.entries(allColumns).filter(([key]) => !this.hiddenColumns.includes(key)));
    }
}
