import { BaseAction } from "@actions/BaseAction";
import type { Context } from "hono";
import { injectable } from "tsyringe";

@injectable()
export class IndexAction extends BaseAction {
    async handle(c: Context): Promise<Response> {
        return c.json({ status: "ok", timestamp: Date.now() });
    }
}
