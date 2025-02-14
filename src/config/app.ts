import defaultConfig, { type AppConfig } from "@config/default";

export const appConfig: AppConfig = {
    ...defaultConfig,
    app: {
        ...defaultConfig.app,
        name: "CindroX Sample API server",
    },
};
