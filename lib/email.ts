import { Resend } from "resend";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://baileyagents.com";

/**
 * Always link verification emails to the canonical www.baileyagents.com host.
 * Some mail providers (Yahoo in particular) rewrite or block bare apex links
 * and Vercel preview URLs, so we force the public production hostname here
 * regardless of where the build is running.
 */
function verificationBaseUrl(): string {
  try {
    const u = new URL(BASE_URL);
    if (u.hostname === "baileyagents.com" || u.hostname === "www.baileyagents.com") {
      return "https://www.baileyagents.com";
    }
    // Vercel preview, localhost, etc. — fall through to canonical prod.
    if (u.hostname.endsWith(".vercel.app")) {
      return "https://www.baileyagents.com";
    }
    return BASE_URL.replace(/\/+$/, "");
  } catch {
    return "https://www.baileyagents.com";
  }
}

const emailWrap = (body: string) => `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #08090a; color: #f0f0f0; border-radius: 12px;">
  <div style="margin-bottom: 24px;">
    <span style="font-size: 20px; font-weight: 900; letter-spacing: -0.02em;">
      Bailey<span style="color: #00e5a0;">Agents</span>
    </span>
  </div>
  ${body}
  <hr style="border: none; border-top: 1px solid #1f2123; margin: 28px 0;" />
  <p style="color: #4b5563; font-size: 11px; margin: 0;">
    © ${new Date().getFullYear()} Bailey Agents · 
    <a href="${BASE_URL}" style="color: #4b5563;">baileyagents.com</a>
  </p>
</div>
`;

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const url = `${verificationBaseUrl()}/api/auth/verify-email?token=${token}`;
  await resend.emails.send({
    from: "Bailey Agents <noreply@baileyagents.com>",
    to: email,
    subject: "Verify your Bailey Agents account",
    html: emailWrap(`
      <h1 style="color: #00e5a0; font-size: 24px; margin: 0 0 12px;">Welcome to Bailey Agents! 🤖</h1>
      <p style="color: #d1d5db; line-height: 1.6; margin: 0 0 24px;">
        Click the button below to verify your email address and activate your account.
      </p>
      <a href="${url}" style="display: inline-block; background: #00e5a0; color: #000; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px; margin-bottom: 24px;">
        Verify My Email →
      </a>
      <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin: 0 0 8px;">
        Or copy and paste this link into your browser:
      </p>
      <p style="color: #d1d5db; font-size: 13px; line-height: 1.5; word-break: break-all; background: #111214; border: 1px solid #1f2123; border-radius: 6px; padding: 10px 12px; margin: 0 0 24px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;">
        ${url}
      </p>
      <p style="color: #6b7280; font-size: 12px; margin: 0;">
        This link expires in 24 hours. If you didn't sign up for Bailey Agents, you can safely ignore this email.
      </p>
    `),
    text: [
      "Welcome to Bailey Agents!",
      "",
      "Verify your email address and activate your account by opening the link below:",
      "",
      url,
      "",
      "If your email client blocks the link, copy and paste the full URL above into your browser's address bar.",
      "",
      "This link expires in 24 hours. If you didn't sign up for Bailey Agents, you can safely ignore this email.",
      "",
      "— Bailey Agents",
      "https://www.baileyagents.com",
    ].join("\n"),
  });
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const url = `${BASE_URL}/reset-password?token=${token}`;
  await resend.emails.send({
    from: "Bailey Agents <noreply@baileyagents.com>",
    to: email,
    subject: "Reset your Bailey Agents password",
    html: emailWrap(`
      <h1 style="color: #00e5a0; font-size: 24px; margin: 0 0 12px;">Reset Your Password</h1>
      <p style="color: #d1d5db; line-height: 1.6; margin: 0 0 24px;">
        Click the button below to set a new password. This link expires in 1 hour.
      </p>
      <a href="${url}" style="display: inline-block; background: #00e5a0; color: #000; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px; margin-bottom: 24px;">
        Reset Password →
      </a>
      <p style="color: #6b7280; font-size: 12px; margin: 0;">
        If you didn't request a password reset, you can safely ignore this email. Your password will not change.
      </p>
    `),
  });
}
