type Environments = "development" | "production" | "test" | "staging";

export const getEnvValue = <T>(config: Partial<Record<Environments, T>>, defaultValue: T): T => {
    const env = process.env.NODE_ENV as Environments;
    return config[env] ?? defaultValue;
};
