import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

export const queueLogsTable = mysqlTable("queue_logs", {
    id: int("id").autoincrement().primaryKey(),
    queue: varchar({ length: 255 }).notNull(),
    jobId: varchar({ length: 255 }).notNull(),
    event: varchar({ length: 255 }).notNull(),
    details: varchar({ length: 255 }),
    created: timestamp("created_at").defaultNow(),
    modified: timestamp("modified_at").defaultNow().onUpdateNow(),
});

export type QueueLogsTable = typeof queueLogsTable;
export type SelectQueueLog = typeof queueLogsTable.$inferSelect;
export type InsertQueueLog = typeof queueLogsTable.$inferInsert;
