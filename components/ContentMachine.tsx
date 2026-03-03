"use client";

import { useState } from "react";
import Link from "next/link";
import type { ContentPackage, Post, BlogPost, CalendarEntry } from "@/app/api/content/generate/route";

// ── Constants ─────────────────────────────────────────────────────────────────
const INPUT_CLS =
  "bg-[#0d0e10] border border-white/[0.07] text-[#f0f0f0] placeholder-[#4b5563] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#8b5cf6]/50 transition-colors w-full";

const PLATFORM_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Instagram: { bg: "bg-pink-500/10",   text: "text-pink-400",   border: "border-pink-500/20"   },
  Facebook:  { bg: "bg-blue-500/10",   text: "text-blue-400",   border: "border-blue-500/20"   },
  TikTok:    { bg: "bg-white/[0.06]",  text: "text-white",      border: "border-white/[0.12]"  },
  LinkedIn:  { bg: "bg-sky-500/10",    text: "text-sky-400",    border: "border-sky-500/20"    },
  Default:   { bg: "bg-[#8b5cf6]/10",  text: "text-[#8b5cf6]",  border: "border-[#8b5cf6]/20"  },
};

const PLATFORM_ICONS: Record<string, string> = {
  Instagram: "📸", Facebook: "👤", TikTok: "🎵",
  LinkedIn: "💼", Default: "📱",
};

function platformStyle(p: string) {
  return PLATFORM_COLORS[p] ?? PLATFORM_COLORS.Default;
}
function platformIcon(p: string) {
  return PLATFORM_ICONS[p] ?? PLATFORM_ICONS.Default;
}

// ── Copy hook ─────────────────────────────────────────────────────────────────
function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  }
  return { copied, copy };
}

// ── Copy button ───────────────────────────────────────────────────────────────
function CopyBtn({
  text, label, copiedLabel = "✓ Copied!", id, copied, onCopy,
}: {
  text: string; label: string; copiedLabel?: string;
  id: string; copied: string | null; onCopy: (text: string, id: string) => void;
}) {
  const isDone = copied === id;
  return (
    <button
      onClick={() => onCopy(text, id)}
      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
        isDone
          ? "text-[#00e5a0] border-[#00e5a0]/30 bg-[#00e5a0]/5"
          : "text-[#8b5cf6] border-[#8b5cf6]/30 bg-[#8b5cf6]/5 hover:bg-[#8b5cf6]/10"
      }`}
    >
      {isDone ? copiedLabel : label}
    </button>
  );
}

// ── Posts tab ─────────────────────────────────────────────────────────────────
function PostCard({ post, index, copied, onCopy }: {
  post: Post; index: number;
  copied: string | null; onCopy: (text: string, id: string) => void;
}) {
  const style = platformStyle(post.platform);
  const icon  = platformIcon(post.platform);
  const fullText = `${post.content}\n\n${post.hashtags.map((h) => `#${h}`).join(" ")}`;

  return (
    <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-5 hover:border-white/[0.14] transition-all">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${style.bg} ${style.text} ${style.border}`}>
            {icon} {post.platform}
          </span>
          <span className="text-[10px] text-[#6b7280] bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded-full">
            {post.contentType}
          </span>
        </div>
        <span className="text-[11px] text-[#4b5563]">🕐 {post.bestTimeToPost}</span>
      </div>

      {/* Post content */}
      <div className="bg-[#0d0e10] border border-white/[0.05] rounded-xl p-4 mb-3">
        <p className="text-sm text-[#d1d5db] leading-relaxed whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Hashtags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {post.hashtags.map((tag, i) => (
          <button
            key={i}
            onClick={() => onCopy(`#${tag}`, `tag-${index}-${i}`)}
            className={`text-[11px] px-2 py-0.5 rounded-md border transition-all ${
              copied === `tag-${index}-${i}`
                ? "text-[#00e5a0] border-[#00e5a0]/30 bg-[#00e5a0]/5"
                : "text-[#4b5563] border-white/[0.06] bg-white/[0.02] hover:text-[#9ca3af] hover:border-white/[0.12]"
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        <CopyBtn text={fullText} label="Copy Post" id={`post-${index}`} copied={copied} onCopy={onCopy} />
        <CopyBtn
          text={post.hashtags.map((h) => `#${h}`).join(" ")}
          label="Copy Hashtags"
          id={`hash-${index}`}
          copied={copied}
          onCopy={onCopy}
        />
      </div>
    </div>
  );
}

function PostsTab({ posts }: { posts: Post[] }) {
  const { copied, copy } = useCopy();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {posts.map((post, i) => (
        <PostCard key={post.id} post={post} index={i} copied={copied} onCopy={copy} />
      ))}
    </div>
  );
}

