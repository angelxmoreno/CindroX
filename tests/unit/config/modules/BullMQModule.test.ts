import { describe, expect, it } from "bun:test";
import { BullMQTestHelper } from "@test-helpers/BullMQTestHelper";
import { Worker } from "bullmq";

describe("BullMQModule", () => {
    it("should create a new queue if not in registry", () => {
        const queueName1 = `testQueue${Date.now()}`;
        const queueName2 = `testQueue2${Date.now()}`;
        const { bullMQModule } = BullMQTestHelper.createBullMQModuleInstance([queueName1, queueName2]);

        const queuesCreated = bullMQModule.createdQueueNames;
        expect(queuesCreated).toBeArrayOfSize(2);
        expect(queuesCreated[0]).toBe(queueName1);
        expect(queuesCreated[1]).toBe(queueName2);
    });

    it("should create only 1 queue per name", () => {
        const queueName = `testQueue${Date.now()}`;
        const { bullMQModule } = BullMQTestHelper.createBullMQModuleInstance([queueName, queueName, queueName]);
        const queuesCreated = bullMQModule.createdQueueNames;
        expect(queuesCreated).toBeArrayOfSize(1);
        expect(queuesCreated[0]).toBe(queueName);
    });

    /**
     * @todo no point in testing if a stub stubs correctly
     */
    it.skip("should create a worker", () => {
        const queueName = `testQueue${Date.now()}`;
        const { bullMQModule } = BullMQTestHelper.createBullMQModuleInstance([queueName]);
        const worker = bullMQModule.createWorker("testQueue", async () => {});
        expect(worker).toBeInstanceOf(Worker);
    });

    it("should throw an error if queue does not exist when adding a job", async () => {
        const queueName = `testQueue${Date.now()}`;
        const { bullMQModule } = BullMQTestHelper.createBullMQModuleInstance([queueName]);

        expect(bullMQModule.addJob("nonExistentQueue", "test-job", { foo: "bar" })).rejects.toThrow(
            'No queue with the name "nonExistentQueue" was found.',
        );
    });

    it("should add a job to an existing queue", async () => {
        const queueName = "existingQueue";
        const jobName = "test-job";
        const jobData = { foo: "bar" };
        const { bullMQModule, infoLoggerMock } = BullMQTestHelper.createBullMQModuleInstance([queueName]);
        const job = await bullMQModule.addJob(queueName, jobName, jobData);

        expect(job).toBeDefined();
        expect(job.name).toBe(jobName);
        expect(job.data).toBe(jobData);
        expect(job.name).toBe(jobName);

        expect(infoLoggerMock).toHaveBeenCalledWith(
            {
                queue: queueName,
                job: jobName,
                id: job.id,
            },
            "Job created",
        );
    });
});
