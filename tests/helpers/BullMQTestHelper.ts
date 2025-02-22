import { mock, spyOn } from "bun:test";
import { BullMQModule } from "@config/modules/BullMQModule";
import { LoggerTestHelper } from "@test-helpers/LoggerTestHelper";
import type { Job, Queue } from "bullmq";
import type { Worker } from "bullmq";
import type { JobsOptions } from "bullmq/dist/esm/types";

export class BullMQTestHelper {
    static createBullMQModuleInstance(queueNames: string[]) {
        const mockedLoggers = LoggerTestHelper.createMockLogger();
        const bullMQModule = new BullMQModule({
            redisUrl: "redis://no-redis",
            logger: mockedLoggers.logger,
            queueNames,
        });

        spyOn(bullMQModule, "createQueueInstance").mockImplementation((_name: string) => mock() as unknown as Queue);

        /**
         * @TODO there are a dozen different methods across the dozen methods that try to establish a redis connection
         * so we need mock Workers
         */
        spyOn(bullMQModule, "createWorker").mockImplementation(
            (_name: string, _processor: (job: Job) => Promise<void>, _concurrency = 5): Worker =>
                mock() as unknown as Worker,
        );

        const addJobMocked = spyOn(bullMQModule, "addJob").mockImplementation(
            async (queueName: string, name: string, data: Record<string, unknown>, _opts?: JobsOptions) => {
                if (queueName.startsWith("nonExistent")) {
                    throw new Error(`No queue with the name "${queueName}" was found.`);
                }
                const job = {
                    id: "mock-job-id",
                    data,
                    name,
                    queueName,
                } as unknown as Job;

                mockedLoggers.infoLoggerMock(
                    {
                        queue: queueName,
                        job: name,
                        id: job.id,
                    },
                    "Job created",
                );

                return job;
            },
        );

        return { ...mockedLoggers, bullMQModule, addJobMocked };
    }
}
