import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import server from "@server/index";
import { DatabaseTestHelper } from "@test-helpers/DatabaseTestHelper";

describe("Log In Action", () => {
    let dbHelper: DatabaseTestHelper;

    beforeAll(async () => {
        dbHelper = new DatabaseTestHelper();
        await dbHelper.setup();
    });

    afterAll(async () => {
        await dbHelper.cleanup();
    });

    it("returns the user object with a jwt on success", async () => {
        const password = "applePie4k!";
        const user = await dbHelper.createUser({ password });
        const res = await server.request("/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email: user.email,
                password: password,
            }),
            headers: { "Content-Type": "application/json" },
        });
        const body = await res.json();
        expect(res.status).toBe(200);
        expect(body).toEqual({
            user: expect.objectContaining({
                id: user.id,
                email: user.email,
                name: user.name,
            }),
            token: expect.any(String),
        });
    });
    it("returns a 401 error on invalid credentials", async () => {
        const res = await server.request("/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email: "no-email",
                password: "wrongPassword",
            }),
            headers: { "Content-Type": "application/json" },
        });

        const body = await res.json();
        expect(res.status).toBe(401);
        // You can also check for the error message if desired.
        expect(body).toHaveProperty("message", expect.any(String));
    });
});
