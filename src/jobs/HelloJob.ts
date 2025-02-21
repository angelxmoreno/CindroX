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

    async worker(job: Job<HelloJobData>): Promise<void> {
        try {
            const { name } = job.data;
            if (!name) throw new Error("Missing name in job data");
            this.logger.info(`Hi ${name}! How are you?`);
        } catch (error) {
            this.logger.error({ jobId: job.id, error }, "Job failed");
        }
    }
}