// ── Blog post tab ─────────────────────────────────────────────────────────────
function BlogTab({ blog }: { blog: BlogPost }) {
  const { copied, copy } = useCopy();

  const fullBlog = [
    blog.title,
    "",
    blog.intro,
    "",
    ...blog.sections.flatMap((s) => [`## ${s.heading}`, "", s.body, ""]),
    blog.conclusion,
  ].join("\n");

  return (
    <div className="max-w-3xl">
      {/* Title */}
      <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-6 mb-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="text-xl font-extrabold text-[#f0f0f0] leading-tight" style={{ fontFamily: "Syne, sans-serif" }}>
            {blog.title}
          </h2>
          <CopyBtn text={fullBlog} label="Copy Full Post" id="blog-full" copied={copied} onCopy={copy} />
        </div>

        {/* Intro */}
        <p className="text-sm text-[#9ca3af] leading-relaxed mb-6 pb-6 border-b border-white/[0.06]">
          {blog.intro}
        </p>

        {/* Sections */}
        <div className="space-y-6">
          {blog.sections.map((section, i) => (
            <div key={i}>
              <h3 className="text-base font-bold text-[#f0f0f0] mb-2">{section.heading}</h3>
              <p className="text-sm text-[#9ca3af] leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>

        {/* Conclusion */}
        <div className="mt-6 pt-6 border-t border-white/[0.06]">
          <h3 className="text-base font-bold text-[#f0f0f0] mb-2">Conclusion</h3>
          <p className="text-sm text-[#9ca3af] leading-relaxed">{blog.conclusion}</p>
        </div>
      </div>

      {/* SEO keywords */}
      <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#6b7280]">SEO Keywords</p>
          <CopyBtn
            text={blog.seoKeywords.join(", ")}
            label="Copy Keywords"
            id="seo-kw"
            copied={copied}
            onCopy={copy}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {blog.seoKeywords.map((kw, i) => (
            <span key={i} className="text-xs text-[#8b5cf6] bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 px-2.5 py-1 rounded-full">
              {kw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Content calendar tab ──────────────────────────────────────────────────────
function CalendarTab({ calendar, posts }: { calendar: CalendarEntry[]; posts: Post[] }) {
  const { copied, copy } = useCopy();

  const postMap = Object.fromEntries(posts.map((p) => [p.id, p]));

  const plainCalendar = calendar
    .map((e) => `${e.day}: ${e.platform} — ${e.contentType} (Post #${e.postId})`)
    .join("\n");

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[#6b7280]">7-day posting schedule</p>
        <CopyBtn text={plainCalendar} label="Copy Calendar" id="cal" copied={copied} onCopy={copy} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {calendar.map((entry, i) => {
          const post  = postMap[entry.postId];
          const style = platformStyle(entry.platform);
          const icon  = platformIcon(entry.platform);
          return (
            <div key={i} className="bg-[#111214] border border-white/[0.07] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#f0f0f0]">{entry.day}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${style.bg} ${style.text} ${style.border}`}>
                  {icon} {entry.platform}
                </span>
              </div>
              <div className="text-xs text-[#6b7280] mb-2">{entry.contentType}</div>
              {post && (
                <p className="text-[11px] text-[#4b5563] leading-snug line-clamp-2">
                  {post.content.slice(0, 80)}…
                </p>
              )}
              {post && (
                <div className="mt-2 text-[10px] text-[#374151]">🕐 {post.bestTimeToPost}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-5">
        {["Instagram", "Facebook", "TikTok", "LinkedIn"].map((p) => {
          const s = platformStyle(p);
          return (
            <span key={p} className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border ${s.bg} ${s.text} ${s.border}`}>
              {platformIcon(p)} {p}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ── Locked state ──────────────────────────────────────────────────────────────
function LockedState() {
  return (
    <div className="flex-1 p-7">
      <div className="max-w-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">✍️</span>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
            Content Machine
          </h1>
        </div>
        <p className="text-gray-400 text-sm mb-8">
          Generate a full week of social posts, hashtags, a blog article, and a content calendar.
        </p>
        <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-10 text-center">
          <div className="text-5xl mb-5">🔒</div>
          <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
            Content Machine — Growth &amp; Pro Only
          </h2>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
            Upgrade to Growth or Pro to unlock Content Machine. Get 7 ready-to-post social
            captions, a full blog article, and a content calendar — all in one click.
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-[#00e5a0] text-black font-bold px-7 py-3 rounded-xl text-sm hover:bg-[#00ffb2] transition-all"
          >
            Upgrade to Growth →
          </Link>
          <p className="text-xs text-gray-600 mt-4">Growth plan starts at $79/mo · 7-day free trial</p>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function ContentMachine({ locked }: { locked: boolean }) {
  const [form, setForm] = useState({
    businessType:  "",
    targetAudience: "",
    platform:      "Instagram",
    tone:          "Friendly",
    contentGoal:   "Get more customers",
    specialOffer:  "",
  });
  const [content, setContent]   = useState<ContentPackage | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"posts" | "blog" | "calendar">("posts");

  if (locked) return <LockedState />;

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.businessType.trim()) { setError("Please enter your business type."); return; }
    if (!form.targetAudience.trim()) { setError("Please describe your target audience."); return; }
    setError(null);
    setLoading(true);
    setContent(null);

    try {
      const res  = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? data.error ?? "Generation failed");
      setContent(data.content);
      setActiveTab("posts");
      setTimeout(() => document.getElementById("content-results")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inputCls = INPUT_CLS;

  return (
    <div className="flex-1 p-7 max-w-5xl">
      {/* Page heading */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">✍️</span>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
          Content Machine
        </h1>
        <span className="text-xs font-bold bg-[#8b5cf6]/10 text-[#8b5cf6] border border-[#8b5cf6]/20 px-3 py-1 rounded-full">
          AI Agent
        </span>
      </div>
      <p className="text-gray-400 text-sm mb-7">
        Fill in your business details and get 7 platform-ready posts, a blog article, and a full content calendar instantly.
      </p>

      {/* ── Form ───────────────────────────────────────────────────────────── */}
      <form
        onSubmit={handleGenerate}
        className="bg-[#111214] border border-white/[0.07] rounded-2xl p-6 mb-8"
      >
        <h2 className="text-sm font-bold text-[#f0f0f0] mb-5" style={{ fontFamily: "Syne, sans-serif" }}>
          Content Brief
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Business Type */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
              Business Type <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.businessType}
              onChange={(e) => set("businessType", e.target.value)}
              placeholder="Landscaping company, Restaurant, etc."
              required
              className={inputCls}
            />
          </div>

          {/* Target Audience */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
              Target Audience <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.targetAudience}
              onChange={(e) => set("targetAudience", e.target.value)}
              placeholder="Homeowners in Rockford IL, Young professionals…"
              required
              className={inputCls}
            />
          </div>

          {/* Platform */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
              Platform
            </label>
            <select
              value={form.platform}
              onChange={(e) => set("platform", e.target.value)}
              className={`${inputCls} appearance-none cursor-pointer`}
            >
              {["Instagram", "Facebook", "TikTok", "LinkedIn", "All Platforms"].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Tone */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
              Tone
            </label>
            <select
              value={form.tone}
              onChange={(e) => set("tone", e.target.value)}
              className={`${inputCls} appearance-none cursor-pointer`}
            >
              {["Professional", "Friendly", "Funny", "Inspirational", "Bold"].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Content Goal */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
              Content Goal
            </label>
            <select
              value={form.contentGoal}
              onChange={(e) => set("contentGoal", e.target.value)}
              className={`${inputCls} appearance-none cursor-pointer`}
            >
              {[
                "Get more customers",
                "Build brand awareness",
                "Promote a special offer",
                "Share tips and education",
                "Show behind the scenes",
              ].map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Special Offer */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
              Special Offer / Topic{" "}
              <span className="normal-case font-normal text-[#4b5563]">(optional)</span>
            </label>
            <input
              type="text"
              value={form.specialOffer}
              onChange={(e) => set("specialOffer", e.target.value)}
              placeholder="20% off this week, Before/after transformations…"
              className={inputCls}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold py-3.5 rounded-xl text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Writing your content…
            </>
          ) : (
            "Generate Content →"
          )}
        </button>
      </form>

      {/* ── Results ─────────────────────────────────────────────────────────── */}
      {content && (
        <div id="content-results">
          {/* Tab bar */}
          <div className="flex items-center gap-1 bg-[#111214] border border-white/[0.07] rounded-xl p-1 mb-6 w-fit">
            {(["posts", "blog", "calendar"] as const).map((tab) => {
              const labels = { posts: `✍️ 7 Posts`, blog: "📝 Blog Post", calendar: "📅 Calendar" };
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === tab
                      ? "bg-[#8b5cf6] text-white shadow"
                      : "text-[#6b7280] hover:text-white"
                  }`}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          {activeTab === "posts"    && <PostsTab posts={content.posts} />}
          {activeTab === "blog"     && <BlogTab blog={content.blogPost} />}
          {activeTab === "calendar" && <CalendarTab calendar={content.contentCalendar} posts={content.posts} />}

          <p className="text-xs text-[#4b5563] mt-6 text-center">
            Content generated by AI · Review before publishing · Results cached for 24 hours.
          </p>
        </div>
      )}
    </div>
  );
}
