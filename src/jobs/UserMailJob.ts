import assert from "node:assert";
import type { BullMQModule } from "@config/modules/BullMQModule";
import type { LoggerRegistry } from "@config/modules/LoggerRegistry";
import type { UsersModel } from "@db/models/UsersModel";
import { BaseJob } from "@jobs/BaseJob";
import type { EmailTemplateService } from "@services/EmailTemplateService";
import type { Job } from "bullmq";
import type { Address } from "nodemailer/lib/mailer";
import { inject, injectable } from "tsyringe";

/**
 * Defines the structure of data this job processes.
 */
export type UserMailJobData = {
    userId: number; // User ID to fetch recipient details
    templateName: string; // Email template to use
    templateVars: Record<string, unknown>; // Dynamic variables for the template
};

/**
 * Defines the structure of data returned by the worker.
 */
export type UserMailWorkerReturn = {
    to: Address; // Email recipient details
    templateName: string; // Used email template
    templateVars: Record<string, unknown>; // Injected template variables
};

/**
 * Job responsible for sending user emails based on templates.
 * - Retrieves the recipient's email from `UsersModel`
 * - Uses `EmailTemplateService` to render and send the email
 * - Logs success and failure cases
 */
@injectable()
export class UserMailJob extends BaseJob<UserMailJobData> {
    /** Name of the queue where jobs are processed */
    protected queueName = "mailQueue";

    /** Name of the worker processing this job */
    protected jobName = "UserMailWorker";

    /** Email template service for rendering and sending emails */
    protected emailService: EmailTemplateService;

    /** Users model for fetching recipient data */
    protected usersModel: UsersModel;

    /**
     * Constructs the job with injected dependencies.
     *
     * @param bullMQ - The BullMQ module instance.
     * @param loggerRegistry - The logger registry instance.
     * @param emailService - The email template service instance.
     * @param usersModel - The user model instance for fetching recipient data.
     */
    constructor(
        @inject("BullMQ") bullMQ: BullMQModule,
        @inject("Loggers") loggerRegistry: LoggerRegistry,
        @inject("EmailTemplateService") emailService: EmailTemplateService,
        @inject("UsersModel") usersModel: UsersModel,
    ) {
        super(bullMQ, loggerRegistry);
        this.emailService = emailService;
        this.usersModel = usersModel;
    }

    /**
     * Processes an email job, retrieves recipient data, and sends an email.
     *
     * @param job - The job instance containing user and template details.
     * @returns A promise resolving to job processing metadata.
     * @throws If the user ID is missing or user not found.
     */
    async worker(job: Job<UserMailJobData>): Promise<UserMailWorkerReturn> {
        try {
            const { userId, templateName, templateVars } = job.data;

            // Ensure userId is valid
            assert(userId, "User ID is missing");

            // Fetch user details from the database
            const user = await this.usersModel.findById(userId);
            assert(user, `User not found with id ${userId}`);

            // Format recipient details
            const to: Address = {
                name: user.name,
                address: user.email,
            };
            const vars = {
                ...templateVars,
                user,
            };
            // Send email using template
            await this.emailService.sendEmail(templateName, to, vars);

            // Log success
            this.logger.info(`📧 Email sent to ${to.address} using template "${templateName}"`);

            // Return job metadata
            return { to, templateName, templateVars: vars };
        } catch (error) {
            // Log failure
            this.logger.error({ jobId: job.id, error }, "❌ UserMailJob failed");
            throw error;
        }
    }

    /**
     * Helper method for
     * @param userId
     */
    queueNewUser(userId: number) {
        return this.queue({
            userId,
            templateName: "new-user",
            templateVars: {},
        });
    }
}
