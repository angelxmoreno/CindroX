import { mock } from "bun:test";
import type { UsersModel } from "@db/models/UsersModel";
import type { InsertUser, SelectUser } from "@db/schemas/users";

const created = new Date("1980-03-08");
const modified = new Date();

const data: SelectUser[] = [
    {
        id: 1,
        name: "John Doe",
        email: "j.doe@example.com",
        password: "some-password",
        created,
        modified,
    },
    {
        id: 2,
        name: "Jane Doe",
        email: "jane@doe.example.com",
        password: "some-other-password",
        created,
        modified,
    },
];
let table: Map<number, SelectUser>;

table = new Map();
for (const row of data) {
    table.set(row.id, row);
}

const nextId = (): number => Math.max(...table.keys()) + 1;

const findById = mock(async (id: number): Promise<SelectUser | null> => {
    const result = table.get(id);
    return result ?? null;
});

const findByEmail = mock(async (email: string): Promise<SelectUser | null> => {
    const result = data.find((u) => u.email === email);
    return result ?? null;
});

const create = mock(async (data: InsertUser): Promise<SelectUser> => {
    const id = nextId();
    const result = {
        ...data,
        id,
        created: new Date(),
        modified: new Date(),
    };
    table.set(id, result);
    return result;
});

export const MockedUsersModel = { findByEmail, create, findById } as unknown as UsersModel;
