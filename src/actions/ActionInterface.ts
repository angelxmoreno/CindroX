import type { Context } from "hono";

export interface ActionInterface {
    handle(c: Context): Promise<Response>;
}
