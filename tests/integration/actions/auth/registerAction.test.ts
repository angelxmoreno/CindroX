import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import server from "@server/index";
import { DatabaseTestHelper } from "@test-helpers/DatabaseTestHelper";

describe("Register Action", () => {
    let dbHelper: DatabaseTestHelper;

    beforeAll(async () => {
        dbHelper = new DatabaseTestHelper();
        await dbHelper.setup();
    });

    afterAll(async () => {
        await dbHelper.cleanup();
    });

    it("returns the user object with a JWT on success", async () => {
        // Use makeUser to generate default user data without persisting it.
        const user = dbHelper.makeUser();
        // Simulate a registration request using the generated user data.
        const res = await server.request("/auth/register", {
            method: "POST",
            body: JSON.stringify({
                name: user.name,
                email: user.email,
                password: user.password,
            }),
            headers: { "Content-Type": "application/json" },
        });
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body).toEqual({
            user: expect.objectContaining({
                id: expect.any(Number),
                email: user.email,
                name: user.name,
            }),
            token: expect.any(String),
        });
    });

    it("returns a 400 error on duplicate registration", async () => {
        // Generate a new user with default data.
        const newUser = dbHelper.makeUser();
        // First, create the user in the database.
        await dbHelper.createUser({ email: newUser.email });
        // Attempt to register again with the same email.
        const res = await server.request("/auth/register", {
            method: "POST",
            body: JSON.stringify({
                name: newUser.name,
                email: newUser.email,
                password: newUser.password,
            }),
            headers: { "Content-Type": "application/json" },
        });

        const body = await res.json();
        expect(res.status).toBe(400);
        // Check for a message property indicating the duplicate registration error.
        expect(body).toHaveProperty("message", expect.any(String));
    });
});
