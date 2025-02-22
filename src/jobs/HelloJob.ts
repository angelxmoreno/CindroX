import type { BullMQModule } from "@config/modules/BullMQModule";
import type { LoggerRegistry } from "@config/modules/LoggerRegistry";
import { BaseJob } from "@jobs/BaseJob";
import type { Job } from "bullmq";
import { inject, injectable } from "tsyringe";

export type HelloJobData = { name: string };

@injectable()
export class HelloJob extends BaseJob<HelloJobData> {
    protected queueName = "helloQueue";
    protected jobName = "helloWorker";

    constructor(@inject("BullMQ") bullMQ: BullMQModule, @inject("Loggers") loggerRegistry: LoggerRegistry) {
        super(bullMQ, loggerRegistry);
    }

    async worker(job: Job<HelloJobData>): Promise<string> {
        try {
            const { name } = job.data;
            if (!name) throw new Error("Missing name in job data");
            const greeting = `Hi ${name}! How are you?`;
            this.logger.info(greeting);
            return greeting;
        } catch (error) {
            this.logger.error({ jobId: job.id, error }, "Job failed");
            throw error; // Rethrow original error instead of creating a new one
        }
    }
}
