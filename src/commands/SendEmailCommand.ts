import { BaseCommand } from "@commands/BaseCommand";
import { appConfig } from "@config/app";
import AppContainer from "@config/container";
import type { SelectUser } from "@db/schemas/users";
import { EmailTemplateService } from "@services/EmailTemplateService";
import type { Address } from "nodemailer/lib/mailer";

/**
 * CLI Command to send emails to users.
 *
 * This command allows sending emails either immediately or by queueing
 * them as background jobs via BullMQ.
 */
export class SendEmailCommand extends BaseCommand {
    protected commandName = "user:email";
    protected commandDescription = "Sends an email using the given user ID and template.";
    protected commandArgument = "<userId>";
    protected argumentDescription = "The user ID to send an email to.";

    constructor() {
        super();
        this.configureCommand();
    }

    /**
     * Configures command arguments and options.
     *
     * - Adds a `<template>` argument for specifying email template names.
     * - Adds a `--job` flag to queue the email as a background job.
     */
    configureCommand(): void {
        super.configureCommand();
        this.argument(
            "<template>",
            `Template to use. Must be one of: ${appConfig.emailTemplate.templateNames.join(", ")}`,
        );
        this.option("-j, --job", "Use email job to queue the email send", false);
    }

    /**
     * Executes the command's main action.
     *
     * - If `--job` is specified, queues the email in BullMQ.
     * - Otherwise, sends the email immediately after fetching user details.
     *
     * @param userId - The ID of the user to send an email to.
     * @param templateName - The name of the email template.
     * @param options - Additional options (`job` flag).
     */
    public async handleAction(
        userId: number,
        templateName: string,
        options: { job: boolean; template?: string },
    ): Promise<void> {
        const spinner = this.getSpinner("Executing command...").start();
        try {
            EmailTemplateService.assertValidTemplateName(templateName);
            if (options.job) {
                // Queue email using BullMQ
                await AppContainer.resolve("UserMailJob").queue({
                    userId,
                    templateName,
                    templateVars: {},
                });
                spinner.succeed(this.writeSuccess(`Email job queued successfully for user ID ${userId}.`));
            } else {
                // Send email immediately
                const user = await this.getUserById(userId);
                if (!user) {
                    throw new Error(`No user with ID ${userId} was found.`);
                }
                await this.sendEmail(
                    templateName,
                    {
                        name: user.name,
                        address: user.email,
                    },
                    { user },
                );
                spinner.succeed(this.writeSuccess(`Email sent successfully to ${user.email}.`));
            }
        } catch (e) {
            const error = e as Error;
            spinner.fail(this.writeError("Command execution failed."));
            this.error(error.message);
        }
    }

    /**
     * Retrieves a user by ID from the database.
     *
     * @param id - The user ID to lookup.
     * @returns A promise resolving to the user object or `null` if not found.
     */
    public async getUserById(id: number): Promise<SelectUser | null> {
        return AppContainer.resolve("UsersModel").findById(id);
    }

    /**
     * Sends an email using the EmailTemplateService.
     *
     * @param template - The email template name.
     * @param to - Recipient email address (string or structured `Address`).
     * @param locals - Variables to be injected into the template.
     * @returns A promise resolving to the email send result.
     */
    public async sendEmail(template: string, to: string | Address, locals: Record<string, unknown>): Promise<unknown> {
        return AppContainer.resolve("EmailTemplateService").sendEmail(template, to, locals);
    }
}
