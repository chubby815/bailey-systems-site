"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const PERSONALITIES = [
  "Fun and Meme Queen 🐾",
  "Sharp and Tactical 🎯",
  "Icy and Mysterious ❄️",
  "Street Smart 💪",
  "Silent Meme God 👑",
] as const;

const SCHEDULES = [
  "Casual (3 posts/day)",
  "Active (7 posts/day)",
  "Pro (10 posts/day)",
] as const;

type PostingSchedule = (typeof SCHEDULES)[number];

export type AgentXBookSavedRecord = {
  agentName: string;
  personality: string;
  topics: string;
  postingSchedule: string;
  apiKey?: string;
  agentId?: string | null;
  createdAt?: string;
};

type Props = {
  email: string;
  savedAgent: AgentXBookSavedRecord | null;
};

export default function AgentXBookForm({ email, savedAgent }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(() => !savedAgent);

  const [agentName, setAgentName] = useState("");
  const [personality, setPersonality] = useState<string>(PERSONALITIES[0]);
  const [topics, setTopics] = useState("");
  const [postingSchedule, setPostingSchedule] = useState<PostingSchedule>(SCHEDULES[0]);

  const [submitting, setSubmitting] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!savedAgent || !editing) return;
    setAgentName(savedAgent.agentName ?? "");
    setPersonality(savedAgent.personality?.trim() || PERSONALITIES[0]);
    setTopics(savedAgent.topics ?? "");
    const sch = savedAgent.postingSchedule?.trim() || SCHEDULES[0];
    setPostingSchedule(SCHEDULES.includes(sch as PostingSchedule) ? (sch as PostingSchedule) : SCHEDULES[0]);
  }, [savedAgent, editing]);

  const personalitySelectOptions = useMemo(() => {
    const opts = [...PERSONALITIES];
    if (personality && !opts.includes(personality as (typeof PERSONALITIES)[number])) {
      opts.push(personality as (typeof PERSONALITIES)[number]);
    }
    return opts;
  }, [personality]);

  const canSubmit = useMemo(() => {
    return agentName.trim().length > 1 && topics.trim().length > 3;
  }, [agentName, topics]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    setApiKey(null);
    setAgentId(null);

    const res = await fetch("/api/agentxbook/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agentName: agentName.trim(),
        personality,
        topics: topics.trim(),
        postingSchedule,
      }),
    });

    const data = (await res.json()) as {
      success?: boolean;
      apiKey?: string;
      agentId?: string | null;
      error?: string;
      details?: unknown;
    };

    setSubmitting(false);

    if (!res.ok || !data.apiKey) {
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    setApiKey(data.apiKey);
    setAgentId(data.agentId ?? null);
  }

  function copyKey() {
    if (!apiKey) return;
    void navigator.clipboard.writeText(apiKey);
  }

  function handleDoneAfterKey() {
    setApiKey(null);
    setAgentId(null);
    setEditing(false);
    router.refresh();
  }

  const showSummary = savedAgent && !editing && !apiKey;

  return (
    <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-6">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="text-sm font-bold" style={{ fontFamily: "Syne, sans-serif" }}>
            {showSummary ? "Your AgentXBook agent" : "Create your AgentXBook agent"}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Registered to <span className="text-gray-300">{email}</span>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full border border-[#00e5a0]/25 bg-[#00e5a0]/10 text-[#00e5a0]">
          AgentXBook
        </span>
      </div>

      {showSummary && (
        <div className="space-y-4">
          <dl className="grid gap-3 text-sm">
            <div>
              <dt className="text-xs text-gray-500 mb-0.5">Agent name</dt>
              <dd className="text-white font-medium">{savedAgent.agentName}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500 mb-0.5">Personality</dt>
              <dd className="text-white">{savedAgent.personality}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500 mb-0.5">Topics</dt>
              <dd className="text-gray-300 whitespace-pre-wrap">{savedAgent.topics}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500 mb-0.5">Schedule</dt>
              <dd className="text-white">{savedAgent.postingSchedule}</dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setEditing(true);
            }}
            className="bg-[#00e5a0] text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#00ffb2] transition-all"
          >
            Edit
          </button>
          <p className="text-xs text-gray-500">
            Add your API key under Dashboard → Connections → AgentXBook to use workflows.
          </p>
        </div>
      )}

      {apiKey ? (
        <div className="bg-[#0d0e10] border border-[#00e5a0]/25 rounded-2xl p-5">
          <div className="text-sm font-bold text-[#00e5a0] mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
            Your AgentXBook API key
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Save this somewhere safe. This is the only time you will see it.
          </p>
          <div className="flex gap-2 items-center">
            <input
              value={apiKey}
              readOnly
              className="flex-1 bg-[#08090a] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white outline-none font-mono"
            />
            <button
              type="button"
              onClick={copyKey}
              className="bg-[#00e5a0] text-black font-bold px-4 py-2 rounded-lg text-xs hover:bg-[#00ffb2] transition-colors"
            >
              Copy
            </button>
          </div>
          {agentId && (
            <div className="text-xs text-gray-500 mt-3">
              Agent ID: <span className="text-gray-300 font-mono">{agentId}</span>
            </div>
          )}
          <button
            type="button"
            onClick={handleDoneAfterKey}
            className="mt-4 w-full border border-white/[0.12] text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-white/[0.05] transition-colors"
          >
            Back to agent settings
          </button>
        </div>
      ) : null}

      {!showSummary && !apiKey ? (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Agent name</label>
            <input
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="e.g. Bailey Leads Bot"
              className="w-full bg-[#0d0e10] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#00e5a0]"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Personality</label>
            <select
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              className="w-full bg-[#0d0e10] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#00e5a0]"
            >
              {personalitySelectOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Topics to post about</label>
            <textarea
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              placeholder="AI automation for small businesses, lead generation, local marketing, workflows, websites…"
              rows={3}
              className="w-full bg-[#0d0e10] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#00e5a0] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Posting schedule</label>
            <select
              value={postingSchedule}
              onChange={(e) => setPostingSchedule(e.target.value as PostingSchedule)}
              className="w-full bg-[#0d0e10] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#00e5a0]"
            >
              {SCHEDULES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {error && <div className="text-xs text-red-400">{error}</div>}

          <div className="flex flex-wrap gap-2">
            {savedAgent ? (
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setEditing(false);
                }}
                className="border border-white/[0.12] text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-white/[0.05] transition-all"
              >
                Cancel
              </button>
            ) : null}
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="bg-[#00e5a0] text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#00ffb2] transition-all disabled:opacity-50 disabled:hover:bg-[#00e5a0]"
            >
              {submitting ? "Saving…" : savedAgent ? "Update agent" : "Create Agent"}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
