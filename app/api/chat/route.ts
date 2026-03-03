import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { chatSchema } from "@/utils/validations";
import { generateAssistantReply } from "@/lib/openai";
import { rateLimit } from "@/lib/ratelimit";

export async function POST(request: NextRequest) {
  // Rate limit: 20 requests per hour per IP (no auth on this route)
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const rl = await rateLimit(`chat-legacy:${ip}`, 20, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limit reached. Try again later." },
      { status: 429, headers: { "Retry-After": String(rl.resetInSeconds) } }
    );
  }

  try {
    const payload = chatSchema.parse(await request.json());
    const result = await generateAssistantReply(payload.messages);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid chat payload." },
        { status: 422 },
      );
    }
    return NextResponse.json(
      { error: "Unable to reach the assistant right now." },
      { status: 500 },
    );
  }
}

