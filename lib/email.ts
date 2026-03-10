import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactEmailPayload {
    name: string;
    email: string;
    message: string;
    to: string;
}

export async function sendContactEmail({ name, email, message, to }: ContactEmailPayload) {
    const { data, error } = await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [to],
        replyTo: email,
        subject: `[Portfolio] Message from ${name}`,
        html: `
      <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0f172a; color: #f1f5f9; border-radius: 12px;">
        <h2 style="color: #64ffda; margin-top: 0;">New Contact Message</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; width: 80px; font-size: 14px;">From</td>
            <td style="padding: 8px 0; font-weight: 600;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">Email</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #64ffda;">${email}</a></td>
          </tr>
        </table>
        <div style="background: #1e293b; padding: 16px; border-radius: 8px; border-left: 4px solid #64ffda;">
          <p style="margin: 0; line-height: 1.7; white-space: pre-wrap;">${message}</p>
        </div>
        <p style="font-size: 12px; color: #475569; margin-top: 24px; text-align: center;">
          Sent from your portfolio contact form at ${new Date().toISOString()}
        </p>
      </div>
    `,
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}
