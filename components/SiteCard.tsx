"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  siteId: string;
  businessName: string;
  industry: string;
  createdAt: string;
};

export function SiteCard({ siteId, businessName, industry, createdAt }: Props) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function copyLink() {
    const url = `${window.location.origin}/sites/${siteId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${businessName}"?\n\nThis will permanently remove the site and cannot be undone.`
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/sites/${siteId}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Failed to delete site. Please try again.");
        setDeleting(false);
      }
    } catch {
      alert("Network error. Please try again.");
      setDeleting(false);
    }
  }

  const dateStr = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className={`bg-[#111214] border border-white/[0.07] rounded-xl p-5 hover:border-white/20 transition-all group ${deleting ? "opacity-50 pointer-events-none" : ""}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1 pr-3">
          <h3 className="font-bold text-sm text-[#f0f0f0] truncate mb-1.5">
            {businessName}
          </h3>
          <span className="inline-block text-[10px] text-[#6b7280] bg-white/[0.03] px-2 py-0.5 rounded-full border border-white/[0.05]">
            {industry}
          </span>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-[#00e5a0] shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00e5a0] animate-pulse" />
          Live
        </span>
      </div>

      <p className="text-[11px] text-[#4b5563] mb-4">Created {dateStr}</p>

      {/* Primary actions */}
      <div className="flex flex-wrap gap-2 mb-2">
        <Link
          href={`/sites/${siteId}?edit=true`}
          className="text-xs font-bold bg-[#00e5a0] text-black px-3 py-1.5 rounded-lg hover:bg-[#00ffb2] transition-colors"
        >
          Edit Site ✏️
        </Link>
        <Link
          href={`/sites/${siteId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-[#6b7280] border border-white/[0.07] bg-white/[0.02] px-3 py-1.5 rounded-lg hover:text-white hover:border-white/20 transition-all"
        >
          View Site ↗
        </Link>
        <button
          onClick={copyLink}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
            copied
              ? "text-[#00e5a0] border-[#00e5a0]/30 bg-[#00e5a0]/5"
              : "text-[#6b7280] border-white/[0.07] bg-white/[0.02] hover:text-white hover:border-white/20"
          }`}
        >
          {copied ? "✓ Copied!" : "Copy Link"}
        </button>
        <Link
          href={`/dashboard/build?edit=${siteId}`}
          className="text-xs font-medium text-[#6b7280] border border-white/[0.07] bg-white/[0.02] px-3 py-1.5 rounded-lg hover:text-white hover:border-white/20 transition-all"
        >
          Regenerate
        </Link>
      </div>

      {/* Destructive action — separated visually */}
      <div className="border-t border-white/[0.05] pt-2 mt-1">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-xs font-medium text-red-500/60 hover:text-red-400 transition-colors py-1 disabled:opacity-40"
        >
          {deleting ? "Deleting…" : "🗑 Delete Site"}
        </button>
      </div>
    </div>
  );
}
