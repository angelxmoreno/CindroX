import { type ConnectionOptions, type Job, Queue, type RedisClient, Worker } from "bullmq";
import type { RepeatOptions } from "bullmq/dist/esm/interfaces";
import type { JobSchedulerTemplateOptions, JobsOptions } from "bullmq/dist/esm/types";
import type { Logger } from "pino";

/**
 * Defines a template for repeatable jobs in BullMQ.
 */
type RepeatableJobTemplate = {
    name: string;
    data: Record<string, unknown>;
    opts?: JobSchedulerTemplateOptions;
};

export class BullMQModule {
    /** Logger instance for queue-related logs */
    private logger: Logger;

    /** Registry to store created queues and prevent duplicates */
    private readonly queueRegistry: Map<string, Queue> = new Map();

    /** Redis connection details */
    private readonly redisConnection: ConnectionOptions;

    /**
     * Initializes BullMQModule, setting up Redis connection and preloading queues.
     */
    constructor({
        logger,
        redisClient,
        redisUrl,
        queueNames,
    }: {
        logger: Logger;
        redisUrl?: string;
        redisClient?: RedisClient;
        queueNames?: string[];
    }) {
        this.logger = logger;

        if (redisUrl) {
            const parts = new URL(redisUrl);
            this.redisConnection = {
                host: parts.hostname,
                port: Number(parts.port),
            };
        } else if (redisClient) {
            this.redisConnection = redisClient;
        } else {
            throw new Error("Either redisClient or redisUrl are required");
        }
        const queuesToCreate = queueNames ?? [];
        // Preload queues from configuration
        for (const queueName of queuesToCreate) {
            this.createQueue(queueName);
        }
    }

    /**
     * Creates or retrieves a queue from the registry.
     * Ensures that multiple instances of the same queue are not created.
     *
     * @param name - The name of the queue
     * @returns The queue instance
     */
    protected createQueue(name: string): Queue {
        let queue = this.queueRegistry.get(name);
        if (!queue) {
            queue = new Queue(name, { connection: this.redisConnection });
            this.queueRegistry.set(name, queue);
            this.logger.info(`New queue ${name} created`);
        } else {
            this.logger.info(`Using existing queue ${name}`);
        }
        return queue;
    }

    get createdQueueNames(): string[] {
        return Array.from(this.queueRegistry.keys());
    }

    /**
     * Creates a worker to process jobs in the specified queue.
     *
     * @param name - The name of the queue to process
     * @param processor - A function to process jobs in the queue
     * @param concurrency - The maximum number of concurrent jobs the worker can process
     * @returns The created Worker instance
     */
    createWorker(name: string, processor: (job: Job) => Promise<void>, concurrency = 5): Worker {
        const worker = new Worker(name, processor, {
            connection: this.redisConnection,
            concurrency,
        });

        this.logger.info(`New worker ${name} created`);
        return worker;
    }

    /**
     * Creates or updates a job scheduler for repeatable jobs.
     * Uses BullMQ's `upsertJobScheduler` to ensure jobs are not duplicated.
     *
     * @param queue - The queue where the job will be scheduled
     * @param jobSchedulerId - A unique identifier for the job scheduler
     * @param repeatConfig - Configuration for job repetition (interval or cron pattern)
     * @param jobTemplate - The job's template, including name, data, and options
     * @returns A promise resolving to the scheduled job, if created
     */
    createJobScheduler(
        queue: Queue,
        jobSchedulerId: string,
        repeatConfig: Omit<RepeatOptions, "key">,
        jobTemplate: RepeatableJobTemplate,
    ): Promise<Job | undefined> {
        return queue.upsertJobScheduler(jobSchedulerId, repeatConfig, jobTemplate);
    }

    /**
     * Adds a new job to the specified queue.
     * Ensures the queue exists before adding the job.
     *
     * @param queueName - The name of the queue
     * @param jobName - The name of the job
     * @param data - The job payload
     * @param opts - Optional job configuration (e.g., delay, priority, attempts)
     * @returns A promise resolving to the created job
     * @throws Error if the queue does not exist
     */
    async addJob<DATA extends Record<string, unknown> = Record<string, unknown>>(
        queueName: string,
        jobName: string,
        data: DATA,
        opts?: JobsOptions,
    ): Promise<Job<DATA>> {
        const queue = this.queueRegistry.get(queueName);
        if (!queue) {
            throw new Error(`No queue with the name "${queueName}" was found.`);
        }

        const job = await queue.add(jobName, data, opts);
        this.logger.info(
            {
                queue: queueName,
                job: jobName,
                id: job.id,
            },
            "Job created",
        );
        return job;
    }
}
