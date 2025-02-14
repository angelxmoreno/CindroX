import "reflect-metadata";
import { beforeEach, describe, expect, it } from "bun:test";
import AppContainer from "@config/container";
import type Emittery from "emittery";

describe("EventManager", () => {
    let eventManager: Emittery;
    let receivedData: unknown = null;

    beforeEach(() => {
        eventManager = AppContainer.resolve("EventManager");
        eventManager.on("test-event", (data: unknown) => {
            receivedData = data;
        });
    });

    it("should emit and receive an event", async () => {
        await eventManager.emit("test-event", { message: "Hello, World!" });
        expect(receivedData).toEqual({ message: "Hello, World!" });
    });

    it("should allow multiple listeners for an event", async () => {
        let count = 0;
        eventManager.on("multi-event", () => {
            count++;
        });
        eventManager.on("multi-event", () => {
            count++;
        });

        await eventManager.emit("multi-event");

        expect(count).toBe(2);
    });

    it("should remove a listener and stop receiving events", async () => {
        const handler = (data: unknown) => {
            receivedData = data;
        };
        eventManager.on("remove-event", handler);

        eventManager.off("remove-event", handler);
        await eventManager.emit("remove-event", { message: "Should not be received" });

        expect(receivedData).not.toEqual({ message: "Should not be received" });
    });

    it("should clear all listeners for an event", async () => {
        let count = 0;
        eventManager.on("clear-event", () => count++);
        eventManager.on("clear-event", () => count++);

        eventManager.clearListeners("clear-event");
        await eventManager.emit("clear-event");

        expect(count).toBe(0);
    });

    it("should emit an event and wait for all listeners to resolve", async () => {
        let result = "";
        eventManager.on("async-event", async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
            result = "done";
        });

        await eventManager.emit("async-event");
        expect(result).toBe("done");
    });
});
