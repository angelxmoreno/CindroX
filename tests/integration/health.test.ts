import { describe, expect, it } from "bun:test";
import server from "@server/index";

describe("Health API", () => {
    it("should return a 200 status with OK response", async () => {
        const res = await server.request("/health", { method: "GET" });
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body).toEqual({
            status: "ok",
            timestamp: expect.any(Number),
        });
    });
});
