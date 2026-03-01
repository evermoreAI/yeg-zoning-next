'use client'

import type { DCZoneRules } from '@/lib/dcZoneExtractor'

interface Props {
  rules: DCZoneRules
}

export default function DCRulesPanel({ rules }: Props) {
  const {
    zone_code, purpose, permitted_uses, discretionary_uses,
    max_height, setback_front, setback_rear, setback_side,
    special_conditions, bylaw_ref, url, fetched_at,
  } = rules

  const hasSetbacks = setback_front || setback_rear || setback_side

  return (
    <div className="space-y-3">
      {/* DC zone amber header */}
      <div className="px-3 py-2 rounded-lg flex items-start gap-2"
           style={{ background: 'rgba(139,26,26,0.15)', border: '1px solid #8b1a1a' }}>
        <span className="text-[#cf6679] text-[11px] flex-shrink-0 mt-0.5">⚠</span>
        <div>
          <div className="text-[10px] font-bold text-[#cf6679] uppercase tracking-widest">
            Direct Control Zone — {zone_code}
          </div>
          <div className="text-[9px] text-[#8a5060] mt-0.5">
            Site-specific rules apply. Verify all development with City of Edmonton.
          </div>
        </div>
      </div>

      {/* Purpose */}
      {purpose && (
        <div>
          <div className="text-[9px] text-[#4a5568] uppercase tracking-[1.5px] mb-1">Purpose</div>
          <p className="text-[11px] text-[#b0a090] leading-relaxed">{purpose}</p>
        </div>
      )}

      {/* Permitted uses */}
      {permitted_uses.length > 0 && (
        <div>
          <div className="text-[9px] text-[#4a5568] uppercase tracking-[1.5px] mb-2">
            Permitted Uses
          </div>
          <div className="flex flex-wrap gap-1.5">
            {permitted_uses.map(u => (
              <span key={u}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium"
                    style={{ background: 'rgba(106,184,106,0.15)', color: '#6ab86a', border: '1px solid rgba(106,184,106,0.3)' }}>
                ✓ {u}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Discretionary uses */}
      {discretionary_uses.length > 0 && (
        <div>
          <div className="text-[9px] text-[#4a5568] uppercase tracking-[1.5px] mb-2">
            Discretionary Uses
          </div>
          <div className="flex flex-wrap gap-1.5">
            {discretionary_uses.map(u => (
              <span key={u}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium"
                    style={{ background: 'rgba(200,169,81,0.15)', color: '#c8a951', border: '1px solid rgba(200,169,81,0.3)' }}>
                ◈ {u}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Height */}
      {max_height && (
        <div className="p-2.5 rounded-lg" style={{ background: '#141820', border: '1px solid #2a2e38' }}>
          <div className="text-[9px] text-[#4a5568] uppercase tracking-[1.5px] mb-1">Max Height</div>
          <div className="text-[12px] text-[#e8e0d0]">{max_height}</div>
        </div>
      )}

      {/* Setbacks */}
      {hasSetbacks && (
        <div>
          <div className="text-[9px] text-[#4a5568] uppercase tracking-[1.5px] mb-2">Setbacks</div>
          <table className="w-full text-[10px]" style={{ borderCollapse: 'collapse' }}>
            <tbody>
              {[
                ['Front Yard',  setback_front],
                ['Rear Yard',   setback_rear],
                ['Side Yard',   setback_side],
              ].filter(([, v]) => v).map(([label, val]) => (
                <tr key={label as string} style={{ borderBottom: '1px solid #1e2530' }}>
                  <td className="py-1.5 text-[#6a7080]">{label}</td>
                  <td className="py-1.5 text-right text-[#e8e0d0]">{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Special conditions */}
      {special_conditions.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[9px] text-[#4a5568] uppercase tracking-[1.5px] mb-1">
            Special Conditions
          </div>
          {special_conditions.map((c, i) => (
            <div key={i} className="px-2.5 py-1.5 rounded-lg text-[9px] text-[#b09070] leading-relaxed"
                 style={{ background: 'rgba(200,169,81,0.08)', border: '1px solid rgba(200,169,81,0.2)' }}>
              {c}
            </div>
          ))}
        </div>
      )}

      {/* Bylaw ref + source link */}
      <div className="pt-2" style={{ borderTop: '1px solid #1e2530' }}>
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-[#3a4050]">{bylaw_ref}</span>
          <a href={url} target="_blank" rel="noopener noreferrer"
             className="text-[9px] text-[#c8a951] hover:text-[#e0bb5a] underline transition-colors">
            View full bylaw →
          </a>
        </div>
        <div className="text-[8px] text-[#2a3040] mt-0.5">
          Extracted {new Date(fetched_at).toLocaleDateString()} · Always verify with City of Edmonton
        </div>
      </div>
    </div>
  )
}
