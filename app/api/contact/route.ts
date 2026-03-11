import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message, businessEmail, businessName, siteId } = body as {
      name: string;
      email: string;
      message: string;
      businessEmail: string;
      businessName: string;
      siteId: string;
    };

    if (!name || !email || !message || !businessEmail) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Bailey Agents <noreply@baileyagents.com>",
      to: businessEmail,
      subject: `New message from your website`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #00e5a0; margin-bottom: 4px;">New Contact Form Submission</h2>
          <p style="color: #555; margin-top: 0;">Someone contacted you through your website!</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #00e5a0;">${email}</a></p>
          <p><strong>Message:</strong></p>
          <p style="background: #f5f5f5; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${message}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #999; font-size: 12px;">
            Sent via ${businessName || "your"} website powered by
            <a href="https://baileyagents.com" style="color: #00e5a0;">Bailey Agents</a>
            ${siteId ? `· Site ID: ${siteId}` : ""}
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/contact] Failed to send email:", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
