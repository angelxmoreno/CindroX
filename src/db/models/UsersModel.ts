import { SimpleModel } from "@db/models/SimpleModel";
import { type InsertUser, type SelectUser, type UsersTable, usersTable } from "@db/schemas/users";
import argon2 from "argon2";
import { eq } from "drizzle-orm";
import type { MySql2Database } from "drizzle-orm/mysql2/driver";
import { inject, injectable } from "tsyringe";

@injectable()
export class UsersModel extends SimpleModel<UsersTable> {
    hiddenColumns = ["password"];

    constructor(@inject("db") db: MySql2Database) {
        super(db, usersTable);
    }

    /**
     * Find a user by their email
     * @param email - The email address to lookup
     * @returns The user if found, or null otherwise.
     */
    async findByEmail(email: string): Promise<SelectUser | null> {
        const result = await this.db.select().from(this.table).where(eq(this.table.email, email));
        return result[0] ?? null;
    }

    /**
     * Create a new user.
     * Uses .$returningId() to retrieve the new user's ID, then queries the table.
     * @param data - The data for insertion.
     * @returns The newly inserted record.
     */
    async create(data: InsertUser): Promise<SelectUser> {
        const hashedPassword = await argon2.hash(data.password);

        const [created] = await this.db
            .insert(this.table)
            .values({
                ...data,
                password: hashedPassword,
            })
            .$returningId();
        const { id } = created as { id: number };
        // Fetch and return the full inserted record.
        const record = await this.findById(id);
        if (!record) {
            throw new Error("Failed to retrieve record after insertion");
        }
        return record;
    }
}
