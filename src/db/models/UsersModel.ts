import { SimpleModel } from "@db/models/SimpleModel";
import { type UsersTable, usersTable } from "@db/schemas/users";
import type { MySql2Database } from "drizzle-orm/mysql2/driver";
import { inject, injectable } from "tsyringe";

@injectable()
export class UsersModel extends SimpleModel<UsersTable> {
    constructor(@inject("db") db: MySql2Database) {
        super(db, usersTable);
    }
}
