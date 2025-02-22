import path from "node:path";
import { appPaths } from "@config/paths";

/**
 * Defines the expected structure of user answers in Plop prompts.
 */
interface JobGeneratorAnswers {
    name: string;
    queueName: string;
    registerDI: boolean;
}

/**
 * Defines the Plop actions array with correct TypeScript typing.
 */
const defaultActions = [
    {
        type: "add",
        path: `${appPaths.src}/jobs/{{properCase name}}Job.ts`,
        templateFile: path.join(appPaths.cookRecipes, "job.hbs"),
    },
    {
        type: "lint",
        path: `${appPaths.src}/jobs/{{properCase name}}Job.ts`,
    },

    // Add the unit test file for the Job
    {
        type: "add",
        path: `${appPaths.unitTests}/jobs/{{properCase name}}Job.test.ts`,
        templateFile: path.join(appPaths.cookRecipes, "job.test.hbs"),
    },
    {
        type: "lint",
        path: `${appPaths.unitTests}/jobs/{{properCase name}}Job.test.ts`,
    },
];

const withDIActions = [
    // Conditionally register job in Dependency Injection (DI) container
    {
        type: "append",
        path: path.join(appPaths.src, "config/modules/AppContainerModuleClass.ts"),
        pattern: /import type \{ DependencyContainer.*/gi,
        template: 'import type { {{properCase name}}Job } from "@jobs/{{properCase name}}Job";',
    },

    {
        type: "append",
        path: path.join(appPaths.src, "config/modules/AppContainerModuleClass.ts"),
        pattern: /interface AppDependencies.*/gi,
        template: "{{properCase name}}Job: {{properCase name}}Job;",
    },

    {
        type: "lint",
        path: path.join(appPaths.src, "config/modules/AppContainerModuleClass.ts"),
    },

    {
        type: "append",
        path: path.join(appPaths.src, "config/container.ts"),
        pattern: /import \{ type DependencyContainer.*/gi,
        template: 'import { {{properCase name}}Job } from "@jobs/{{properCase name}}Job";',
    },

    {
        type: "append",
        path: path.join(appPaths.src, "config/container.ts"),
        pattern: /const actionsContainer: DependencyContainer.*/gi,
        template:
            'baseContainer.register<{{properCase name}}Job>("{{properCase name}}Job", { useClass: {{properCase name}}Job });',
    },
    {
        type: "lint",
        path: path.join(appPaths.src, "config/container.ts"),
    },
    // Create the worker file for processing the job
    {
        type: "add",
        path: `${appPaths.src}/workers/{{properCase name}}Worker.ts`,
        templateFile: path.join(appPaths.cookRecipes, "worker.hbs"),
    },
    {
        type: "lint",
        path: `${appPaths.src}/workers/{{properCase name}}Worker.ts`,
    },
    // Append worker entry to ecosystem.config.cjs for PM2
    {
        type: "append",
        path: `${appPaths.src}/workers/ecosystem.config.cjs`,
        pattern: /apps: \[/gi,
        template: `  {
    name: "{{properCase name}}Worker",
    script: "src/workers/{{properCase name}}Worker.ts",
    // instances: 2, 
    // exec_mode: "cluster", // does not work with custom interpreter
    out_file: "logs/workers/{{camelCase name}}Worker.log",
    error_file: "logs/workers/{{camelCase name}}Worker-errors.log",
    ...common,
  },`,
    },
    {
        type: "lint",
        path: `${appPaths.src}/workers/ecosystem.config.cjs`,
    },
];

/**
 * Plop generator for creating a new Job class.
 *
 * Usage:
 * ```sh
 * bun cindrox cook:job <name> --queue <queueName> --di
 * ```
 *
 * Example:
 * ```sh
 * bun cindrox cook:job Mail --queue=emailQueue --di
 * ```
 */
export const jobGenerator = {
    description: "Generate a new Job class",
    prompts: [
        {
            type: "input",
            name: "name",
            message: "Enter the Job name (e.g., Mail will create MailJob):",
        },
        {
            type: "input",
            name: "queueName",
            message: "Enter the name of the worker Queue:",
        },
        {
            type: "confirm",
            name: "registerDI",
            message: "Should this job be injected into DI?",
            default: false,
        },
    ],
    actions: (data?: JobGeneratorAnswers) =>
        data?.registerDI === true ? [...defaultActions, ...withDIActions] : defaultActions,
};
