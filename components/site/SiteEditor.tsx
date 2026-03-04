"use client";

import { useState, useEffect, useRef, useCallback, useTransition } from "react";
import Link from "next/link";
import type { SiteRecord } from "@/lib/kv";
import type { StructuredSiteContent, ThemeConfig } from "@/lib/site-theme";
import { PRESET_THEMES } from "@/lib/site-theme";
import { LayoutRenderer }   from "./LayoutRenderer";
import { TemplateRenderer } from "./TemplateRenderer";

// ── Types ─────────────────────────────────────────────────────────────────────
type Panel = "themes" | "content" | null;

type ContentSection = "style" | "hero" | "services" | "about" | "testimonials" | "cta";

type Props = {
  site:                SiteRecord;
  content:             StructuredSiteContent;
  theme:               ThemeConfig;
  isOwner:             boolean;
  /** True only when the URL contains ?edit=true. Controls editor chrome visibility. */
  editMode:            boolean;
  siteId:              string;
  initialHeroImageUrl?: string;
};

// ── Shared input style ────────────────────────────────────────────────────────
const INPUT = "w-full bg-[#0d0e10] border border-white/[0.08] text-[#f0f0f0] placeholder-[#4b5563] rounded-lg px-3 py-2 text-xs outline-none focus:border-white/20 transition-colors resize-none";
const LABEL = "block text-[10px] font-semibold uppercase tracking-widest text-[#6b7280] mb-1";

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({
  label, expanded, onToggle,
}: { label: string; expanded: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.03] transition-colors text-left"
    >
      <span className="text-sm font-semibold text-[#f0f0f0]">{label}</span>
      <span className="text-[#6b7280] text-xs">{expanded ? "▲" : "▼"}</span>
    </button>
  );
}

