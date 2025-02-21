import type { BullMQModule } from "@config/modules/BullMQModule";
import type { LoggerRegistry } from "@config/modules/LoggerRegistry";
import type { Job } from "bullmq";
import type { Logger } from "pino";

/**
 * Abstract base class for BullMQ jobs.
 * - Provides structure for creating jobs and workers.
 * - Handles job queuing and logging.
 * - Requires child classes to implement the `worker()` method.
 *
 * @template DATA - The shape of the job data payload.
 */
export abstract class BaseJob<DATA extends Record<string, unknown>> {
    /**
     * The name of the queue this job belongs to.
     * Must be defined by the child class.
     */
    protected abstract queueName: string;

    /**
     * The name of the job inside the queue.
     * Used when adding jobs to the queue.
     */
    protected abstract jobName: string;

    /**
     * BullMQ module instance for interacting with queues.
     */
    protected bullMQ: BullMQModule;

    /**
     * Logger registry instance for retrieving loggers.
     */
    protected loggerRegistry: LoggerRegistry;

    /**
     * Cached logger instance to avoid repeated lookups.
     */
    protected _logger?: Logger;

    /**
     * Constructs the BaseJob class.
     *
     * @param bullMQ - The BullMQ module instance.
     * @param loggerRegistry - The logger registry instance.
     */
    protected constructor(bullMQ: BullMQModule, loggerRegistry: LoggerRegistry) {
        this.bullMQ = bullMQ;
        this.loggerRegistry = loggerRegistry;
    }

    /**
     * Queues a new job in the specified queue.
     *
     * @param data - The job data payload.
     * @returns The created job instance.
     */
    async queue(data: DATA): Promise<Job<DATA>> {
        return this.bullMQ.addJob(this.queueName, this.jobName, data);
    }

    /**
     * Retrieves a logger instance specific to this queue.
     * - Uses lazy initialization to prevent unnecessary logger creation.
     *
     * @returns The logger instance.
     */
    get logger(): Logger {
        if (!this._logger) {
            this._logger = this.loggerRegistry.getLogger(`Queue/${this.queueName}`);
        }

        return this._logger;
    }

    /**
     * Worker function that processes jobs from the queue.
     * Must be implemented by child classes.
     *
     * @param job - The job instance containing job data.
     */
    abstract worker(job: Job<DATA>): Promise<void>;
}
