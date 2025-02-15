import { appConfig } from "@config/app";
import Keyv from "@keyvhq/core";
import KeyvRedis from "@keyvhq/redis";

const cacheConfig = appConfig.cache;

const adapter =
    cacheConfig.driver === "redis" && cacheConfig.redisUrl
        ? new Keyv({ store: new KeyvRedis(cacheConfig.redisUrl) })
        : new Keyv();

export class CacheClassModule {
    adapter: Keyv = adapter;

    async get<T>(key: string): Promise<T | undefined> {
        return (await this.adapter.get(key)) as T | undefined;
    }

    async set<T>(key: string, value: T, ttl?: number) {
        await this.adapter.set(key, value, ttl);
    }

    async delete(key: string) {
        await this.adapter.delete(key);
    }

    async clear() {
        await this.adapter.clear();
    }
}
