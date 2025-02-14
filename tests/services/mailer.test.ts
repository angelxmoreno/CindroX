import "reflect-metadata";
import { describe, expect, it } from "bun:test";
import { sendEmail } from "@services/mailer";
import axios from "axios";

const getMailBySubject = async (subject: string) => {
    const response = await axios.get<Array<{ subject: string }>>("http://localhost:7080/api/messages");
    return response.data.find((email) => email.subject === subject);
};

describe("Mailer Service", () => {
    it("should send an email", async () => {
        const uuid = String(Date.now());
        const subject = `test - ${uuid}`;
        const testEmail = `test.${uuid}@example.com`;
        await sendEmail(testEmail, subject, "Hello!");
        const found = await getMailBySubject(subject);
        expect(found).toBeDefined();
    });
});
