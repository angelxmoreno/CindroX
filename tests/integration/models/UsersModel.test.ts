import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import AppContainer from "@config/container";
import type { UsersModel } from "@db/models/UsersModel";
import { DatabaseTestHelper } from "@test-helpers/DatabaseTestHelper";

describe("UserModel Integration Tests", () => {
    let usersModel: UsersModel;
    let dbHelper: DatabaseTestHelper;

    beforeAll(async () => {
        usersModel = AppContainer.resolve("UsersModel");
        dbHelper = new DatabaseTestHelper();
        await dbHelper.setup();
    });

    afterAll(async () => {
        await dbHelper.cleanup();
    });

    test("create() returns the inserted record and findById() retrieves it", async () => {
        const createdUser = await dbHelper.createUser();
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
        const createdUser = await dbHelper.createUser();
        const updatedData = { name: "Updated Name" };
        const updatedUser = await usersModel.update(createdUser.id, updatedData);
        expect(updatedUser.name).toEqual("Updated Name");
    });

    test("delete() removes the record", async () => {
        const createdUser = await dbHelper.createUser();
        await usersModel.delete(createdUser.id);
        const deletedUser = await usersModel.findById(createdUser.id);
        expect(deletedUser).toBeNull();
    });

    test("findAll() does not include password", async () => {
        const allUsers = await usersModel.findAll();
        for (const user of allUsers) {
            expect(user).not.toHaveProperty("password");
        }
    });

    test("findById() does not include password", async () => {
        const createdUser = await dbHelper.createUser();
        const fetchedUser = await usersModel.findById(createdUser.id);
        expect(fetchedUser).toBeDefined();
        expect(fetchedUser).not.toHaveProperty("password");
    });

    test("findByEmail() should include password", async () => {
        const createdUser = await dbHelper.createUser();
        const fetchedUser = await usersModel.findByEmail(createdUser.email);
        expect(fetchedUser).toBeDefined();
        expect(fetchedUser).toHaveProperty("password");
    });
});