// ── Theme Panel ───────────────────────────────────────────────────────────────
function MiniSitePreview({ colors }: { colors: { primary: string; background: string; surface: string; text: string; accent: string } }) {
  return (
    <div style={{ background: colors.background, borderRadius: 6, overflow: "hidden", width: "100%", userSelect: "none" }}>
      {/* Navbar */}
      <div style={{ background: colors.surface, height: 16, display: "flex", alignItems: "center", padding: "0 7px", gap: 5, borderBottom: `1.5px solid ${colors.primary}22` }}>
        <div style={{ width: 22, height: 3, background: colors.text, borderRadius: 1, opacity: 0.75 }} />
        <div style={{ flex: 1 }} />
        <div style={{ width: 18, height: 7, background: colors.primary, borderRadius: 2 }} />
      </div>
      {/* Hero */}
      <div style={{ padding: "9px 7px 7px", background: colors.background }}>
        <div style={{ width: "62%", height: 4, background: colors.text, borderRadius: 1, opacity: 0.85, marginBottom: 4 }} />
        <div style={{ width: "78%", height: 3, background: colors.text, borderRadius: 1, opacity: 0.35, marginBottom: 7 }} />
        <div style={{ width: 30, height: 8, background: colors.primary, borderRadius: 3 }} />
      </div>
      {/* Services row */}
      <div style={{ display: "flex", gap: 3, padding: "0 7px 7px" }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{ flex: 1, height: 13, background: colors.surface, borderRadius: 3, borderTop: `2px solid ${colors.accent}` }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Template definitions for the picker ──────────────────────────────────────
const TEMPLATE_DEFS: { key: string; name: string; desc: string; preview: React.ReactNode }[] = [
  {
    key: "darkpremium",
    name: "Dark Premium",
    desc: "Dark background, emerald green — sleek modern SaaS look",
    preview: (
      <div style={{ background: "#08090a", borderRadius: 6, overflow: "hidden", userSelect: "none" }}>
        <div style={{ background: "#111214", height: 14, display: "flex", alignItems: "center", padding: "0 7px", gap: 5, borderBottom: "1.5px solid #00e5a022" }}>
          <div style={{ width: 22, height: 3, background: "#f0f0f0", borderRadius: 1, opacity: 0.7 }} />
          <div style={{ flex: 1 }} />
          <div style={{ width: 18, height: 7, background: "#00e5a0", borderRadius: 2 }} />
        </div>
        <div style={{ padding: "9px 7px 7px", background: "linear-gradient(135deg, #10b981 0%, #064e3b 100%)" }}>
          <div style={{ width: "62%", height: 4, background: "#fff", borderRadius: 1, opacity: 0.9, marginBottom: 4 }} />
          <div style={{ width: "78%", height: 3, background: "#fff", borderRadius: 1, opacity: 0.5, marginBottom: 7 }} />
          <div style={{ width: 30, height: 8, background: "#00e5a0", borderRadius: 3 }} />
        </div>
        <div style={{ display: "flex", gap: 3, padding: "0 7px 7px" }}>
          {[0,1,2].map(i => <div key={i} style={{ flex: 1, height: 13, background: "#111214", borderRadius: 3, borderTop: "2px solid #00e5a044" }} />)}
        </div>
      </div>
    ),
  },
  {
    key: "neobrutalism",
    name: "Neo Brutalism",
    desc: "Thick black borders, offset shadows, cream + yellow — poster aesthetic",
    preview: (
      <div style={{ background: "#fffef7", borderRadius: 6, overflow: "hidden", border: "2px solid #000", userSelect: "none" }}>
        <div style={{ background: "#000", height: 14, display: "flex", alignItems: "center", padding: "0 7px", gap: 5 }}>
          <div style={{ width: 22, height: 3, background: "#FFE500", borderRadius: 1 }} />
          <div style={{ flex: 1 }} />
          <div style={{ width: 18, height: 7, background: "#FFE500", border: "1px solid #FFE500" }} />
        </div>
        <div style={{ padding: "8px 7px 6px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, background: "#fffef7" }}>
          <div>
            <div style={{ width: "80%", height: 4, background: "#000", marginBottom: 3 }} />
            <div style={{ width: "90%", height: 3, background: "#333", opacity: 0.5, marginBottom: 6 }} />
            <div style={{ width: 28, height: 8, background: "#000", border: "2px solid #000", boxShadow: "2px 2px 0 #000" }} />
          </div>
          <div style={{ background: "#eee", border: "2px solid #000", height: "100%" }} />
        </div>
        <div style={{ display: "flex", gap: 3, padding: "0 6px 6px" }}>
          {[0,1,2].map(i => <div key={i} style={{ flex: 1, height: 12, background: i%2===0 ? "#fffef7" : "#FFE500", border: "2px solid #000", boxShadow: "2px 2px 0 #000" }} />)}
        </div>
      </div>
    ),
  },
  {
    key: "minimal",
    name: "Modern Minimal",
    desc: "Pure white, airy whitespace, thin type — Apple / Linear feel",
    preview: (
      <div style={{ background: "#ffffff", borderRadius: 6, overflow: "hidden", border: "1px solid #e8e8e8", userSelect: "none" }}>
        <div style={{ background: "rgba(255,255,255,0.95)", height: 14, display: "flex", alignItems: "center", padding: "0 7px", gap: 5, borderBottom: "1px solid #e8e8e8" }}>
          <div style={{ width: 20, height: 3, background: "#111", borderRadius: 1, opacity: 0.7 }} />
          <div style={{ flex: 1 }} />
          <div style={{ width: 16, height: 7, background: "#0066ff", borderRadius: 3 }} />
        </div>
        <div style={{ padding: "10px 7px 6px", textAlign: "center", background: "#fff" }}>
          <div style={{ width: "50%", height: 4, background: "#111", borderRadius: 1, margin: "0 auto 3px", opacity: 0.8 }} />
          <div style={{ width: "70%", height: 2.5, background: "#888", borderRadius: 1, margin: "0 auto 6px", opacity: 0.5 }} />
          <div style={{ width: 24, height: 8, background: "#0066ff", borderRadius: 4, margin: "0 auto" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "#e8e8e8", padding: "0 0 0" }}>
          {[0,1,2].map(i => <div key={i} style={{ background: "#fff", height: 13, padding: "2px 4px" }}>
            <div style={{ width: "60%", height: 2, background: "#111", marginBottom: 2, opacity: 0.6 }} />
            <div style={{ width: "80%", height: 1.5, background: "#888", opacity: 0.4 }} />
          </div>)}
        </div>
      </div>
    ),
  },
  {
    key: "magazine",
    name: "Bold Magazine",
    desc: "Editorial serif + sans, section numbers, full-bleed hero — luxury feel",
    preview: (
      <div style={{ background: "#fafaf8", borderRadius: 6, overflow: "hidden", border: "1px solid #e0ddd8", userSelect: "none" }}>
        <div style={{ background: "#fafaf8", height: 14, display: "flex", alignItems: "center", padding: "0 7px", gap: 5, borderBottom: "1px solid #e0ddd8" }}>
          <div style={{ width: 22, height: 3.5, background: "#1a1a1a", borderRadius: 1, fontStyle: "italic", opacity: 0.75 }} />
          <div style={{ flex: 1 }} />
          <div style={{ width: 16, height: 7, background: "transparent", border: "1px solid #10b981" }} />
        </div>
        <div style={{ height: 38, background: "#333", display: "flex", alignItems: "flex-end", padding: "0 7px 5px", position: "relative" }}>
          <div style={{ width: "70%", height: 4.5, background: "#fff", borderRadius: 1, opacity: 0.9 }} />
        </div>
        <div style={{ padding: "5px 7px 6px", background: "#fafaf8", borderTop: "1px solid #e0ddd8" }}>
          <div style={{ display: "flex", gap: 3 }}>
            <div style={{ width: 10, height: 10, color: "transparent", WebkitTextStroke: "1px #1a1a1a", fontFamily: "serif", fontSize: 9, opacity: 0.3, lineHeight: "10px", textAlign: "center" }}>0</div>
            <div style={{ flex: 1 }}>
              <div style={{ width: "50%", height: 2.5, background: "#1a1a1a", marginBottom: 2, opacity: 0.7 }} />
              <div style={{ width: "80%", height: 2, background: "#888", opacity: 0.4 }} />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    key: "classic",
    name: "Classic Business",
    desc: "Navy header, gold accents, 3-col grid — trusted traditional look",
    preview: (
      <div style={{ background: "#f7f8fa", borderRadius: 6, overflow: "hidden", border: "1px solid #e0e6ef", userSelect: "none" }}>
        <div style={{ background: "#1e3a5f", height: 14, display: "flex", alignItems: "center", padding: "0 7px", gap: 5, borderBottom: "3px solid #c9a84c" }}>
          <div style={{ width: 22, height: 3, background: "#fff", borderRadius: 1, opacity: 0.8 }} />
          <div style={{ flex: 1 }} />
          <div style={{ width: 18, height: 7, background: "#c9a84c", borderRadius: 2 }} />
        </div>
        <div style={{ padding: "8px 7px 6px", background: "#1e3a5f", textAlign: "center" }}>
          <div style={{ width: "55%", height: 4, background: "#fff", borderRadius: 1, margin: "0 auto 3px", opacity: 0.9 }} />
          <div style={{ width: "72%", height: 3, background: "#caf0f8", borderRadius: 1, margin: "0 auto 6px", opacity: 0.5 }} />
          <div style={{ width: 28, height: 8, background: "#c9a84c", borderRadius: 2, margin: "0 auto" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3, padding: "5px 6px 6px", background: "#f7f8fa" }}>
          {[0,1,2].map(i => <div key={i} style={{ background: "#fff", border: "1px solid #e0e6ef", borderTop: "3px solid #c9a84c", height: 16, padding: "2px 3px" }}>
            <div style={{ width: "60%", height: 2, background: "#1e3a5f", marginBottom: 2, opacity: 0.7 }} />
            <div style={{ width: "80%", height: 1.5, background: "#888", opacity: 0.4 }} />
          </div>)}
        </div>
      </div>
    ),
  },
];

function ThemesPanel({
  currentThemeKey,
  onSelectTheme,
  currentTemplate,
  onSelectTemplate,
  siteId,
  currentHeroImageUrl,
  industry,
  onHeroImageChange,
}: {
  currentThemeKey:     string;
  onSelectTheme:       (key: string, theme: ThemeConfig) => void;
  currentTemplate:     string;
  onSelectTemplate:    (key: string) => void;
  siteId:              string;
  currentHeroImageUrl: string | null;
  industry:            string;
  onHeroImageChange:   (url: string | null) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be under 5 MB");
      return;
    }
    setUploadError(null);
    setUploading(true);

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      try {
        const res = await fetch(`/api/sites/${siteId}/image`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: dataUrl }),
        });
        if (!res.ok) { setUploadError("Upload failed"); return; }
        onHeroImageChange(`/api/sites/${siteId}/image?t=${Date.now()}`);
      } catch {
        setUploadError("Upload failed");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleRemoveImage() {
    await fetch(`/api/sites/${siteId}/image`, { method: "DELETE" });
    onHeroImageChange(null);
  }

  return (
    <div className="p-4 space-y-6">
      {/* ── Layout Template picker ──────────────────────────────────────────── */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#6b7280] mb-3">
          Layout Style
        </p>
        <div className="flex flex-col gap-2">
          {TEMPLATE_DEFS.map((t) => {
            const active = currentTemplate === t.key;
            return (
              <div
                key={t.key}
                onClick={() => onSelectTemplate(t.key)}
                className={`flex gap-3 items-center p-2.5 rounded-xl border cursor-pointer transition-all ${
                  active
                    ? "border-[#00e5a0] bg-[#00e5a0]/5"
                    : "border-white/[0.07] bg-white/[0.02] hover:border-white/20"
                }`}
              >
                {/* Mini preview */}
                <div style={{ width: 88, flexShrink: 0 }}>
                  {t.preview}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`text-[11px] font-bold ${active ? "text-[#00e5a0]" : "text-[#f0f0f0]"}`}>{t.name}</span>
                    {active && <span className="text-[9px] text-[#00e5a0] bg-[#00e5a0]/10 px-1.5 py-0.5 rounded-full font-bold">Active</span>}
                  </div>
                  <p className="text-[9px] text-[#4b5563] leading-snug">{t.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-white/[0.06]" />

      {/* Themes grid — 2 columns with mini website previews */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#6b7280] mb-3">
          Colour Theme
        </p>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(PRESET_THEMES).map(([key, preset]) => {
            const active = currentThemeKey === key;
            return (
              <div
                key={key}
                onClick={() => onSelectTheme(key, preset.theme)}
                className={`flex flex-col rounded-xl border overflow-hidden cursor-pointer transition-all ${
                  active
                    ? "border-[#00e5a0] shadow-[0_0_0_2px_rgba(0,229,160,0.25)]"
                    : "border-white/[0.08] hover:border-white/25"
                }`}
              >
                {/* Mini website preview */}
                <div className="p-2" style={{ background: "#0d0e10" }}>
                  <MiniSitePreview colors={preset.colors} />
                </div>

                {/* Card footer */}
                <div className="px-2.5 pb-2.5 pt-2" style={{ background: "#161718" }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[11px] font-bold ${active ? "text-[#00e5a0]" : "text-[#f0f0f0]"}`}>
                      {preset.name}
                    </span>
                    {active && (
                      <span className="text-[9px] font-bold text-[#00e5a0] bg-[#00e5a0]/10 px-1.5 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  {/* Color swatches */}
                  <div className="flex gap-1 mb-2">
                    {[preset.colors.primary, preset.colors.background, preset.colors.surface, preset.colors.text, preset.colors.accent].map((c, i) => (
                      <span
                        key={i}
                        className="w-3 h-3 rounded-full border border-white/10 flex-shrink-0"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelectTheme(key, preset.theme); }}
                    className={`w-full text-[10px] font-bold py-1 rounded-md transition-colors ${
                      active
                        ? "bg-[#00e5a0]/15 text-[#00e5a0] border border-[#00e5a0]/30"
                        : "bg-white/[0.05] text-[#9ca3af] border border-white/[0.08] hover:text-white hover:bg-white/[0.10]"
                    }`}
                  >
                    {active ? "✓ Using this theme" : "Use Theme"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hero Image */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#6b7280] mb-3">
          Hero Image
        </p>
        <div className="rounded-xl overflow-hidden border border-white/[0.07] mb-3" style={{ aspectRatio: "16/7" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentHeroImageUrl ?? `https://picsum.photos/id/${industryPhotoId(industry)}/400/175`}
            alt="Hero"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex-1 text-xs font-bold py-2 rounded-lg bg-white/[0.06] border border-white/[0.10] text-[#f0f0f0] hover:bg-white/[0.10] transition-colors disabled:opacity-50"
          >
            {uploading ? "Uploading…" : "📷 Upload Photo"}
          </button>
          {currentHeroImageUrl && (
            <button
              onClick={handleRemoveImage}
              className="text-xs font-bold py-2 px-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
            >
              Remove
            </button>
          )}
        </div>
        {!currentHeroImageUrl && (
          <p className="text-[10px] text-[#4b5563] mt-1.5">Using industry photo. Upload to customise.</p>
        )}
        {currentHeroImageUrl && (
          <button
            onClick={handleRemoveImage}
            className="text-[10px] text-[#4b5563] hover:text-[#9ca3af] mt-1.5 transition-colors"
          >
            ↩ Use industry photo
          </button>
        )}
        {uploadError && (
          <p className="text-[10px] text-red-400 mt-1.5">{uploadError}</p>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>
    </div>
  );
}

// ── Style option definitions ──────────────────────────────────────────────────
const FONT_OPTIONS: { value: import("@/lib/site-theme").FontStyleKey; label: string; fontFamily: string }[] = [
  { value: "modern",  label: "Modern",  fontFamily: "Inter, sans-serif" },
  { value: "classic", label: "Classic", fontFamily: "Georgia, serif" },
  { value: "bold",    label: "Bold",    fontFamily: "Trebuchet MS, sans-serif" },
  { value: "minimal", label: "Minimal", fontFamily: "Helvetica Neue, sans-serif" },
];

const BUTTON_OPTIONS: { value: import("@/lib/site-theme").ButtonStyleKey; label: string; radius: string }[] = [
  { value: "rounded", label: "Rounded", radius: "10px" },
  { value: "sharp",   label: "Sharp",   radius: "4px" },
  { value: "pill",    label: "Pill",    radius: "9999px" },
];

// ── Content Panel ─────────────────────────────────────────────────────────────
function ContentPanel({
  content,
  onChange,
  theme,
  onThemeChange,
}: {
  content:       StructuredSiteContent;
  onChange:      (c: StructuredSiteContent) => void;
  theme:         ThemeConfig;
  onThemeChange: (t: ThemeConfig) => void;
}) {
  const [expanded, setExpanded] = useState<ContentSection | null>("style");

  function toggle(s: ContentSection) {
    setExpanded((prev) => (prev === s ? null : s));
  }

  function setHero(field: keyof StructuredSiteContent["hero"], value: string) {
    onChange({ ...content, hero: { ...content.hero, [field]: value } });
  }

  function setService(i: number, field: "name" | "description" | "icon", value: string) {
    const services = content.services.map((s, idx) =>
      idx === i ? { ...s, [field]: value } : s
    );
    onChange({ ...content, services });
  }

  function addService() {
    if (content.services.length >= 8) return;
    onChange({
      ...content,
      services: [...content.services, { name: "New Service", description: "Description", icon: "✓" }],
    });
  }

  function removeService(i: number) {
    onChange({ ...content, services: content.services.filter((_, idx) => idx !== i) });
  }

  function setAbout(field: keyof Pick<StructuredSiteContent["about"], "title" | "body">, value: string) {
    onChange({ ...content, about: { ...content.about, [field]: value } });
  }

  function setTestimonial(i: number, field: "name" | "role" | "quote", value: string) {
    const testimonials = content.testimonials.map((t, idx) =>
      idx === i ? { ...t, [field]: value } : t
    );
    onChange({ ...content, testimonials });
  }

  function setCTA(field: keyof StructuredSiteContent["cta"], value: string) {
    onChange({ ...content, cta: { ...content.cta, [field]: value } });
  }

  return (
    <div className="divide-y divide-white/[0.06]">
      {/* Style */}
      <div>
        <SectionHeader label="🎨 Style" expanded={expanded === "style"} onToggle={() => toggle("style")} />
        {expanded === "style" && (
          <div className="px-4 pb-4 space-y-4">
            {/* Font Style */}
            <div>
              <label className={LABEL}>Font Style</label>
              <div className="grid grid-cols-2 gap-1.5">
                {FONT_OPTIONS.map((opt) => {
                  const active = (theme.fontStyle ?? "modern") === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => onThemeChange({ ...theme, fontStyle: opt.value })}
                      style={{ fontFamily: opt.fontFamily }}
                      className={`px-3 py-2 rounded-lg text-xs transition-all text-left border ${
                        active
                          ? "border-[#00e5a0] bg-[#00e5a0]/10 text-[#00e5a0] font-bold"
                          : "border-white/[0.08] bg-white/[0.02] text-[#d1d5db] hover:border-white/20 hover:bg-white/[0.05]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Button Style */}
            <div>
              <label className={LABEL}>Button Style</label>
              <div className="grid grid-cols-3 gap-1.5">
                {BUTTON_OPTIONS.map((opt) => {
                  const active = (theme.buttonStyle ?? "rounded") === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => onThemeChange({ ...theme, buttonStyle: opt.value })}
                      className={`relative px-2 py-2.5 text-[11px] transition-all border flex flex-col items-center gap-1.5 ${
                        active
                          ? "border-[#00e5a0] bg-[#00e5a0]/10 text-[#00e5a0] font-bold"
                          : "border-white/[0.08] bg-white/[0.02] text-[#d1d5db] hover:border-white/20 hover:bg-white/[0.05]"
                      }`}
                      style={{ borderRadius: "10px" }}
                    >
                      {/* Mini button preview */}
                      <span
                        className="block w-12 h-4 bg-current opacity-30"
                        style={{ borderRadius: opt.radius }}
                      />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Text Colors */}
            <div>
              <label className={LABEL}>Text Colors</label>
              <div className="space-y-2">
                {(
                  [
                    { key: "headingColor",    label: "Heading Color",     fallback: "#111111" },
                    { key: "bodyColor",       label: "Body Text Color",   fallback: "#6b7280" },
                    { key: "accentColor",     label: "Accent Color",      fallback: "#10b981" },
                    { key: "buttonTextColor", label: "Button Text Color", fallback: "#ffffff" },
                  ] as const
                ).map(({ key, label, fallback }) => {
                  const value = (theme[key] as string | undefined) ?? fallback;
                  return (
                    <div key={key} className="flex items-center justify-between gap-3">
                      <span className="text-[11px] text-[#9ca3af] flex-1">{label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#4b5563] font-mono">{value}</span>
                        <label className="relative cursor-pointer">
                          <span
                            className="block w-7 h-7 rounded border border-white/20 cursor-pointer"
                            style={{ background: value }}
                          />
                          <input
                            type="color"
                            value={value}
                            onChange={(e) => onThemeChange({ ...theme, [key]: e.target.value })}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => onThemeChange({
                  ...theme,
                  headingColor: undefined,
                  bodyColor: undefined,
                  accentColor: undefined,
                  buttonTextColor: undefined,
                })}
                className="mt-2 text-[10px] text-[#4b5563] hover:text-[#9ca3af] transition-colors underline underline-offset-2"
              >
                Reset to template defaults
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hero */}
      <div>
        <SectionHeader label="🦸 Hero" expanded={expanded === "hero"} onToggle={() => toggle("hero")} />
        {expanded === "hero" && (
          <div className="px-4 pb-4 space-y-3">
            <div>
              <label className={LABEL}>Headline</label>
              <input className={INPUT} value={content.hero.headline}
                onChange={(e) => setHero("headline", e.target.value)} />
            </div>
            <div>
              <label className={LABEL}>Subheadline</label>
              <textarea className={INPUT} rows={3} value={content.hero.subheadline}
                onChange={(e) => setHero("subheadline", e.target.value)} />
            </div>
            <div>
              <label className={LABEL}>Button text</label>
              <input className={INPUT} value={content.hero.ctaText}
                onChange={(e) => setHero("ctaText", e.target.value)} />
            </div>
            <div>
              <label className={LABEL}>Badge / location tag</label>
              <input className={INPUT} value={content.hero.badge}
                onChange={(e) => setHero("badge", e.target.value)} />
            </div>
          </div>
        )}
      </div>

      {/* Services */}
      <div>
        <SectionHeader label="🛠 Services" expanded={expanded === "services"} onToggle={() => toggle("services")} />
        {expanded === "services" && (
          <div className="px-4 pb-4 space-y-4">
            {content.services.map((svc, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">
                    Service {i + 1}
                  </span>
                  <button onClick={() => removeService(i)}
                    className="text-[10px] text-red-400/70 hover:text-red-400 transition-colors">
                    Remove
                  </button>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className={LABEL}>Name</label>
                    <input className={INPUT} value={svc.name}
                      onChange={(e) => setService(i, "name", e.target.value)} />
                  </div>
                  <div className="w-14">
                    <label className={LABEL}>Icon</label>
                    <input className={INPUT} value={svc.icon}
                      onChange={(e) => setService(i, "icon", e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className={LABEL}>Description</label>
                  <input className={INPUT} value={svc.description}
                    onChange={(e) => setService(i, "description", e.target.value)} />
                </div>
              </div>
            ))}
            {content.services.length < 8 && (
              <button onClick={addService}
                className="w-full py-2 text-xs text-[#00e5a0] border border-[#00e5a0]/30 rounded-xl hover:bg-[#00e5a0]/5 transition-colors">
                + Add Service
              </button>
            )}
          </div>
        )}
      </div>

      {/* About */}
      <div>
        <SectionHeader label="ℹ️ About" expanded={expanded === "about"} onToggle={() => toggle("about")} />
        {expanded === "about" && (
          <div className="px-4 pb-4 space-y-3">
            <div>
              <label className={LABEL}>Section title</label>
              <input className={INPUT} value={content.about.title}
                onChange={(e) => setAbout("title", e.target.value)} />
            </div>
            <div>
              <label className={LABEL}>Body text</label>
              <textarea className={INPUT} rows={4} value={content.about.body}
                onChange={(e) => setAbout("body", e.target.value)} />
            </div>
          </div>
        )}
      </div>

      {/* Testimonials */}
      <div>
        <SectionHeader label="⭐ Testimonials" expanded={expanded === "testimonials"} onToggle={() => toggle("testimonials")} />
        {expanded === "testimonials" && (
          <div className="px-4 pb-4 space-y-4">
            {content.testimonials.map((t, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 space-y-2">
                <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">
                  Review {i + 1}
                </span>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className={LABEL}>Name</label>
                    <input className={INPUT} value={t.name}
                      onChange={(e) => setTestimonial(i, "name", e.target.value)} />
                  </div>
                  <div className="flex-1">
                    <label className={LABEL}>Role</label>
                    <input className={INPUT} value={t.role}
                      onChange={(e) => setTestimonial(i, "role", e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className={LABEL}>Quote</label>
                  <textarea className={INPUT} rows={2} value={t.quote}
                    onChange={(e) => setTestimonial(i, "quote", e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div>
        <SectionHeader label="📣 CTA" expanded={expanded === "cta"} onToggle={() => toggle("cta")} />
        {expanded === "cta" && (
          <div className="px-4 pb-4 space-y-3">
            <div>
              <label className={LABEL}>Headline</label>
              <input className={INPUT} value={content.cta.headline}
                onChange={(e) => setCTA("headline", e.target.value)} />
            </div>
            <div>
              <label className={LABEL}>Subtext</label>
              <input className={INPUT} value={content.cta.subtext}
                onChange={(e) => setCTA("subtext", e.target.value)} />
            </div>
            <div>
              <label className={LABEL}>Button text</label>
              <input className={INPUT} value={content.cta.buttonText}
                onChange={(e) => setCTA("buttonText", e.target.value)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Helper: industry photo id ─────────────────────────────────────────────────
const INDUSTRY_PHOTO_IDS: Record<string, number> = {
  "Landscaping": 28, "Plumbing": 164, "Electrician": 160,
  "Beauty & Wellness": 64, "Restaurant": 292, "Consulting": 375,
  "Real Estate": 450, "Fitness": 1, "Auto & Mechanic": 111,
  "Cleaning": 219, "Other": 338,
};
function industryPhotoId(industry: string) {
  return INDUSTRY_PHOTO_IDS[industry] ?? 338;
}

// ── Main SiteEditor component ─────────────────────────────────────────────────
export function SiteEditor({
  site, content, theme, isOwner, editMode, siteId, initialHeroImageUrl,
}: Props) {
  const [activePanel, setActivePanel]         = useState<Panel>(null);
  const [currentContent, setCurrentContent]   = useState<StructuredSiteContent>(content);
  const [currentTheme, setCurrentTheme]       = useState<ThemeConfig>(theme);
  const [currentThemeKey, setCurrentThemeKey] = useState<string>("");
  const [currentTemplate, setCurrentTemplate] = useState<string>(site.template ?? "darkpremium");
  const [heroImageUrl, setHeroImageUrl]       = useState<string | null>(initialHeroImageUrl ?? null);
  const [isSaving, setIsSaving]               = useState(false);
  const [lastSaved, setLastSaved]             = useState<Date | null>(null);
  const [saveError, setSaveError]             = useState(false);
  const hasChanges                            = useRef(false);
  const [, startTransition]                   = useTransition();

  // ── Save function (must be declared before any early return per React rules) ──
  const doSave = useCallback(async (c: StructuredSiteContent, t: ThemeConfig, tmpl: string) => {
    setIsSaving(true);
    setSaveError(false);
    try {
      const res = await fetch(`/api/sites/${siteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: c, theme: t, template: tmpl }),
      });
      if (res.ok) setLastSaved(new Date());
      else setSaveError(true);
    } catch {
      setSaveError(true);
    } finally {
      setIsSaving(false);
    }
  }, [siteId]);

  // ── Debounced autosave (must be declared before any early return) ─────────
  useEffect(() => {
    if (!hasChanges.current) return;
    const timer = setTimeout(() => {
      startTransition(() => { doSave(currentContent, currentTheme, currentTemplate); });
    }, 800);
    return () => clearTimeout(timer);
  }, [currentContent, currentTheme, currentTemplate, doSave, startTransition]);

  // ── Clean site mode: no editor chrome ───────────────────────────────────
  // SiteEditor is only mounted by page.tsx when isOwner && editMode, but this
  // guard is kept as a safety net in case props are passed differently.
  if (!isOwner || !editMode) {
    return (
      <TemplateRenderer
        site={{ ...site, template: site.template ?? "darkpremium" }}
        content={content}
        theme={theme}
        heroImageUrl={initialHeroImageUrl}
      />
    );
  }

  function handleContentChange(c: StructuredSiteContent) {
    hasChanges.current = true;
    setCurrentContent(c);
  }

  function handleSelectTheme(key: string, t: ThemeConfig) {
    hasChanges.current = true;
    setCurrentThemeKey(key);
    setCurrentTheme(t);
  }

  function handleSelectTemplate(tmpl: string) {
    hasChanges.current = true;
    setCurrentTemplate(tmpl);
  }

  function handleHeroImageChange(url: string | null) {
    setHeroImageUrl(url);
  }

  const panelOpen = activePanel !== null;
  const BAR_H     = 52;
  const PANEL_W   = 360;

  return (
    <>
      {/* ── Editor top bar ─────────────────────────────────────────────────── */}
      <div
        style={{
          position:    "fixed",
          top:          0,
          left:         0,
          right:        0,
          height:       `${BAR_H}px`,
          zIndex:       200,
          background:   "#0d0e10",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display:      "flex",
          alignItems:   "center",
          justifyContent: "space-between",
          padding:      "0 1rem",
          gap:          "0.75rem",
        }}
      >
        {/* Left */}
        <Link
          href="/dashboard"
          style={{
            fontSize:    "0.75rem",
            color:       "#6b7280",
            textDecoration: "none",
            whiteSpace:  "nowrap",
            flexShrink:  0,
          }}
          className="hover:text-white transition-colors"
        >
          ← Dashboard
        </Link>

        {/* Center tabs */}
        <div style={{ display: "flex", gap: "0.25rem", background: "#161718", borderRadius: "12px", padding: "4px" }}>
          {(["themes", "content"] as const).map((tab) => {
            const labels = { themes: "🎨 Themes", content: "✏️ Edit" };
            const active = activePanel === tab;
            return (
              <button
                key={tab}
                onClick={() => setActivePanel(active ? null : tab)}
                style={{
                  fontSize:     "0.75rem",
                  fontWeight:   active ? 700 : 500,
                  padding:      "5px 14px",
                  borderRadius: "9px",
                  border:       "none",
                  cursor:       "pointer",
                  background:   active ? "#00e5a0" : "transparent",
                  color:        active ? "#000"     : "#9ca3af",
                  transition:   "all 0.15s",
                }}
              >
                {labels[tab]}
              </button>
            );
          })}
          <button
            onClick={() => setActivePanel(null)}
            style={{
              fontSize:     "0.75rem",
              fontWeight:   activePanel === null ? 700 : 500,
              padding:      "5px 14px",
              borderRadius: "9px",
              border:       "none",
              cursor:       "pointer",
              background:   activePanel === null ? "rgba(255,255,255,0.08)" : "transparent",
              color:        activePanel === null ? "#f0f0f0" : "#9ca3af",
              transition:   "all 0.15s",
            }}
          >
            👁 Preview
          </button>
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
          <span style={{ fontSize: "0.7rem", color: saveError ? "#f87171" : isSaving ? "#9ca3af" : "#00e5a0" }}>
            {saveError ? "Save failed" : isSaving ? "Saving…" : lastSaved ? "Saved ✓" : ""}
          </span>
          <a
            href={site.subdomainSlug
              ? `https://${site.subdomainSlug}.baileyagents.com`
              : `/sites/${siteId}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize:        "0.7rem",
              fontWeight:       700,
              padding:         "5px 12px",
              borderRadius:    "8px",
              background:      "rgba(255,255,255,0.06)",
              border:          "1px solid rgba(255,255,255,0.10)",
              color:           "#f0f0f0",
              textDecoration:  "none",
              transition:      "all 0.15s",
            }}
            className="hover:bg-white/10"
          >
            View Live ↗
          </a>
        </div>
      </div>

      {/* ── Side panel ──────────────────────────────────────────────────────── */}
      <div
        style={{
          position:   "fixed",
          top:        `${BAR_H}px`,
          left:        0,
          width:      `${PANEL_W}px`,
          height:     `calc(100vh - ${BAR_H}px)`,
          zIndex:      150,
          background:  "#111214",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          overflowY:   "auto",
          transform:   panelOpen ? "translateX(0)" : `translateX(-${PANEL_W}px)`,
          transition:  "transform 0.25s ease",
        }}
      >
        <div style={{ minHeight: "100%" }}>
          {activePanel === "themes" && (
            <ThemesPanel
              currentThemeKey={currentThemeKey}
              onSelectTheme={handleSelectTheme}
              currentTemplate={currentTemplate}
              onSelectTemplate={handleSelectTemplate}
              siteId={siteId}
              currentHeroImageUrl={heroImageUrl}
              industry={site.industry}
              onHeroImageChange={handleHeroImageChange}
            />
          )}
          {activePanel === "content" && (
            <ContentPanel
              content={currentContent}
              onChange={handleContentChange}
              theme={currentTheme}
              onThemeChange={(t) => { hasChanges.current = true; setCurrentTheme(t); }}
            />
          )}
        </div>
      </div>

      {/* ── Site preview (offset when panel open) ────────────────────────────── */}
      <div
        style={{
          marginTop:   `${BAR_H}px`,
          marginLeft:  panelOpen ? `${PANEL_W}px` : "0",
          transition:  "margin-left 0.25s ease",
        }}
      >
        <TemplateRenderer
          site={{ ...site, template: currentTemplate }}
          content={currentContent}
          theme={currentTheme}
          heroImageUrl={heroImageUrl ?? undefined}
        />
      </div>
    </>
  );
}
