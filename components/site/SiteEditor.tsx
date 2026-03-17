"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import type { SiteRecord } from "@/lib/kv";
import type { StructuredSiteContent, ThemeConfig } from "@/lib/site-theme";
import { PRESET_THEMES } from "@/lib/site-theme";
import { LayoutRenderer }   from "./LayoutRenderer";
import { TemplateRenderer } from "./TemplateRenderer";
import { AskBailey }        from "@/components/editor/AskBailey";

// ── Types ─────────────────────────────────────────────────────────────────────
type Panel = "themes" | "content" | "askbailey" | null;

type ContentSection = "navbar" | "design" | "hero" | "services" | "about" | "testimonials" | "cta";

type Props = {
  site:                SiteRecord;
  content:             StructuredSiteContent;
  theme:               ThemeConfig;
  isOwner:             boolean;
  /** True only when the URL contains ?edit=true. Controls editor chrome visibility. */
  editMode:            boolean;
  siteId:              string;
  initialHeroImageUrl?: string;
  /** Plan passed from the server page for Ask Bailey limits */
  plan?:               string;
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
}: {
  currentThemeKey:  string;
  onSelectTheme:    (key: string, theme: ThemeConfig) => void;
  currentTemplate:  string;
  onSelectTemplate: (key: string) => void;
}) {
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

// ── Section tab definitions ───────────────────────────────────────────────────
const SECTION_TABS: { key: ContentSection; icon: string; label: string; anchor: string }[] = [
  { key: "navbar",       icon: "🧭", label: "Navbar",   anchor: "" },
  { key: "hero",         icon: "🦸", label: "Hero",     anchor: "#home" },
  { key: "services",     icon: "⚙️", label: "Services", anchor: "#services" },
  { key: "about",        icon: "👤", label: "About",    anchor: "#about" },
  { key: "testimonials", icon: "💬", label: "Reviews",  anchor: "#testimonials" },
  { key: "cta",          icon: "📣", label: "CTA",      anchor: "#contact" },
  { key: "design",       icon: "🎨", label: "Design",   anchor: "" },
];

// ── Inline color picker row ───────────────────────────────────────────────────
function ColorPicker({ label, value, fallback, onChange }: {
  label:    string;
  value:    string | undefined;
  fallback: string;
  onChange: (v: string) => void;
}) {
  const resolved = value ?? fallback;
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[11px] text-[#9ca3af] flex-1">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-[#4b5563] font-mono">{resolved}</span>
        <label className="relative cursor-pointer">
          <span className="block w-7 h-7 rounded border border-white/20 cursor-pointer" style={{ background: resolved }} />
          <input type="color" value={resolved} onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        </label>
      </div>
    </div>
  );
}

// ── Content Panel ─────────────────────────────────────────────────────────────
function ContentPanel({
  content, onChange,
  theme, onThemeChange,
  businessName,
  siteId,
  heroImageUrl, aboutImageUrl,
  onHeroImageChange, onAboutImageChange,
  serviceImages, onServiceImagesChange,
  industry,
  onScrollToSection,
}: {
  content:                StructuredSiteContent;
  onChange:               (c: StructuredSiteContent) => void;
  theme:                  ThemeConfig;
  onThemeChange:          (t: ThemeConfig) => void;
  businessName?:          string;
  siteId:                 string;
  heroImageUrl:           string | null;
  aboutImageUrl:          string | null;
  onHeroImageChange:      (url: string | null) => void;
  onAboutImageChange:     (url: string | null) => void;
  serviceImages:          Record<number, string>;
  onServiceImagesChange:  (idx: number, url: string | undefined) => void;
  industry:               string;
  onScrollToSection:      (anchor: string) => void;
}) {
  const [activeTab, setActiveTab]           = useState<ContentSection>("hero");
  const [uploading, setUploading]           = useState(false);
  const [uploadError, setUploadError]       = useState<string | null>(null);
  const [heroSuccess, setHeroSuccess]       = useState(false);
  const [aboutUploading, setAboutUploading] = useState(false);
  const [aboutError, setAboutError]         = useState<string | null>(null);
  const [aboutSuccess, setAboutSuccess]     = useState(false);
  const fileRef      = useRef<HTMLInputElement>(null);
  const aboutFileRef = useRef<HTMLInputElement>(null);
  const [svcUploading, setSvcUploading] = useState<Record<number, boolean>>({});
  const [svcError, setSvcError]         = useState<Record<number, string | null>>({});
  const [svcSuccess, setSvcSuccess]     = useState<Record<number, boolean>>({});
  const svcFileRefs                     = useRef<Array<HTMLInputElement | null>>([]);

  // ── Content helpers ─────────────────────────────────────────────────────────
  function setHero(field: keyof StructuredSiteContent["hero"], value: string) {
    onChange({ ...content, hero: { ...content.hero, [field]: value } });
  }
  function setNavLink(i: number, value: string) {
    const cur = content.nav?.links ?? ["Services", "About", "Contact"];
    const updated: [string, string, string] = [cur[0] ?? "Services", cur[1] ?? "About", cur[2] ?? "Contact"];
    updated[i] = value;
    onChange({ ...content, nav: { ...content.nav, links: updated } });
  }
  function setService(i: number, field: "name" | "description" | "icon", value: string) {
    onChange({ ...content, services: content.services.map((s, idx) => idx === i ? { ...s, [field]: value } : s) });
  }
  function addService() {
    if (content.services.length >= 8) return;
    onChange({ ...content, services: [...content.services, { name: "New Service", description: "Description", icon: "✓" }] });
  }
  function removeService(i: number) {
    onChange({ ...content, services: content.services.filter((_, idx) => idx !== i) });
  }
  function setAboutField(field: "title" | "body", value: string) {
    onChange({ ...content, about: { ...content.about, [field]: value } });
  }
  function setStat(i: number, field: "label" | "value", value: string) {
    const stats = (content.about.stats ?? []).map((s, idx) => idx === i ? { ...s, [field]: value } : s);
    onChange({ ...content, about: { ...content.about, stats } });
  }
  function setTestimonial(i: number, field: "name" | "role" | "quote", value: string) {
    onChange({ ...content, testimonials: content.testimonials.map((t, idx) => idx === i ? { ...t, [field]: value } : t) });
  }
  function setTestimonialRating(i: number, rating: number) {
    onChange({ ...content, testimonials: content.testimonials.map((t, idx) => idx === i ? { ...t, rating } : t) });
  }
  function addTestimonial() {
    if (content.testimonials.length >= 6) return;
    onChange({ ...content, testimonials: [...content.testimonials, { name: "Happy Customer", role: "Customer", quote: "Great service!", rating: 5 }] });
  }
  function removeTestimonial(i: number) {
    if (content.testimonials.length <= 1) return;
    onChange({ ...content, testimonials: content.testimonials.filter((_, idx) => idx !== i) });
  }
  function setCTA(field: keyof StructuredSiteContent["cta"], value: string) {
    onChange({ ...content, cta: { ...content.cta, [field]: value } });
  }

  // ── Image upload helpers ────────────────────────────────────────────────────
  async function uploadImage(
    file: File, section: string,
    onSuccess: (url: string) => void,
    setErr: (e: string | null) => void,
    setLoading: (v: boolean) => void,
    setOk: (v: boolean) => void,
  ) {
    if (file.size > 2 * 1024 * 1024) { setErr("Image must be under 2 MB"); return; }
    setErr(null); setLoading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      try {
        const res = await fetch(`/api/sites/${siteId}/image`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ section, image: dataUrl }),
        });
        if (!res.ok) { setErr("Upload failed"); return; }
        onSuccess(dataUrl); setOk(true); setTimeout(() => setOk(false), 2500);
      } catch { setErr("Upload failed"); }
      finally { setLoading(false); }
    };
    reader.readAsDataURL(file);
  }
  function handleHeroFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    void uploadImage(file, "hero", onHeroImageChange, setUploadError, setUploading, setHeroSuccess);
  }
  function handleAboutFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    void uploadImage(file, "about", onAboutImageChange, setAboutError, setAboutUploading, setAboutSuccess);
  }
  async function handleRemoveHeroImage() {
    await fetch(`/api/sites/${siteId}/image`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ section: "hero", image: null }) });
    onHeroImageChange(null);
  }
  async function handleRemoveAboutImage() {
    await fetch(`/api/sites/${siteId}/image`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ section: "about", image: null }) });
    onAboutImageChange(null);
  }
  function handleServiceFileChange(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    void uploadImage(
      file,
      `service-${i}`,
      (url) => {
        onServiceImagesChange(i, url);
        setSvcSuccess(prev => ({ ...prev, [i]: true }));
        setTimeout(() => setSvcSuccess(prev => ({ ...prev, [i]: false })), 2500);
      },
      (err) => setSvcError(prev => ({ ...prev, [i]: err })),
      (loading) => setSvcUploading(prev => ({ ...prev, [i]: loading })),
      () => {},
    );
  }
  async function handleRemoveServiceImage(i: number) {
    await fetch(`/api/sites/${siteId}/image`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ section: `service-${i}`, image: null }) });
    onServiceImagesChange(i, undefined);
  }

  const navLinks = content.nav?.links ?? ["Services", "About", "Contact"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

      {/* ── Section tab strip ───────────────────────────────────────────────── */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
        borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0,
      }}>
        {SECTION_TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); onScrollToSection(tab.anchor); }}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: 3, padding: "10px 2px",
                background: active ? "rgba(0,229,160,0.07)" : "transparent",
                borderBottom: active ? "2px solid #00e5a0" : "2px solid transparent",
                border: "none", borderRadius: 0, cursor: "pointer", transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 14, lineHeight: 1 }}>{tab.icon}</span>
              <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: active ? "#00e5a0" : "#4b5563" }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Section content area ────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }} className="space-y-3">

        {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
        {activeTab === "navbar" && (
          <div className="space-y-4">
            {businessName && (
              <div>
                <label className={LABEL}>Business Name</label>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2">
                  <span className="text-xs text-[#f0f0f0]">{businessName}</span>
                  <span className="block text-[10px] text-[#4b5563] mt-0.5">Set when site was created</span>
                </div>
              </div>
            )}
            <div>
              <label className={LABEL}>Nav Link Labels</label>
              <div className="space-y-2">
                {(["Services", "About", "Contact"] as const).map((placeholder, i) => (
                  <input key={i} className={INPUT} placeholder={placeholder}
                    value={navLinks[i] ?? placeholder}
                    onChange={(e) => setNavLink(i, e.target.value)} />
                ))}
              </div>
            </div>
            <div>
              <label className={LABEL}>Navbar Colors</label>
              <div className="space-y-2">
                <ColorPicker label="Background" value={theme.surface} fallback="#0d0e10"
                  onChange={(v) => onThemeChange({ ...theme, surface: v })} />
                <ColorPicker label="Link Color" value={theme.bodyColor} fallback="#9ca3af"
                  onChange={(v) => onThemeChange({ ...theme, bodyColor: v })} />
              </div>
            </div>
            <button onClick={() => onThemeChange({ ...theme, surface: undefined, bodyColor: undefined })}
              className="text-[10px] text-[#4b5563] hover:text-[#9ca3af] transition-colors underline underline-offset-2">
              Reset navbar colors
            </button>
          </div>
        )}

        {/* ── HERO ───────────────────────────────────────────────────────── */}
        {activeTab === "hero" && (
          <div className="space-y-3">
            <div>
              <label className={LABEL}>Headline</label>
              <input className={INPUT} value={content.hero.headline} onChange={(e) => setHero("headline", e.target.value)} />
            </div>
            <div>
              <label className={LABEL}>Subheadline</label>
              <textarea className={INPUT} rows={3} value={content.hero.subheadline} onChange={(e) => setHero("subheadline", e.target.value)} />
            </div>
            <div>
              <label className={LABEL}>Button Text</label>
              <input className={INPUT} value={content.hero.ctaText} onChange={(e) => setHero("ctaText", e.target.value)} />
            </div>
            <div>
              <label className={LABEL}>Badge / Location Tag</label>
              <input className={INPUT} value={content.hero.badge} onChange={(e) => setHero("badge", e.target.value)} />
            </div>
            <div>
              <label className={LABEL}>Hero Background Color</label>
              <ColorPicker label="Background" value={theme.background} fallback="#080808"
                onChange={(v) => onThemeChange({ ...theme, background: v })} />
            </div>
            {/* Hero image */}
            <div>
              <label className={LABEL}>Hero Photo</label>
              <div className="rounded-xl overflow-hidden border border-white/[0.07] mb-2" style={{ aspectRatio: "16/7" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={heroImageUrl ?? `https://picsum.photos/id/${industryPhotoId(industry)}/400/175`}
                  alt="Hero" className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="flex-1 text-xs font-bold py-2 rounded-lg bg-white/[0.06] border border-white/[0.10] text-[#f0f0f0] hover:bg-white/[0.10] transition-colors disabled:opacity-50">
                  {uploading ? "Uploading…" : "📷 Upload Photo"}
                </button>
                {heroImageUrl && (
                  <button onClick={handleRemoveHeroImage}
                    className="text-xs font-bold py-2 px-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors">
                    Remove
                  </button>
                )}
              </div>
              {heroSuccess && <p className="text-[10px] text-[#00e5a0] mt-1.5">✅ Hero image updated!</p>}
              {uploadError && <p className="text-[10px] text-red-400 mt-1.5">{uploadError}</p>}
              {!heroImageUrl && !heroSuccess && <p className="text-[10px] text-[#4b5563] mt-1.5">Using industry photo. Upload to customise.</p>}
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleHeroFileChange} />
            </div>
          </div>
        )}

        {/* ── SERVICES ───────────────────────────────────────────────────── */}
        {activeTab === "services" && (
          <div className="space-y-3">
            {content.services.map((svc, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">Service {i + 1}</span>
                  <button onClick={() => removeService(i)} className="text-[10px] text-red-400/70 hover:text-red-400 transition-colors">Remove</button>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className={LABEL}>Name</label>
                    <input className={INPUT} value={svc.name} onChange={(e) => setService(i, "name", e.target.value)} />
                  </div>
                  <div className="w-14">
                    <label className={LABEL}>Icon</label>
                    <input className={INPUT} value={svc.icon} onChange={(e) => setService(i, "icon", e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className={LABEL}>Description</label>
                  <textarea className={INPUT} rows={2} value={svc.description} onChange={(e) => setService(i, "description", e.target.value)} />
                </div>
                {/* Service card photo */}
                <div>
                  <label className={LABEL}>Card Photo</label>
                  {serviceImages[i] && serviceImages[i] !== "[uploaded]" && (
                    <div className="rounded-lg overflow-hidden border border-white/[0.07] mb-2" style={{ aspectRatio: "16/9" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={serviceImages[i]} alt={svc.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => svcFileRefs.current[i]?.click()}
                      disabled={!!svcUploading[i]}
                      className="flex-1 text-xs font-bold py-2 rounded-lg bg-white/[0.06] border border-white/[0.10] text-[#f0f0f0] hover:bg-white/[0.10] transition-colors disabled:opacity-50"
                    >
                      {svcUploading[i] ? "Uploading…" : "📷 Add Photo"}
                    </button>
                    {serviceImages[i] && serviceImages[i] !== "[uploaded]" && (
                      <button
                        onClick={() => handleRemoveServiceImage(i)}
                        className="text-xs font-bold py-2 px-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {svcSuccess[i] && <p className="text-[10px] text-[#00e5a0] mt-1.5">✅ Photo updated!</p>}
                  {svcError[i] && <p className="text-[10px] text-red-400 mt-1.5">{svcError[i]}</p>}
                  <input
                    ref={(el) => { svcFileRefs.current[i] = el; }}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => handleServiceFileChange(i, e)}
                  />
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

        {/* ── ABOUT ──────────────────────────────────────────────────────── */}
        {activeTab === "about" && (
          <div className="space-y-3">
            <div>
              <label className={LABEL}>Section Title</label>
              <input className={INPUT} value={content.about.title} onChange={(e) => setAboutField("title", e.target.value)} />
            </div>
            <div>
              <label className={LABEL}>Body Text</label>
              <textarea className={INPUT} rows={4} value={content.about.body} onChange={(e) => setAboutField("body", e.target.value)} />
            </div>
            {(content.about.stats?.length ?? 0) > 0 && (
              <div>
                <label className={LABEL}>Stats</label>
                <div className="space-y-2">
                  {(content.about.stats ?? []).map((stat, i) => (
                    <div key={i} className="flex gap-2">
                      <input className={INPUT} placeholder="Label" value={stat.label} onChange={(e) => setStat(i, "label", e.target.value)} />
                      <input className={INPUT} placeholder="Value" value={stat.value}
                        style={{ width: 72, flexShrink: 0 }} onChange={(e) => setStat(i, "value", e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* About image */}
            <div>
              <label className={LABEL}>About Photo</label>
              {aboutImageUrl ? (
                <div className="rounded-xl overflow-hidden border border-white/[0.07] mb-2" style={{ aspectRatio: "4/3", maxHeight: 120 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={aboutImageUrl} alt="About" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-white/[0.15] mb-2 flex items-center justify-center" style={{ height: 70 }}>
                  <span className="text-[11px] text-[#4b5563]">No about image</span>
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={() => aboutFileRef.current?.click()} disabled={aboutUploading}
                  className="flex-1 text-xs font-bold py-2 rounded-lg bg-white/[0.06] border border-white/[0.10] text-[#f0f0f0] hover:bg-white/[0.10] transition-colors disabled:opacity-50">
                  {aboutUploading ? "Uploading…" : "📷 Upload Photo"}
                </button>
                {aboutImageUrl && (
                  <button onClick={handleRemoveAboutImage}
                    className="text-xs font-bold py-2 px-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors">
                    Remove
                  </button>
                )}
              </div>
              {aboutSuccess && <p className="text-[10px] text-[#00e5a0] mt-1.5">✅ About image updated!</p>}
              {aboutError && <p className="text-[10px] text-red-400 mt-1.5">{aboutError}</p>}
              <input ref={aboutFileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAboutFileChange} />
            </div>
          </div>
        )}

        {/* ── TESTIMONIALS ───────────────────────────────────────────────── */}
        {activeTab === "testimonials" && (
          <div className="space-y-3">
            {content.testimonials.map((t, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">Review {i + 1}</span>
                  {content.testimonials.length > 1 && (
                    <button onClick={() => removeTestimonial(i)} className="text-[10px] text-red-400/70 hover:text-red-400 transition-colors">Remove</button>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className={LABEL}>Name</label>
                    <input className={INPUT} value={t.name} onChange={(e) => setTestimonial(i, "name", e.target.value)} />
                  </div>
                  <div className="flex-1">
                    <label className={LABEL}>Role</label>
                    <input className={INPUT} value={t.role} onChange={(e) => setTestimonial(i, "role", e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className={LABEL}>Quote</label>
                  <textarea className={INPUT} rows={2} value={t.quote} onChange={(e) => setTestimonial(i, "quote", e.target.value)} />
                </div>
                <div>
                  <label className={LABEL}>Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setTestimonialRating(i, star)}
                        style={{ fontSize: 18, background: "none", border: "none", cursor: "pointer", padding: "1px",
                          color: star <= (t.rating ?? 5) ? "#eab308" : "#374151" }}>
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {content.testimonials.length < 6 && (
              <button onClick={addTestimonial}
                className="w-full py-2 text-xs text-[#00e5a0] border border-[#00e5a0]/30 rounded-xl hover:bg-[#00e5a0]/5 transition-colors">
                + Add Review
              </button>
            )}
          </div>
        )}

        {/* ── CTA ────────────────────────────────────────────────────────── */}
        {activeTab === "cta" && (
          <div className="space-y-3">
            <div>
              <label className={LABEL}>Headline</label>
              <input className={INPUT} value={content.cta.headline} onChange={(e) => setCTA("headline", e.target.value)} />
            </div>
            <div>
              <label className={LABEL}>Subtext</label>
              <input className={INPUT} value={content.cta.subtext} onChange={(e) => setCTA("subtext", e.target.value)} />
            </div>
            <div>
              <label className={LABEL}>Button Text</label>
              <input className={INPUT} value={content.cta.buttonText} onChange={(e) => setCTA("buttonText", e.target.value)} />
            </div>
            <div>
              <label className={LABEL}>CTA Background</label>
              <ColorPicker label="Background" value={theme.surface} fallback="#0d0e10"
                onChange={(v) => onThemeChange({ ...theme, surface: v })} />
            </div>
          </div>
        )}

        {/* ── DESIGN ─────────────────────────────────────────────────────── */}
        {activeTab === "design" && (
          <div className="space-y-5">
            {/* Colors */}
            <div>
              <label className={LABEL}>Colors</label>
              <div className="space-y-2">
                <ColorPicker label="Primary Color"   value={theme.primaryColor}    fallback="#10b981" onChange={(v) => onThemeChange({ ...theme, primaryColor: v })} />
                <ColorPicker label="Page Background" value={theme.background}      fallback="#080808" onChange={(v) => onThemeChange({ ...theme, background: v })} />
                <ColorPicker label="Navbar / Cards"  value={theme.surface}         fallback="#0d0e10" onChange={(v) => onThemeChange({ ...theme, surface: v })} />
                <ColorPicker label="Heading Color"   value={theme.headingColor}    fallback="#ffffff" onChange={(v) => onThemeChange({ ...theme, headingColor: v })} />
                <ColorPicker label="Body Text"       value={theme.bodyColor}       fallback="#9ca3af" onChange={(v) => onThemeChange({ ...theme, bodyColor: v })} />
                <ColorPicker label="Accent Color"    value={theme.accentColor}     fallback="#10b981" onChange={(v) => onThemeChange({ ...theme, accentColor: v })} />
                <ColorPicker label="Button Text"     value={theme.buttonTextColor} fallback="#000000" onChange={(v) => onThemeChange({ ...theme, buttonTextColor: v })} />
              </div>
              <button
                onClick={() => onThemeChange({ ...theme, primaryColor: theme.primaryColor, headingColor: undefined, bodyColor: undefined, accentColor: undefined, buttonTextColor: undefined, background: undefined, surface: undefined })}
                className="mt-2 text-[10px] text-[#4b5563] hover:text-[#9ca3af] transition-colors underline underline-offset-2">
                Reset all colors
              </button>
            </div>

            <div className="border-t border-white/[0.06]" />

            {/* Font Style */}
            <div>
              <label className={LABEL}>Font Style</label>
              <div className="grid grid-cols-2 gap-1.5">
                {FONT_OPTIONS.map((opt) => {
                  const active = (theme.fontStyle ?? "modern") === opt.value;
                  return (
                    <button key={opt.value} onClick={() => onThemeChange({ ...theme, fontStyle: opt.value })}
                      style={{ fontFamily: opt.fontFamily }}
                      className={`px-3 py-2 rounded-lg text-xs transition-all text-left border ${
                        active ? "border-[#00e5a0] bg-[#00e5a0]/10 text-[#00e5a0] font-bold"
                               : "border-white/[0.08] bg-white/[0.02] text-[#d1d5db] hover:border-white/20 hover:bg-white/[0.05]"
                      }`}>{opt.label}</button>
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
                    <button key={opt.value} onClick={() => onThemeChange({ ...theme, buttonStyle: opt.value })}
                      className={`relative px-2 py-2.5 text-[11px] transition-all border flex flex-col items-center gap-1.5 ${
                        active ? "border-[#00e5a0] bg-[#00e5a0]/10 text-[#00e5a0] font-bold"
                               : "border-white/[0.08] bg-white/[0.02] text-[#d1d5db] hover:border-white/20 hover:bg-white/[0.05]"
                      }`} style={{ borderRadius: "10px" }}>
                      <span className="block w-12 h-4 bg-current opacity-30" style={{ borderRadius: opt.radius }} />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Font Size */}
            <div>
              <label className={LABEL}>Font Size</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(["small", "medium", "large", "xlarge"] as const).map((size) => {
                  const active = (theme.fontSize ?? "medium") === size;
                  const lbl = { small: "S", medium: "M", large: "L", xlarge: "XL" }[size];
                  return (
                    <button key={size} onClick={() => onThemeChange({ ...theme, fontSize: size })}
                      className={`py-2 text-[11px] rounded-lg transition-all border font-bold ${
                        active ? "border-[#00e5a0] bg-[#00e5a0]/10 text-[#00e5a0]"
                               : "border-white/[0.08] bg-white/[0.02] text-[#d1d5db] hover:border-white/20"
                      }`}>{lbl}</button>
                  );
                })}
              </div>
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
  site, content, theme, isOwner, editMode, siteId, initialHeroImageUrl, plan = "starter",
}: Props) {
  const [activePanel, setActivePanel]         = useState<Panel>(null);
  const [askBaileyOpen, setAskBaileyOpen]     = useState(false);
  const [currentContent, setCurrentContent]   = useState<StructuredSiteContent>(content);
  const [currentTheme, setCurrentTheme]       = useState<ThemeConfig>(theme);
  const [currentThemeKey, setCurrentThemeKey] = useState<string>("");
  const [currentTemplate, setCurrentTemplate] = useState<string>(site.template ?? "darkpremium");
  const [heroImageUrl, setHeroImageUrl]       = useState<string | null>(
    (initialHeroImageUrl && initialHeroImageUrl !== "[uploaded]") ? initialHeroImageUrl :
    (site.heroImage && site.heroImage !== "[uploaded]") ? site.heroImage : null
  );
  const [aboutImageUrl, setAboutImageUrl]     = useState<string | null>(
    (site.aboutImage && site.aboutImage !== "[uploaded]") ? site.aboutImage : null
  );
  const [serviceImages, setServiceImages]     = useState<Record<number, string>>(
    Object.fromEntries(
      Object.entries(site.serviceImages ?? {})
        .filter(([, v]) => v && v !== "[uploaded]")
        .map(([k, v]) => [Number(k), v as string])
    )
  );
  const [isSaving, setIsSaving]               = useState(false);
  const [lastSaved, setLastSaved]             = useState<Date | null>(null);
  const [saveError, setSaveError]             = useState(false);
  const hasChanges                            = useRef(false);

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
      doSave(currentContent, currentTheme, currentTemplate);
    }, 800);
    return () => clearTimeout(timer);
  }, [currentContent, currentTheme, currentTemplate, doSave]);

  // ── Clean site mode: no editor chrome ───────────────────────────────────
  // SiteEditor is only mounted by page.tsx when isOwner && editMode, but this
  // guard is kept as a safety net in case props are passed differently.
  if (!isOwner || !editMode) {
    return (
      <TemplateRenderer
        site={{ ...site, template: site.template ?? "darkpremium" }}
        content={content}
        theme={theme}
        heroImageUrl={initialHeroImageUrl ?? site.heroImage}
        aboutImageUrl={site.aboutImage}
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

  function handleAboutImageChange(url: string | null) {
    setAboutImageUrl(url);
  }

  function handleServiceImagesChange(idx: number, url: string | undefined) {
    setServiceImages((prev) => {
      const updated = { ...prev };
      if (url === undefined) {
        delete updated[idx];
      } else {
        updated[idx] = url;
      }
      return updated;
    });
  }

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  function scrollToSection(anchor: string) {
    if (!anchor || !scrollContainerRef.current) return;
    const el = scrollContainerRef.current.querySelector(anchor);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const panelOpen = activePanel !== null;
  const BAR_H     = 52;
  const SIDEBAR_W = 320;

  return (
    <div style={{
      position:      "fixed",
      top:            0, left: 0, right: 0, bottom: 0,
      display:       "flex",
      flexDirection: "column",
      overflow:      "hidden",
      zIndex:         200,
    }}>

      {/* ── TOOLBAR — full width, fixed height ─────────────────────────────── */}
      <div
        style={{
          height:         `${BAR_H}px`,
          flexShrink:      0,
          background:     "#0d0e10",
          borderBottom:   "1px solid rgba(255,255,255,0.08)",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          padding:        "0 1rem",
          gap:            "0.75rem",
          zIndex:          10,
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
                onClick={() => { setActivePanel(active ? null : tab); setAskBaileyOpen(false); }}
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
            onClick={() => { setActivePanel(null); setAskBaileyOpen(false); }}
            style={{
              fontSize:     "0.75rem",
              fontWeight:   (activePanel === null && !askBaileyOpen) ? 700 : 500,
              padding:      "5px 14px",
              borderRadius: "9px",
              border:       "none",
              cursor:       "pointer",
              background:   (activePanel === null && !askBaileyOpen) ? "rgba(255,255,255,0.08)" : "transparent",
              color:        (activePanel === null && !askBaileyOpen) ? "#f0f0f0" : "#9ca3af",
              transition:   "all 0.15s",
            }}
          >
            👁 Preview
          </button>
          {/* ── Ask Bailey toggle ── */}
          <button
            onClick={() => { setAskBaileyOpen((o) => !o); setActivePanel(null); }}
            style={{
              fontSize:     "0.75rem",
              fontWeight:   askBaileyOpen ? 700 : 500,
              padding:      "5px 14px",
              borderRadius: "9px",
              border:       askBaileyOpen ? "none" : "1px solid rgba(0,229,160,0.3)",
              cursor:       "pointer",
              background:   askBaileyOpen ? "#00e5a0" : "rgba(0,229,160,0.06)",
              color:        askBaileyOpen ? "#000"    : "#00e5a0",
              transition:   "all 0.15s",
              whiteSpace:   "nowrap",
            }}
          >
            💬 Ask Bailey ✦
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
            onClick={async (e) => {
              e.preventDefault();
              if (isSaving) return;
              const liveUrl = site.subdomainSlug
                ? `https://${site.subdomainSlug}.baileyagents.com`
                : `/sites/${siteId}`;
              hasChanges.current = true;
              await doSave(currentContent, currentTheme, currentTemplate);
              await new Promise<void>((r) => setTimeout(r, 1500));
              window.open(liveUrl, "_blank");
            }}
            style={{
              fontSize:        "0.7rem",
              fontWeight:       700,
              padding:         "5px 12px",
              borderRadius:    "8px",
              background:      isSaving ? "rgba(0,229,160,0.12)" : "rgba(255,255,255,0.06)",
              border:          isSaving ? "1px solid rgba(0,229,160,0.3)" : "1px solid rgba(255,255,255,0.10)",
              color:           isSaving ? "#00e5a0" : "#f0f0f0",
              textDecoration:  "none",
              transition:      "all 0.15s",
              cursor:          isSaving ? "not-allowed" : "pointer",
              opacity:         isSaving ? 0.75 : 1,
            }}
            className="hover:bg-white/10"
          >
            {isSaving ? "Saving…" : "View Live ↗"}
          </a>
        </div>
      </div>{/* end toolbar */}

      {/* ── MAIN AREA: sidebar + preview + ask bailey in a flex row ────────── */}
      <div style={{
        flex:          1,
        display:       "flex",
        flexDirection: "row",
        overflow:      "hidden",
        minHeight:      0,
      }}>

        {/* ── LEFT SIDEBAR — pushes preview to the right ───────────────────── */}
        {panelOpen && (
          <div style={{
            width:          `${SIDEBAR_W}px`,
            flexShrink:      0,
            height:         "100%",
            background:     "#111214",
            borderRight:    "1px solid rgba(255,255,255,0.07)",
            display:        "flex",
            flexDirection:  "column",
            overflow:       "hidden",
          }}>
            {activePanel === "themes" && (
              <div style={{ overflowY: "auto", flex: 1 }}>
                <ThemesPanel
                  currentThemeKey={currentThemeKey}
                  onSelectTheme={handleSelectTheme}
                  currentTemplate={currentTemplate}
                  onSelectTemplate={handleSelectTemplate}
                />
              </div>
            )}
            {activePanel === "content" && (
              <ContentPanel
                content={currentContent}
                onChange={handleContentChange}
                theme={currentTheme}
                onThemeChange={(t) => { hasChanges.current = true; setCurrentTheme(t); }}
                businessName={site.businessName}
                siteId={siteId}
                heroImageUrl={heroImageUrl}
                aboutImageUrl={aboutImageUrl}
                onHeroImageChange={handleHeroImageChange}
                onAboutImageChange={handleAboutImageChange}
                serviceImages={serviceImages}
                onServiceImagesChange={handleServiceImagesChange}
                industry={site.industry ?? "Other"}
                onScrollToSection={scrollToSection}
              />
            )}
          </div>
        )}

        {/* ── PREVIEW CANVAS — fills all remaining horizontal space ─────────── */}
        <div ref={scrollContainerRef} style={{
          flex:      1,
          height:    "100%",
          overflowY: "auto",
          minWidth:   0,
        }}>
          <TemplateRenderer
            site={{ ...site, template: currentTemplate, serviceImages }}
            content={currentContent}
            theme={currentTheme}
            heroImageUrl={heroImageUrl}
            aboutImageUrl={aboutImageUrl}
            isEditing={true}
          />
        </div>

        {/* ── RIGHT PANEL — Ask Bailey ──────────────────────────────────────── */}
        {askBaileyOpen && (
          <div style={{
            width:          `${SIDEBAR_W}px`,
            flexShrink:      0,
            height:         "100%",
            background:     "#111214",
            borderLeft:     "1px solid rgba(255,255,255,0.07)",
            display:        "flex",
            flexDirection:  "column",
            overflow:       "hidden",
          }}>
            <AskBailey
              siteData={{ content: currentContent, theme: currentTheme }}
              plan={plan}
              onPreview={(updated) => {
                const u = updated as { content?: unknown; theme?: unknown };
                if (u.content) setCurrentContent(u.content as StructuredSiteContent);
                if (u.theme)   setCurrentTheme(u.theme as ThemeConfig);
              }}
              onApply={(updated) => {
                const u = updated as { content?: unknown; theme?: unknown };
                hasChanges.current = true;
                if (u.content) setCurrentContent(u.content as StructuredSiteContent);
                if (u.theme)   setCurrentTheme(u.theme as ThemeConfig);
              }}
            />
          </div>
        )}

      </div>{/* end main area */}

    </div>
  );
}
