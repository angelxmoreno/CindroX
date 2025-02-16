import type { ActionInterface } from "@actions/ActionInterface";
import { IndexAction as HealthIndexAction } from "@actions/health/indexAction";

type ActionClass = new (...args: ConstructorParameters<typeof Object>) => ActionInterface;
export type ActionDefinition = {
    path: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "ANY";
    action: ActionClass;
};

// Define all mapped actions
const actions: ActionDefinition[] = [{ path: "/health", method: "GET", action: HealthIndexAction }];

const actionMap = new Map<string, ActionClass>();
for (const { path, method, action } of actions) {
    actionMap.set(`${method}:${path}`, action);
}

export default actionMap;
