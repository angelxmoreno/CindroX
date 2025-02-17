// tests/integration/models/UserModel.test.ts
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import AppContainer from "@config/container";
import type { UsersModel } from "@db/models/UsersModel";
import { DrizzleCli } from "@db/scripts/DrizzleCli";
import type { MySql2Database } from "drizzle-orm/mysql2/driver";

describe("UserModel Integration Tests", () => {
    let usersModel: UsersModel;
    let db: MySql2Database;

    beforeAll(async () => {
        // Migrate the test database to the latest production schema.
        const cli = new DrizzleCli();
        await cli.migrationsMigrateCommand();
        db = AppContainer.resolve("db");
        usersModel = AppContainer.resolve("UsersModel");
    });

    afterAll(async () => {
        // Truncate the users table to clean up after tests.
        await db.execute("TRUNCATE TABLE `users`");
    });

    test("create() returns the inserted record and findById() retrieves it", async () => {
        const newUserData = {
            name: "Integration Test User",
            email: "integration@example.com",
            password: "password123",
        };

        const createdUser = await usersModel.create(newUserData);
        expect(createdUser).toBeDefined();
        expect(createdUser.id).toBeGreaterThan(0);

        const fetchedUser = await usersModel.findById(createdUser.id);
        expect(fetchedUser).toEqual(createdUser);
    });

    test("findAll() returns an array of records", async () => {
        const allUsers = await usersModel.findAll();
        expect(Array.isArray(allUsers)).toBe(true);
        // We expect at least one record, given previous tests.
        expect(allUsers.length).toBeGreaterThan(0);
    });

    test("update() returns the updated record", async () => {
        const newUserData = {
            name: "User To Update",
            email: "update@example.com",
            password: "pass",
        };
        const createdUser = await usersModel.create(newUserData);
        const updatedData = { name: "Updated Name" };
        const updatedUser = await usersModel.update(createdUser.id, updatedData);
        expect(updatedUser.name).toEqual("Updated Name");
    });

    test("delete() removes the record", async () => {
        const newUserData = {
            name: "User To Delete",
            email: "delete@example.com",
            password: "pass",
        };
        const createdUser = await usersModel.create(newUserData);
        await usersModel.delete(createdUser.id);
        const deletedUser = await usersModel.findById(createdUser.id);
        expect(deletedUser).toBeNull();
    });
});
