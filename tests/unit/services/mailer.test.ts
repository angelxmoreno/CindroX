import "reflect-metadata";
import { afterEach, describe, expect, it } from "bun:test";
import { appConfig } from "@config/app";
import { sendEmail } from "@services/mailer";
import { MailhogClient } from "mailhog-awesome";

describe("Mailer Service", () => {
    const parts = new URL(appConfig.mailer.url);
    const mailhog = new MailhogClient({
        host: parts.hostname,
        port: 8025,
    });
    afterEach(async () => {
        await mailhog.deleteAllEmails();
    });
    it("should send an email", async () => {
        const uuid = String(Date.now());
        const subject = `test - ${uuid}`;
        const testEmail = `test.${uuid}@example.com`;
        const result = await sendEmail(testEmail, subject, "Hello!");
        const [email] = await mailhog.getEmails({
            subject,
        });
        expect(result).toBeDefined();
        expect(email).toBeDefined();
        expect(email.to).toBe(testEmail);
    });
});
