import { SimpleModel } from "@db/models/SimpleModel";
import { type QueueLogsTable, queueLogsTable } from "@db/schemas/queueLogs";
import type { MySql2Database } from "drizzle-orm/mysql2/driver";
import { inject, injectable } from "tsyringe";

@injectable()
export class QueueLogsModel extends SimpleModel<QueueLogsTable> {
    constructor(@inject("db") db: MySql2Database) {
        super(db, queueLogsTable);
    }
}
