import "reflect-metadata";
import { describe, expect, it } from "bun:test";
import { CacheClassModule } from "@config/modules/cache";

const cache = new CacheClassModule();

describe("Cache System", () => {
    it("should store and retrieve values", async () => {
        await cache.set("test-key", "test-value", 10000);
        const value = await cache.get("test-key");
        expect(value).toBe("test-value");
    });

    it("should delete a key", async () => {
        await cache.set("delete-key", "to-delete", 10000);
        await cache.delete("delete-key");
        const value = await cache.get("delete-key");
        expect(value).toBeUndefined();
    });

    it("should clear all cache", async () => {
        await cache.set("clear-key", "to-clear", 10000);
        await cache.clear();
        const value = await cache.get("clear-key");
        expect(value).toBeUndefined();
    });
});
