import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactEmailPayload {
    name: string;
    email: string;
    message: string;
    to: string;
}

export async function sendContactEmail({ name, email, message, to }: ContactEmailPayload) {
    // NOTE: With Resend's free plan using onboarding@resend.dev as sender,
    // you can ONLY send to your own verified email address.
    // To send to any address, verify a custom domain at resend.com/domains.
    const { data, error } = await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [to],           // Must be your verified email on Resend free plan
        replyTo: email,     // Visitor's email — use Reply in your inbox to respond
        subject: `[Portfolio] Nouveau message de ${name}`,
        html: `
      <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0f172a; color: #f1f5f9; border-radius: 12px;">
        <h2 style="color: #64ffda; margin-top: 0;">📬 Nouveau message de contact</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; width: 80px; font-size: 14px;">De</td>
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
          Envoyé depuis le formulaire du portfolio le ${new Date().toLocaleString("fr-FR")}
        </p>
        <p style="font-size: 11px; color: #334155; text-align: center; margin-top: 8px;">
          💡 Pour répondre, utilisez le bouton "Répondre" — l'email du visiteur est en Reply-To.
        </p>
      </div>
    `,
    });

    if (error) {
        // Surface a clear message for the most common Resend free plan error
        if (error.message?.includes("not verified") || error.message?.includes("domain")) {
            throw new Error(
                `Resend domain error: the recipient address "${to}" is not your verified Resend email, ` +
                `or the sender domain is not verified. On the free plan, you can only send to your own verified address. ` +
                `Fix: set CONTACT_RECIPIENT_EMAIL to your verified Resend email, or verify a custom domain at resend.com/domains.`
            );
        }
        throw new Error(error.message);
    }

    return data;
}
