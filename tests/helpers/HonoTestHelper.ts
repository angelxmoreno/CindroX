// tests/helpers/HonoTestHelper.ts
import type { Context, HonoRequest, Next } from "hono";

/**
 * The fakeHeader function mimics the header accessor expected by HonoRequest.
 * When called with a name, it returns an empty string (indicating no value).
 * When called without arguments, it returns an empty record.
 */
function fakeHeader(name?: string): string | Record<string, string> {
    if (name) {
        return "";
    }
    return {};
}

/**
 * FakeResponse is a minimal implementation of a response object used for testing.
 * It provides methods to capture status code and body values.
 */
export interface FakeResponse {
    statusCode: number;
    body: unknown;
    status: (code: number) => FakeResponse;
    send: (body: unknown) => FakeResponse;
    json: (obj: unknown) => FakeResponse;
}

/**
 * Creates a fake response object that captures the status code and body.
 *
 * @returns A FakeResponse object.
 */
function createFakeResponse(): FakeResponse {
    const res: FakeResponse = {
        statusCode: 200,
        body: undefined,
        status(code: number) {
            res.statusCode = code;
            return res;
        },
        send(body: unknown) {
            res.body = body;
            return res;
        },
        json(obj: unknown) {
            res.body = obj;
            return res;
        },
    };
    return res;
}

/**
 * HonoTestHelper provides utility methods for testing Hono middleware and handlers.
 *
 * It creates a minimal mock Context with a fake request and a fake response,
 * as well as simple in-memory set/get functions to simulate context storage.
 */
export class HonoTestHelper {
    /**
     * Creates a minimal mock context for testing.
     *
     * Instead of instantiating the full Hono Context (which is constructed internally),
     * this helper creates a minimal object with a fake request and a fake response.
     *
     * @param reqOverrides - Optional properties to override the default request.
     * @returns An object containing the mock context (`ctx`) and the fake response (`resSpy`).
     */
    public createMockContext(reqOverrides?: Partial<HonoRequest>): { ctx: Context; resSpy: FakeResponse } {
        // Build a default request with a fake header function and a minimal generic json() method.
        const defaultReq: Partial<HonoRequest> = {
            method: "GET",
            url: "/test",
            header: fakeHeader,
            // Provide a generic json() method that returns a Promise of type T.
            json: async <T = unknown>(): Promise<T> => ({}) as T,
            ...reqOverrides,
        } as unknown as HonoRequest;

        const resSpy = createFakeResponse();

        // Create a simple in-memory store for context properties.
        const store: Record<string, unknown> = {};

        // Construct a minimal context.
        const ctx: Context = {
            req: defaultReq as Context["req"],
            res: resSpy as unknown as Response,
            env: {},
            final: false,
            // Simple JSON method for convenience.
            json: (obj: unknown) => JSON.stringify(obj),
            // set: stores data in the internal store.
            set(key: string, value: unknown) {
                store[key] = value;
            },
            // get: retrieves data from the internal store.
            get(key: string): unknown {
                return store[key];
            },
        } as unknown as Context;

        return { ctx, resSpy };
    }

    /**
     * Creates a mock Next function for testing Hono middleware.
     *
     * @param callback - Optional asynchronous callback to simulate middleware behavior.
     * @returns A Next function that returns a resolved Promise.
     */
    public createMockNext(callback?: () => Promise<void>): Next {
        return async () => {
            if (callback) {
                await callback();
            }
        };
    }
}
