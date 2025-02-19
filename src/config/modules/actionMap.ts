import type { BaseAction } from "@actions/BaseAction";
import { IdentityAction } from "@actions/auth/identityAction";
import { LoginAction } from "@actions/auth/loginAction";
import { RegisterAction } from "@actions/auth/registerAction";
import { IndexAction as HealthIndexAction } from "@actions/health/indexAction";

type ActionClass = new (...args: ConstructorParameters<typeof Object>) => BaseAction;

export type ActionDefinition = {
    path: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "ANY";
    action: ActionClass;
};

// Define all mapped actions
const actions: ActionDefinition[] = [
    { path: "/auth/login", method: "POST", action: LoginAction },
    { path: "/auth/register", method: "POST", action: RegisterAction },
    { path: "/auth/identity", method: "GET", action: IdentityAction },
    { path: "/health", method: "GET", action: HealthIndexAction },
];

const actionMap = new Map<string, ActionClass>();
for (const { path, method, action } of actions) {
    actionMap.set(`${method}:${path}`, action);
}

export default actionMap;
