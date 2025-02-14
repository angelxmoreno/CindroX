import "reflect-metadata";
import { describe, expect, it } from "bun:test";
import { appConfig } from "@config/app";

describe("App Configuration", () => {
    it("should have default values", () => {
        expect(appConfig.app.name).toBe("CindroX Sample API server");
        expect(appConfig.app.environment).toBe(Bun.env.NODE_ENV ?? "test");
    });

    it("should load database config from environment variables", () => {
        expect(appConfig.database.name).toBe(process.env.MYSQL_DATABASE ?? "dbName");
        expect(appConfig.database.user).toBe(process.env.MYSQL_USER ?? "mysql-user");
        expect(appConfig.database.password).toBe(process.env.MYSQL_PASSWORD ?? "mysql-password");
        expect(appConfig.database.port).toBe(Number(process.env.MYSQL_PORT ?? "3306"));
    });
});
