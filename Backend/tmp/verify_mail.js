import 'dotenv/config';
import { sendEmail } from '../src/services/mail.service.js';

async function testMail() {
    try {
        console.log("Testing email service...");
        const result = await sendEmail({
            to: process.env.GOOGLE_USER,
            subject: "Verification Test",
            html: "<b>If you receive this, the mail service is working!</b>",
            text: "Verification Test successful."
        });
        console.log("Test successful! Message ID:", result.messageId);
    } catch (error) {
        console.error("Test failed:", error.message);
        process.exit(1);
    }
}

testMail();
