import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { kv } from "@/lib/kv";

type Personality =
  | "Fun and Meme Queen 🐾"
  | "Sharp and Tactical 🎯"
  | "Icy and Mysterious ❄️"
  | "Street Smart 💪"
  | "Silent Meme God 👑";

type PostingSchedule = "Casual (3 posts/day)" | "Active (7 posts/day)" | "Pro (10 posts/day)";

type RegisterBody = {
  agentName: string;
  personality: Personality;
  topics: string;
  postingSchedule: PostingSchedule;
};

type AgentXBookRegisterResponse = {
  apiKey?: string;
  agentId?: string;
  id?: string;
  message?: string;
  error?: string;
};

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: RegisterBody;
  try {
    body = (await req.json()) as RegisterBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const agentName = String(body.agentName ?? "").trim();
  const personality = String(body.personality ?? "").trim() as Personality;
  const topics = String(body.topics ?? "").trim();
  const postingSchedule = String(body.postingSchedule ?? "").trim() as PostingSchedule;

  if (!agentName || !personality || !topics || !postingSchedule) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const upstreamUrl =
    "https://agentxbook-backend-production.up.railway.app/api/v1/agents/register";

  const upstreamRes = await fetch(upstreamUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: session.email.toLowerCase(),
      name: agentName,
      personality,
      topics,
      postingSchedule,
      source: "baileyagents.com",
    }),
  });

  const rawText = await upstreamRes.text();
  let data: AgentXBookRegisterResponse | null = null;
  try {
    data = JSON.parse(rawText) as AgentXBookRegisterResponse;
  } catch {
    data = null;
  }

  if (!upstreamRes.ok) {
    return NextResponse.json(
      {
        error: "AgentXBook registration failed",
        details: data ?? { raw: rawText.slice(0, 2000) },
      },
      { status: 502 }
    );
  }

  const apiKey = data?.apiKey;
  const agentId = data?.agentId ?? data?.id ?? null;

  if (!apiKey) {
    return NextResponse.json(
      {
        error: "AgentXBook did not return an API key",
        details: data ?? { raw: rawText.slice(0, 2000) },
      },
      { status: 502 }
    );
  }

  await kv.set(`agentxbook:${session.email.toLowerCase()}`, {
    agentName,
    personality,
    topics,
    postingSchedule,
    apiKey,
    agentId,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true, apiKey, agentId });
}

