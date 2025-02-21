import "reflect-metadata";
import { describe, expect, it } from "bun:test";
import { sendEmail } from "@services/mailer";
import { MailhogClient } from "mailhog-awesome";

describe("Mailer Service", () => {
    const mailhog = new MailhogClient({
        host: "mailhog",
        port: 8025,
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
