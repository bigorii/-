import React from 'react';
import { SchematicType } from '../types/study';

interface Props {
  type: SchematicType;
}

export const CircuitSchematic: React.FC<Props> = ({ type }) => {
  switch (type) {
    case 'equilateral-line':
      return (
        <svg viewBox="0 0 320 120" className="w-full max-w-[320px] h-auto mx-auto" role="img" aria-label="비대칭 3상 송전선로 등가선간거리 도해">
          <defs>
            <marker id="arrow-blue" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#1D4ED8" />
            </marker>
          </defs>
          {/* Triangle edges */}
          <line x1="72" y1="88" x2="248" y2="88" stroke="#64748B" strokeWidth="1.5" strokeDasharray="4 3" />
          <line x1="72" y1="88" x2="152" y2="26" stroke="#1D4ED8" strokeWidth="1.5" />
          <line x1="152" y1="26" x2="248" y2="88" stroke="#1D4ED8" strokeWidth="1.5" />
          {/* Conductor nodes */}
          <circle cx="152" cy="26" r="7" fill="#1D4ED8" />
          <circle cx="72" cy="88" r="7" fill="#0F172A" />
          <circle cx="248" cy="88" r="7" fill="#0F172A" />
          {/* Labels */}
          <text x="152" y="13" textAnchor="middle" className="fill-[#1D4ED8] text-[10px] font-mono font-semibold">A (r)</text>
          <text x="52" y="92" textAnchor="end" className="fill-[#0F172A] text-[10px] font-mono font-semibold">B</text>
          <text x="264" y="92" textAnchor="start" className="fill-[#0F172A] text-[10px] font-mono font-semibold">C</text>
          {/* Distances */}
          <text x="100" y="50" textAnchor="middle" className="fill-[#1D4ED8] text-[10px] font-mono">D₁₂ = 2m</text>
          <text x="214" y="50" textAnchor="middle" className="fill-[#1D4ED8] text-[10px] font-mono">D₃₁ = 8m</text>
          <text x="160" y="106" textAnchor="middle" className="fill-[#475569] text-[10px] font-mono">D₂₃ = 4m  →  Dₑ = ∛(2·4·8)</text>
        </svg>
      );

    case 'sag-catenary':
      return (
        <svg viewBox="0 0 320 120" className="w-full max-w-[320px] h-auto mx-auto" role="img" aria-label="전선 경간 및 이도 도해">
          {/* Towers */}
          <line x1="48" y1="20" x2="48" y2="104" stroke="#0F172A" strokeWidth="2.5" />
          <line x1="38" y1="30" x2="58" y2="30" stroke="#0F172A" strokeWidth="2" />
          <line x1="272" y1="20" x2="272" y2="104" stroke="#0F172A" strokeWidth="2.5" />
          <line x1="262" y1="30" x2="282" y2="30" stroke="#0F172A" strokeWidth="2" />
          {/* Reference horizontal line */}
          <line x1="48" y1="30" x2="272" y2="30" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4 3" />
          {/* Sag curve */}
          <path d="M 48 30 Q 160 112 272 30" fill="none" stroke="#1D4ED8" strokeWidth="2.2" />
          {/* Sag arrow */}
          <line x1="160" y1="30" x2="160" y2="70" stroke="#D97706" strokeWidth="1.8" />
          <polygon points="160,71 156,64 164,64" fill="#D97706" />
          <polygon points="160,30 156,37 164,37" fill="#D97706" />
          <text x="168" y="54" className="fill-[#D97706] text-[11px] font-mono font-bold">D (이도)</text>
          {/* Span S */}
          <line x1="48" y1="98" x2="272" y2="98" stroke="#475569" strokeWidth="1.2" />
          <rect x="128" y="88" width="64" height="16" fill="#F8FAFC" />
          <text x="160" y="100" textAnchor="middle" className="fill-[#0F172A] text-[10px] font-mono font-semibold">S = 200 m</text>
          <text x="208" y="74" className="fill-[#1D4ED8] text-[10px] font-mono">T = 2000 kg</text>
        </svg>
      );

    case 'ferranti-phasor':
      return (
        <svg viewBox="0 0 320 120" className="w-full max-w-[320px] h-auto mx-auto" role="img" aria-label="페란티 현상 벡터도">
          {/* Origin */}
          <circle cx="42" cy="86" r="3" fill="#0F172A" />
          {/* Vr horizontal */}
          <line x1="42" y1="86" x2="245" y2="86" stroke="#1D4ED8" strokeWidth="2.5" />
          <polygon points="248,86 239,82 239,90" fill="#1D4ED8" />
          <text x="150" y="104" textAnchor="middle" className="fill-[#1D4ED8] text-[11px] font-mono font-bold">Vᵣ (수전단 전압 &gt; Vₛ)</text>
          {/* Ic leading 90 deg */}
          <line x1="42" y1="86" x2="42" y2="28" stroke="#059669" strokeWidth="2" />
          <polygon points="42,24 38,33 46,33" fill="#059669" />
          <text x="48" y="34" className="fill-[#059669] text-[10px] font-mono font-semibold">I_c (진상 90°)</text>
          {/* jX*Ic drop opposite */}
          <line x1="205" y1="86" x2="245" y2="86" stroke="#D97706" strokeWidth="2.5" />
          <line x1="42" y1="86" x2="202" y2="62" stroke="#475569" strokeWidth="1.8" />
          <polygon points="205,61 196,58 198,66" fill="#475569" />
          <text x="130" y="62" className="fill-[#475569] text-[10px] font-mono font-semibold">Vₛ (송전단)</text>
          <line x1="205" y1="61" x2="245" y2="86" stroke="#D97706" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="235" y="64" className="fill-[#D97706] text-[10px] font-mono">jX·I_c</text>
        </svg>
      );

    case 'pi-network':
      return (
        <svg viewBox="0 0 320 120" className="w-full max-w-[320px] h-auto mx-auto" role="img" aria-label="4단자 파이형 등가회로">
          {/* Top rail */}
          <line x1="36" y1="34" x2="112" y2="34" stroke="#0F172A" strokeWidth="1.8" />
          <rect x="112" y="24" width="96" height="20" rx="3" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="1.8" />
          <text x="160" y="38" textAnchor="middle" className="fill-[#1D4ED8] text-[11px] font-mono font-bold">Z (직렬)</text>
          <line x1="208" y1="34" x2="284" y2="34" stroke="#0F172A" strokeWidth="1.8" />
          {/* Bottom rail */}
          <line x1="36" y1="96" x2="284" y2="96" stroke="#0F172A" strokeWidth="1.8" />
          {/* Shunt Y/2 left & right */}
          <line x1="84" y1="34" x2="84" y2="48" stroke="#0F172A" strokeWidth="1.5" />
          <rect x="70" y="48" width="28" height="34" rx="3" fill="#FFFFFF" stroke="#475569" strokeWidth="1.5" />
          <text x="84" y="69" textAnchor="middle" className="fill-[#0F172A] text-[10px] font-mono">Y/2</text>
          <line x1="84" y1="82" x2="84" y2="96" stroke="#0F172A" strokeWidth="1.5" />

          <line x1="236" y1="34" x2="236" y2="48" stroke="#0F172A" strokeWidth="1.5" />
          <rect x="222" y="48" width="28" height="34" rx="3" fill="#FFFFFF" stroke="#475569" strokeWidth="1.5" />
          <text x="236" y="69" textAnchor="middle" className="fill-[#0F172A] text-[10px] font-mono">Y/2</text>
          <line x1="236" y1="82" x2="236" y2="96" stroke="#0F172A" strokeWidth="1.5" />
          {/* Ports */}
          <circle cx="36" cy="34" r="3.5" fill="#1D4ED8" />
          <circle cx="36" cy="96" r="3.5" fill="#0F172A" />
          <circle cx="284" cy="34" r="3.5" fill="#1D4ED8" />
          <circle cx="284" cy="96" r="3.5" fill="#0F172A" />
          <text x="26" y="68" textAnchor="end" className="fill-[#1D4ED8] text-[11px] font-mono font-bold">Vₛ</text>
          <text x="294" y="68" textAnchor="start" className="fill-[#1D4ED8] text-[11px] font-mono font-bold">Vᵣ</text>
        </svg>
      );

    case 'percent-impedance':
      return (
        <svg viewBox="0 0 320 112" className="w-full max-w-[320px] h-auto mx-auto" role="img" aria-label="단락 고장 백분율 임피던스 단선결선도">
          {/* Generator */}
          <circle cx="44" cy="56" r="16" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          <text x="44" y="60" textAnchor="middle" className="fill-[#0F172A] text-[11px] font-mono font-bold">G</text>
          <line x1="60" y1="56" x2="106" y2="56" stroke="#0F172A" strokeWidth="2" />
          {/* %Z block */}
          <rect x="106" y="42" width="76" height="28" rx="4" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="2" />
          <text x="144" y="60" textAnchor="middle" className="fill-[#1D4ED8] text-[11px] font-mono font-bold">%Z = 20%</text>
          <line x1="182" y1="56" x2="256" y2="56" stroke="#0F172A" strokeWidth="2" />
          {/* Fault lightning F */}
          <path d="M 256 30 L 246 54 L 258 54 L 248 82" fill="none" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="268" y="46" className="fill-[#E11D48] text-[11px] font-mono font-bold">3상 단락 F</text>
          <text x="268" y="64" className="fill-[#475569] text-[10px] font-mono">P=100MVA</text>
        </svg>
      );

    case 'petersen-coil':
      return (
        <svg viewBox="0 0 320 124" className="w-full max-w-[320px] h-auto mx-auto" role="img" aria-label="소호리액터 중성점 접지 회로">
          {/* Star neutral */}
          <circle cx="64" cy="52" r="4" fill="#0F172A" />
          <line x1="64" y1="52" x2="36" y2="26" stroke="#0F172A" strokeWidth="1.8" />
          <line x1="64" y1="52" x2="36" y2="52" stroke="#0F172A" strokeWidth="1.8" />
          <line x1="64" y1="52" x2="36" y2="78" stroke="#0F172A" strokeWidth="1.8" />
          {/* Three lines */}
          <line x1="94" y1="24" x2="280" y2="24" stroke="#0F172A" strokeWidth="1.6" />
          <line x1="94" y1="52" x2="280" y2="52" stroke="#0F172A" strokeWidth="1.6" />
          <line x1="94" y1="80" x2="280" y2="80" stroke="#E11D48" strokeWidth="1.8" />
          {/* Neutral reactor L */}
          <line x1="64" y1="52" x2="64" y2="96" stroke="#1D4ED8" strokeWidth="1.8" />
          <rect x="46" y="70" width="36" height="22" rx="4" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="1.8" />
          <text x="64" y="85" textAnchor="middle" className="fill-[#1D4ED8] text-[10px] font-mono font-bold">L</text>
          <line x1="54" y1="104" x2="74" y2="104" stroke="#0F172A" strokeWidth="2" />
          <line x1="59" y1="109" x2="69" y2="109" stroke="#0F172A" strokeWidth="1.5" />
          <line x1="64" y1="92" x2="64" y2="104" stroke="#1D4ED8" strokeWidth="1.8" />
          {/* Capacitances */}
          <line x1="170" y1="24" x2="170" y2="104" stroke="#64748B" strokeWidth="1" strokeDasharray="3 2" />
          <rect x="150" y="42" width="40" height="18" rx="3" fill="#FFFFFF" stroke="#059669" strokeWidth="1.4" />
          <text x="170" y="55" textAnchor="middle" className="fill-[#059669] text-[10px] font-mono font-bold">3C</text>
          {/* Fault */}
          <line x1="252" y1="80" x2="252" y2="104" stroke="#E11D48" strokeWidth="2" />
          <text x="252" y="116" textAnchor="middle" className="fill-[#E11D48] text-[10px] font-mono font-bold">1선 지락 (I_L = I_c)</text>
        </svg>
      );

    case 'power-factor-triangle':
      return (
        <svg viewBox="0 0 320 120" className="w-full max-w-[320px] h-auto mx-auto" role="img" aria-label="역률 개선 전력 삼각형">
          {/* Base P */}
          <line x1="48" y1="96" x2="236" y2="96" stroke="#0F172A" strokeWidth="2.5" />
          <text x="142" y="112" textAnchor="middle" className="fill-[#0F172A] text-[11px] font-mono font-bold">P = 100 kW (일정)</text>
          {/* S1 and Q1 */}
          <line x1="48" y1="96" x2="236" y2="20" stroke="#64748B" strokeWidth="1.8" strokeDasharray="4 3" />
          <line x1="236" y1="96" x2="236" y2="20" stroke="#E11D48" strokeWidth="2" />
          {/* S2 and Q2 */}
          <line x1="48" y1="96" x2="236" y2="56" stroke="#1D4ED8" strokeWidth="2.2" />
          <line x1="236" y1="96" x2="236" y2="56" stroke="#059669" strokeWidth="2.5" />
          {/* Qc highlight */}
          <line x1="246" y1="20" x2="246" y2="56" stroke="#D97706" strokeWidth="2.5" />
          <text x="254" y="42" className="fill-[#D97706] text-[11px] font-mono font-bold">Q_c</text>
          <text x="254" y="80" className="fill-[#059669] text-[10px] font-mono font-semibold">Q₂</text>
          <text x="120" y="44" className="fill-[#64748B] text-[10px] font-mono">cosθ₁=0.6</text>
          <text x="142" y="84" className="fill-[#1D4ED8] text-[10px] font-mono font-semibold">cosθ₂=0.8</text>
        </svg>
      );

    case 'arrester-insulation':
      return (
        <svg viewBox="0 0 320 116" className="w-full max-w-[320px] h-auto mx-auto" role="img" aria-label="피뢰기 절연협조 레벨 도해">
          {/* Axes */}
          <line x1="42" y1="14" x2="42" y2="98" stroke="#475569" strokeWidth="1.5" />
          <line x1="42" y1="98" x2="296" y2="98" stroke="#475569" strokeWidth="1.5" />
          {/* BIL line */}
          <line x1="42" y1="26" x2="288" y2="26" stroke="#E11D48" strokeWidth="2" strokeDasharray="5 3" />
          <text x="288" y="21" textAnchor="end" className="fill-[#E11D48] text-[10px] font-mono font-bold">변압기 BIL (기준충격절연강도)</text>
          {/* Arrester discharge limit */}
          <rect x="92" y="54" width="160" height="22" rx="4" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="1.8" />
          <text x="172" y="69" textAnchor="middle" className="fill-[#1D4ED8] text-[10px] font-mono font-bold">피뢰기 제한전압 (더 낮아야 함)</text>
          {/* Margin arrow */}
          <line x1="172" y1="28" x2="172" y2="52" stroke="#059669" strokeWidth="2" />
          <text x="180" y="44" className="fill-[#059669] text-[10px] font-mono font-semibold">보호 여유</text>
          <text x="172" y="112" textAnchor="middle" className="fill-[#475569] text-[10px] font-mono">충격방전개시전압 ↓  |  상용주파 방전개시전압 ↑</text>
        </svg>
      );
  }
};
