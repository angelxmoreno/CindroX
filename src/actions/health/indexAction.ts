import type { ActionInterface } from "@actions/ActionInterface";
import type { Context } from "hono";
import type { Logger } from "pino";
import { inject, injectable } from "tsyringe";

@injectable()
export class IndexAction implements ActionInterface {
    constructor(@inject("Logger") private logger: Logger) {}

    async handle(c: Context): Promise<Response> {
        this.logger.info("Health check accessed");
        return c.json({ status: "ok" });
    }
}
