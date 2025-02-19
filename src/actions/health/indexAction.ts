import { BaseAction } from "@actions/BaseAction";
import type { Context } from "hono";
import type { Logger } from "pino";
import { inject, injectable } from "tsyringe";

@injectable()
export class IndexAction extends BaseAction {
    constructor(@inject("Logger") private logger: Logger) {
        super();
    }

    async handle(c: Context): Promise<Response> {
        this.logger.info("Health check accessed");
        return c.json({ status: "ok", timestamp: Date.now() });
    }
}
