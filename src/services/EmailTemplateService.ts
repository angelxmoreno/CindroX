import { appConfig } from "@config/app";
import { LoggerRegistry } from "@config/modules/LoggerRegistry";
import type EmailTemplates from "email-templates";
import handlebars from "handlebars";
import layouts from "handlebars-layout";
import type { Address } from "nodemailer/lib/mailer";
import type { Logger } from "pino";
import { inject, injectable } from "tsyringe";

// Ensure `handlebars-layout` is registered once at module level
layouts.register(handlebars);

/**
 * **EmailTemplateService** handles the rendering and sending of email templates.
 *
 * - Uses `email-templates` for rendering.
 * - Integrates with `nodemailer` for email sending.
 * - Provides static validation methods for template names.
 */
@injectable()
export class EmailTemplateService {
    private logger: Logger;

    /**
     * Initializes the email template engine.
     *
     * @param emailTemplates - The email template rendering engine instance.
     * @param logger - Logger instance or registry.
     */
    constructor(
        @inject("EmailTemplates") private emailTemplates: EmailTemplates,
        @inject("Loggers") logger: LoggerRegistry | Logger,
    ) {
        // Ensure correct logger assignment
        this.logger = logger instanceof LoggerRegistry ? logger.getLogger("EmailTemplateService") : logger;
    }

    /**
     * Sends an email using a pre-defined template.
     *
     * @param template - The email template name (e.g., "welcome").
     * @param to - The recipient's email address or name/email object.
     * @param locals - The dynamic data injected into the template.
     * @returns The result of the email send operation.
     */
    async sendEmail(template: string, to: string | Address, locals: Record<string, unknown>): Promise<unknown> {
        const result = await this.emailTemplates.send({
            template,
            message: { to },
            locals,
        });

        this.logger.debug({ template, to, locals }, "Sending email with params:");

        return result;
    }

    /**
     * **Checks if the provided template name is valid.**
     *
     * @param name - The template name to validate.
     * @returns `true` if the template name is valid, otherwise `false`.
     */
    static isValidTemplateName(name: string): boolean {
        return appConfig.emailTemplate.templateNames.includes(name);
    }

    /**
     * **Throws an error if the provided template name is invalid.**
     *
     * @param name - The template name to validate.
     * @throws Error if the template name is not valid.
     */
    static assertValidTemplateName(name: string): void {
        if (!EmailTemplateService.isValidTemplateName(name)) {
            // ✅ Fixed static reference
            throw new Error(
                `"${name}" is not a valid template name. Available templates: "${appConfig.emailTemplate.templateNames.join('", "')}"`,
            );
        }
    }
}
