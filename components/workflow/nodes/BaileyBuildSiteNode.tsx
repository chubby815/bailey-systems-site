'use client'
import { useCallback } from 'react'
import { Handle, Position, useReactFlow } from '@xyflow/react'
import type { Node, NodeProps } from '@xyflow/react'

const COLOR = '#00e5a0'

const INDUSTRIES = [
  'Landscaping', 'Plumbing', 'Electrician', 'Beauty & Wellness',
  'Restaurant', 'Consulting', 'Real Estate', 'Fitness',
  'Auto & Mechanic', 'Cleaning', 'Other',
]

const TONES = [
  'Professional', 'Friendly', 'Bold', 'Luxury', 'Minimal',
  'Cyberpunk', 'Retro', 'Magazine', 'Cinematic',
]

const COLORS = [
  'Emerald Green', 'Ocean Blue', 'Sunset Orange', 'Royal Purple',
  'Rose Gold', 'Crimson Red', 'Midnight Black', 'Arctic White',
  'Golden Yellow', 'Teal', 'Coral', 'Navy Blue', 'Forest Green',
  'Burnt Orange', 'Lavender', 'Hot Pink', 'Steel Blue',
  'Chocolate Brown', 'Lime Green', 'Champagne',
]

const FONT_STYLES = ['Modern', 'Classic & Elegant', 'Bold & Strong', 'Clean & Minimal']

const HERO_STYLES = ['Photo Background', 'Gradient Background', 'Solid Color']

type BaileyBuildSiteData = {
  label: string
  // Core
  businessName: string
  industry: string
  location: string
  services: string
  websiteVibe: string
  tagline: string
  description: string
  // Style
  tone: string
  primaryColor: string
  fontStyle: string
  heroStyle: string
  // Contact
  contactEmail: string
  contactPhone: string
}

type BaileyBuildSiteNodeType = Node<BaileyBuildSiteData, 'baileyBuildSite'>

const inputStyle: React.CSSProperties = {
  width: '100%', background: '#111214', border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '6px', padding: '0.35rem 0.5rem', color: '#f0f0f0',
  fontSize: '0.75rem', outline: 'none', boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  color: '#6b7280', display: 'block', marginBottom: '0.15rem', fontSize: '0.7rem',
}

const sectionHeaderStyle: React.CSSProperties = {
  color: COLOR, fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '0.1em', marginBottom: '0.4rem', marginTop: '0.5rem',
  borderBottom: `1px solid ${COLOR}22`, paddingBottom: '0.2rem',
}

export function BaileyBuildSiteNode({ id, data, selected }: NodeProps<BaileyBuildSiteNodeType>) {
  const { updateNodeData } = useReactFlow()
  const update = useCallback(
    (patch: Partial<BaileyBuildSiteData>) => updateNodeData(id, patch),
    [id, updateNodeData],
  )

  return (
    <div style={{
      background: '#0d0e10', border: `1px solid ${selected ? COLOR : 'rgba(255,255,255,0.08)'}`,
      borderLeft: `3px solid ${COLOR}`, borderRadius: '10px', padding: '0.75rem',
      minWidth: '260px', maxWidth: '300px', fontFamily: 'Inter, sans-serif',
    }}>
      <Handle type="target" position={Position.Left} style={{ background: COLOR, border: `2px solid ${COLOR}`, width: 8, height: 8 }} />

      {/* Node header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <span style={{ background: `${COLOR}22`, color: COLOR, fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>Bailey AI</span>
        <span style={{ color: '#f0f0f0', fontWeight: 600, fontSize: '0.85rem' }}>{data.label}</span>
      </div>

      <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>

        {/* ── Core Info ── */}
        <div style={sectionHeaderStyle}>Core Info</div>

        <div>
          <label style={labelStyle}>Business Name</label>
          <input
            value={data.businessName || ''}
            onChange={e => update({ businessName: e.target.value })}
            className="nodrag nopan"
            placeholder="Joe's Plumbing"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Industry</label>
          <select
            value={data.industry || 'Plumbing'}
            onChange={e => update({ industry: e.target.value })}
            className="nodrag nopan"
            style={inputStyle}
          >
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Location</label>
          <input
            value={data.location || ''}
            onChange={e => update({ location: e.target.value })}
            className="nodrag nopan"
            placeholder="Chicago, IL"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Services</label>
          <textarea
            value={data.services || ''}
            onChange={e => update({ services: e.target.value })}
            className="nodrag nopan"
            rows={2}
            placeholder="Drain cleaning, pipe repair, emergency service"
            style={{ ...inputStyle, resize: 'none' }}
          />
        </div>

        <div>
          <label style={labelStyle}>Website Vibe</label>
          <textarea
            value={data.websiteVibe || ''}
            onChange={e => update({ websiteVibe: e.target.value })}
            className="nodrag nopan"
            rows={2}
            placeholder="Modern and trustworthy, focused on fast response times"
            style={{ ...inputStyle, resize: 'none' }}
          />
        </div>

        <div>
          <label style={labelStyle}>Tagline</label>
          <input
            value={data.tagline || ''}
            onChange={e => update({ tagline: e.target.value })}
            className="nodrag nopan"
            placeholder="Fast. Reliable. Local."
            style={inputStyle}
          />
        </div>

        {/* ── Style ── */}
        <div style={sectionHeaderStyle}>Style</div>

        <div>
          <label style={labelStyle}>Tone</label>
          <select
            value={data.tone || 'Professional'}
            onChange={e => update({ tone: e.target.value })}
            className="nodrag nopan"
            style={inputStyle}
          >
            {TONES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Primary Color</label>
          <select
            value={data.primaryColor || 'Emerald Green'}
            onChange={e => update({ primaryColor: e.target.value })}
            className="nodrag nopan"
            style={inputStyle}
          >
            {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Font Style</label>
          <select
            value={data.fontStyle || 'Modern'}
            onChange={e => update({ fontStyle: e.target.value })}
            className="nodrag nopan"
            style={inputStyle}
          >
            {FONT_STYLES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Hero Style</label>
          <select
            value={data.heroStyle || 'Gradient Background'}
            onChange={e => update({ heroStyle: e.target.value })}
            className="nodrag nopan"
            style={inputStyle}
          >
            {HERO_STYLES.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>

        {/* ── Contact ── */}
        <div style={sectionHeaderStyle}>Contact (optional)</div>

        <div>
          <label style={labelStyle}>Contact Email</label>
          <input
            value={data.contactEmail || ''}
            onChange={e => update({ contactEmail: e.target.value })}
            className="nodrag nopan"
            placeholder="joe@joesplumbing.com"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Contact Phone</label>
          <input
            value={data.contactPhone || ''}
            onChange={e => update({ contactPhone: e.target.value })}
            className="nodrag nopan"
            placeholder="(312) 555-0100"
            style={inputStyle}
          />
        </div>

        <span style={{ color: '#4b5563', fontSize: '0.65rem', marginTop: '0.25rem' }}>
          Site URL stored as {'{{siteUrl}}'}
        </span>
      </div>

      <Handle type="source" position={Position.Right} style={{ background: COLOR, border: `2px solid ${COLOR}`, width: 8, height: 8 }} />
    </div>
  )
}
