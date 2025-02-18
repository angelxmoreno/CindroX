import { appConfig } from "@config/app";
import AppContainer from "@config/container";
import nodemailer from "nodemailer";
import type { Options } from "nodemailer/lib/mailer";

const logger = AppContainer.getLogger("Mailer");
const emailConfig = appConfig.mailer;
const transport = nodemailer.createTransport(emailConfig.url);

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
    try {
        const options: Options = {
            from: {
                name: emailConfig.fromName,
                address: emailConfig.fromEmail,
            },
            to,
            subject,
            text,
            html,
        };
        const info = await transport.sendMail(options);

        logger.info("📧 Email sent:", info.messageId);
        return info;
    } catch (error) {
        logger.error("❌ Email sending failed:", error);
        throw error;
    }
};
