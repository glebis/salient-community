import { Resend } from "resend";

export type ConfirmationEmail = {
  to: string;
  confirmUrl: string;
};

const FOUNDER_NAME = "Gleb Kalinin";
const FOUNDER_LINKEDIN_URL = "https://www.linkedin.com/in/glebkalinin/";

export interface EmailSender {
  sendConfirmation(email: ConfirmationEmail): Promise<void>;
}

export class ResendEmailSender implements EmailSender {
  private resend: Resend;

  constructor(
    apiKey: string,
    private from: string,
  ) {
    this.resend = new Resend(apiKey);
  }

  async sendConfirmation(email: ConfirmationEmail): Promise<void> {
    const result = await this.resend.emails.send({
      from: this.from,
      to: email.to,
      subject: "Confirm your Salient waitlist spot",
      html: buildConfirmationEmailHtml(email.confirmUrl),
      text: buildConfirmationEmailText(email.confirmUrl),
    });

    if (result.error) {
      throw new Error(result.error.message);
    }
  }
}

export function buildConfirmationEmailText(confirmUrl: string): string {
  return [
    "Confirm your Salient waitlist spot",
    "",
    "Salient is a community at the intersection of philosophy, values, and an action-driven approach to technology — for people who are already building and want what they build to matter.",
    "",
    `Open this link to confirm your email: ${confirmUrl}`,
    "",
    "You are not on the waitlist until you confirm.",
    "",
    `Built by ${FOUNDER_NAME}: ${FOUNDER_LINKEDIN_URL}`,
  ].join("\n");
}

export function buildConfirmationEmailHtml(confirmUrl: string): string {
  const escapedConfirmUrl = escapeHtml(confirmUrl);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Confirm your Salient waitlist spot</title>
  </head>
  <body style="margin:0; padding:0; background:#0C1116; color:#F4F6F8; font-family:Arial, Helvetica, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%; background:#0C1116; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px; width:100%; background:#0F151C; border:1px solid #262D35; border-radius:8px; overflow:hidden;">
            <tr>
              <td style="padding:28px 28px 8px 28px;">
                <div style="color:#BC9AFA; font-family:'Courier New', Courier, monospace; font-size:12px; letter-spacing:0.08em; text-transform:uppercase;">Salient waitlist</div>
                <h1 style="margin:12px 0 0 0; color:#F4F6F8; font-size:28px; line-height:1.15; font-weight:700;">Confirm your email</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 28px 0 28px;">
                <p style="margin:0 0 16px 0; color:#aab3bd; font-size:16px; line-height:1.55;">Salient is a community at the intersection of philosophy, values, and an action-driven approach to technology &mdash; for people who are already building and want what they build to matter.</p>
                <p style="margin:0 0 24px 0; color:#aab3bd; font-size:16px; line-height:1.55;">Confirm this address to join the waitlist. We write rarely and only when it matters.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 28px 28px;">
                <a href="${escapedConfirmUrl}" style="display:inline-block; background:#BC9AFA; color:#0C1116; border-radius:6px; padding:14px 20px; font-size:16px; line-height:1; font-weight:700; text-decoration:none;">Confirm email</a>
                <p style="margin:18px 0 0 0; color:#7d8792; font-size:13px; line-height:1.45;">You are not on the waitlist until you confirm.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px 28px 28px; border-top:1px solid #262D35;">
                <p style="margin:0; color:#7d8792; font-size:13px; line-height:1.5;">Built by <a href="${FOUNDER_LINKEDIN_URL}" style="color:#BC9AFA; text-decoration:underline;">${FOUNDER_NAME}</a>.</p>
                <p style="margin:14px 0 0 0; color:#7d8792; font-size:12px; line-height:1.5;">If the button does not work, open this link:<br><a href="${escapedConfirmUrl}" style="color:#BC9AFA; word-break:break-all;">${escapedConfirmUrl}</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
