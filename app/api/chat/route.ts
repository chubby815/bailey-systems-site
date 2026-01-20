import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { chatSchema } from "@/utils/validations";
import { generateAssistantReply } from "@/lib/openai";

export async function POST(request: NextRequest) {
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

