import { LoggerRegistry } from "@config/modules/LoggerRegistry";
import type EmailTemplates from "email-templates";
import handlebars from "handlebars";
import layouts from "handlebars-layout";
import type { Address } from "nodemailer/lib/mailer";
import type { Logger } from "pino";
import { inject, injectable } from "tsyringe";

/**
 * EmailTemplateService handles the rendering and sending of email templates.
 */
@injectable()
export class EmailTemplateService {
    /**
     * Initializes the email template engine.
     *
     * @param logger
     * @param emailTemplates
     */
    constructor(
        @inject("EmailTemplates") private emailTemplates: EmailTemplates,
        @inject("Loggers") logger: LoggerRegistry | Logger,
    ) {
        if (logger instanceof LoggerRegistry) {
            this.logger = logger.getLogger("EmailTemplateService");
        } else {
            this.logger = logger;
        }
        layouts.register(handlebars);
    }

    private logger: Logger;

    /**
     * Sends an email using a pre-defined template.
     *
     * @param template - The email template name (e.g., "welcome").
     * @param to - The recipient's email address.
     * @param locals - The dynamic data to inject into the template.
     */
    async sendEmail(template: string, to: string | Address, locals: Record<string, unknown>): Promise<unknown> {
        const result = await this.emailTemplates.send({
            template,
            message: {
                to,
            },
            locals,
        });

        this.logger.debug(
            {
                template,
                to,
                locals,
            },
            "Sending email with params:",
        );

        return result;
    }
}
