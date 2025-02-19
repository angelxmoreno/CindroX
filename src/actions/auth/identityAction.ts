import { BaseAction } from "@actions/BaseAction";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { injectable } from "tsyringe";

@injectable()
export class IdentityAction extends BaseAction {
    useAuth = true;

    async handle(c: Context): Promise<Response> {
        const authUser = this.getAuthUser(c);
        if (!authUser) {
            throw new HTTPException(400, { message: "No auth data found" });
        }
        const { password, ...safeUserData } = authUser;
        return c.json({ authUser: safeUserData });
    }
}
