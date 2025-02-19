import { BaseAction } from "@actions/BaseAction";
import type { Context } from "hono";
import { injectable } from "tsyringe";

@injectable()
export class IdentityAction extends BaseAction {
    useAuth = true;

    async handle(c: Context): Promise<Response> {
        const authUser = this.getAuthUser(c);
        return c.json({ authUser });
    }
}
