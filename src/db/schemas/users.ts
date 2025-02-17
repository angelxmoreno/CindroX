import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable("users", {
    id: int("id").autoincrement().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    created: timestamp("created_at").defaultNow(),
    modified: timestamp("modified_at").defaultNow().onUpdateNow(),
});

export type SelectUser = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;
