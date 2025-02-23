import { describe, expect, it, mock, spyOn } from "bun:test";
import { EmailTemplateService } from "@services/EmailTemplateService";
import { LoggerTestHelper } from "@test-helpers/LoggerTestHelper";
import EmailTemplates, { type EmailOptions } from "email-templates";
import type { Address } from "nodemailer/lib/mailer";

describe("EmailTemplateService", () => {
    // mock EmailTemplates
    const mockedEmailTemplates = new EmailTemplates();
    const emailTemplatesSendFn = mock(async (options?: EmailOptions) => options);

    spyOn(mockedEmailTemplates, "send").mockImplementation(emailTemplatesSendFn);

    // Mock Logger
    const { logger, debugLoggerMock } = LoggerTestHelper.createMockLogger();

    // Create instance of EmailTemplateService
    const emailService = new EmailTemplateService(mockedEmailTemplates, logger);
    const template = "test-template";
    const recipient: Address = {
        name: "John",
        address: "johndoe@example.com",
    };
    const locals = { name: "John Doe", customVar: "Hello World" };

    it("should instantiate correctly", () => {
        expect(emailService).toBeInstanceOf(EmailTemplateService);
    });

    it("should send an email with a string recipient", async () => {
        const stringRecipient = recipient.address;
        const result = await emailService.sendEmail(template, stringRecipient, locals);
        expect(result).toBeDefined();
        expect(emailTemplatesSendFn).toHaveBeenCalledWith({
            template,
            message: {
                to: stringRecipient,
            },
            locals,
        });

        expect(debugLoggerMock).toHaveBeenCalledWith(
            {
                template,
                to: stringRecipient,
                locals,
            },
            "Sending email with params:",
        );
    });

    it("should send an email with an Address recipient", async () => {
        const result = await emailService.sendEmail(template, recipient, locals);
        expect(result).toBeDefined();
        expect(emailTemplatesSendFn).toHaveBeenCalledWith({
            template,
            message: {
                to: recipient,
            },
            locals,
        });

        expect(debugLoggerMock).toHaveBeenCalledWith(
            {
                template,
                to: recipient,
                locals,
            },
            "Sending email with params:",
        );
    });

    it("should throw an error if email sending fails", async () => {
        const errorMessage = "SMTP error";
        emailTemplatesSendFn.mockRejectedValue(new Error(errorMessage));

        expect(emailService.sendEmail(template, "invalid@example.com", locals)).rejects.toThrow(errorMessage);
    });
});
