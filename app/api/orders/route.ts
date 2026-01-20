import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { orderSchema } from "@/utils/validations";
import { getUserSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = getUserSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = orderSchema.parse(await request.json());
    const trackingId = `ORD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    console.info("Order received", { session, payload, trackingId });
    return NextResponse.json({ success: true, trackingId });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Invalid order payload" }, { status: 422 });
    }
    return NextResponse.json(
      { error: "Unable to capture your order right now." },
      { status: 500 },
    );
  }
}

