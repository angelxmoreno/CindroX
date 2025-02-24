import { describe, expect, it, mock } from "bun:test";
import { UserMailJob, type UserMailJobData } from "@jobs/UserMailJob";
import { EmailTemplateService } from "@services/EmailTemplateService";
import { BullMQTestHelper } from "@test-helpers/BullMQTestHelper";
import { LoggerTestHelper } from "@test-helpers/LoggerTestHelper";
import { MockedUsersModel } from "@test-helpers/mocks/MockedUsersModel";
import type { Job } from "bullmq";
import type { Address } from "nodemailer/lib/mailer";

describe("UserMailJob", () => {
    const jobQueueName = "mailQueue";
    const jobWorkerName = "UserMailWorker";

    const { bullMQModule, addJobMocked } = BullMQTestHelper.createBullMQModuleInstance([jobQueueName]);
    const mockLoggerRegistry = LoggerTestHelper.createMockLoggerRegistry();
    const mockEmailTemplateService = Object.create(EmailTemplateService.prototype) as EmailTemplateService;
    mockEmailTemplateService.sendEmail = mock(
        async (template: string, to: string | Address, locals: Record<string, unknown>): Promise<unknown> => ({
            template,
            to,
            locals,
        }),
    );
    const jobInstance = new UserMailJob(bullMQModule, mockLoggerRegistry, mockEmailTemplateService, MockedUsersModel);

    const jobData: UserMailJobData = {
        userId: 1,
        templateName: "test-template",
        templateVars: {
            var1: "val1",
            var2: "val2",
        },
    };
    it("should queue a job successfully", async () => {
        const job = await jobInstance.queue(jobData);

        expect(addJobMocked).toHaveBeenCalledWith(jobQueueName, jobWorkerName, jobData);
        expect(job).toBeDefined();
        expect(job.id).toBe("mock-job-id");
        expect(job.queueName).toBe(jobQueueName);
        expect(job.name).toBe(jobWorkerName);
        expect(job.data).toStrictEqual(jobData);
    });

    it("should process job and log output", async () => {
        const mockJob = {
            id: "mock-job-id",
            data: {
                ...jobData,
            },
        } as Job<UserMailJobData>;
        const result = await jobInstance.worker(mockJob);
        const user = await MockedUsersModel.findById(mockJob.data.userId);
        expect(result).toEqual({
            to: {
                name: user?.name ?? "",
                address: user?.email ?? "",
            },
            templateName: jobData.templateName,
            templateVars: {
                ...jobData.templateVars,
                user,
            },
        });
    });

    it("should log an error if job data is missing", async () => {
        const mockJob = { id: "123", data: {} } as unknown as Job<UserMailJobData>;

        expect(jobInstance.worker(mockJob)).rejects.toThrowError("User ID is missing");
    });
});
