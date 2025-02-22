import { describe, expect, it } from "bun:test";
import { HelloJob, type HelloJobData } from "@jobs/HelloJob";
import { BullMQTestHelper } from "@test-helpers/BullMQTestHelper";
import { LoggerTestHelper } from "@test-helpers/LoggerTestHelper";
import type { Job } from "bullmq";

describe("HelloJob", () => {
    const jobQueueName = "helloQueue";
    const jobWorkerName = "helloWorker";

    const { bullMQModule, addJobMocked } = BullMQTestHelper.createBullMQModuleInstance([jobQueueName]);
    const mockLoggerRegistry = LoggerTestHelper.createMockLoggerRegistry();
    const jobInstance = new HelloJob(bullMQModule, mockLoggerRegistry);

    it("should queue a job successfully", async () => {
        const jobData: HelloJobData = { name: "Alice" };
        const job = await jobInstance.queue(jobData);

        expect(addJobMocked).toHaveBeenCalledWith(jobQueueName, jobWorkerName, jobData);
        expect(job).toBeDefined();
        expect(job.id).toBe("mock-job-id");
        expect(job.queueName).toBe(jobQueueName);
        expect(job.name).toBe(jobWorkerName);
        expect(job.data).toStrictEqual(jobData);
    });

    it("should process job and log output", async () => {
        const mockJob = { id: "123", data: { name: "Alice" } } as unknown as Job<HelloJobData>;
        const result = await jobInstance.worker(mockJob);

        expect(result).toBe("Hi Alice! How are you?");
    });

    it("should log an error if job data is missing", async () => {
        const mockJob = { id: "123", data: {} } as unknown as Job<HelloJobData>;

        expect(jobInstance.worker(mockJob)).rejects.toThrow();
    });
});
