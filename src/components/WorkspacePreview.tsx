"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useWorkspaceStore } from "@/store/workspace";
import { useShallow } from "zustand/react/shallow";
import { Plus } from "lucide-react";

const itemAnim = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 20 },
  },
  exit: { opacity: 0, scale: 0.5, transition: { duration: 0.15 } },
};

function Hotspot({ x, y, label, onClick, visible, delay = 0 }: {
  x: number; y: number; label: string; onClick: () => void; visible: boolean; delay?: number;
}) {
  if (!visible) return null;
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      onClick={onClick}
      className="absolute flex items-center justify-center flex-col gap-2 px-6 py-4 rounded-xl bg-white/80 backdrop-blur border-2 border-dashed border-[var(--color-border)] shadow-sm hover:shadow-md hover:border-[var(--color-border-active)] transition-all text-xs font-bold text-[var(--color-foreground)] float-anim cursor-pointer z-20 whitespace-nowrap"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
    >
      <div className="flex items-center gap-2">
        <Plus size={14} strokeWidth={3} className="text-[var(--color-muted)]" />
        {label}
      </div>
    </motion.button>
  );
}

export default function WorkspacePreview() {
  const { setup, setActiveCategory } = useWorkspaceStore(
    useShallow((s) => ({ setup: s.setup, setActiveCategory: s.setActiveCategory }))
  );
  const { desk, chair, accessories } = setup;

  const acc = useMemo(() => {
    const monitors = accessories.filter((a) => a.category === "monitor");
    const plants = accessories.filter((a) => a.category === "plant");
    const ids = new Set(accessories.map((a) => a.id));
    return {
      monitors,
      plants,
      hasMonitor: monitors.length > 0,
      hasPlant: plants.length > 0,
      hasKeyboard: ids.has("acc-keyboard"),
      hasMouse: ids.has("acc-mouse"),
      hasHeadphones: ids.has("acc-headphones"),
      hasMat: ids.has("acc-mat"),
      hasLaptopStand: ids.has("acc-stand"),
      hasDeskLamp: ids.has("lamp-desk"),
      hasMonitorBar: ids.has("lamp-monitor"),
      hasFloorLamp: ids.has("lamp-floor"),
      hasCable: ids.has("acc-cable"),
    };
  }, [accessories]);

  const deskColor = useMemo(() => {
    if (!desk) return "#a08050";
    if (desk.id === "desk-standing") return "#8B6914";
    if (desk.id === "desk-minimal") return "#C4A35A";
    if (desk.id === "desk-lshape") return "#5C3A1E";
    return desk.color;
  }, [desk]);

  const deskLight = useMemo(() => {
    if (!desk) return "#c4a46a";
    if (desk.id === "desk-standing") return "#b88d30";
    if (desk.id === "desk-minimal") return "#dbc07a";
    if (desk.id === "desk-lshape") return "#84603e";
    return desk.color;
  }, [desk]);

  const chairColor = chair?.color ?? "#333";
  const chairLight = useMemo(() => {
    if (!chair) return "#555";
    if (chair.id === "chair-ergo") return "#2a2a4e";
    if (chair.id === "chair-executive") return "#4a3020";
    if (chair.id === "chair-scandi") return "#e0bb8a";
    return chair.color;
  }, [chair]);

  const dTopY = !desk ? 320 : desk.id === "desk-standing" ? 295 : desk.id === "desk-lshape" ? 315 : 320;
  const dBotY = desk?.id === "desk-standing" ? 320 : 341;

  return (
    <div className="relative w-full scene-gradient overflow-hidden" style={{ minHeight: "280px" }}>
      <Hotspot x={72} y={16} label="Add Monitor!" onClick={() => setActiveCategory("monitor")} visible={!!desk && acc.monitors.length < 3} delay={0.3} />
      <Hotspot x={46} y={73} label="Add a Chair!" onClick={() => setActiveCategory("chair")} visible={!!desk && !chair} delay={0.2} />
      <Hotspot x={84} y={52} label="Place a Plant!" onClick={() => setActiveCategory("plant")} visible={!!desk && acc.plants.length < 3} delay={0.5} />
      <Hotspot x={72} y={52} label="Add Lamp!" onClick={() => setActiveCategory("lamp")} visible={!!desk && !acc.hasDeskLamp && !acc.hasMonitorBar && !acc.hasFloorLamp} delay={0.7} />

      <svg viewBox="0 0 1000 600" className="w-full h-auto" preserveAspectRatio="xMidYMid meet" style={{ minHeight: "280px" }}>
        <defs>
          <radialGradient id="platformGrad" cx="50%" cy="40%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.06)" />
          </radialGradient>
          <radialGradient id="floorLampGlow">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="500" cy="520" rx="420" ry="80" fill="var(--color-platform)" />
        <ellipse cx="500" cy="520" rx="420" ry="80" fill="url(#platformGrad)" />
        <ellipse cx="500" cy="515" rx="410" ry="72" fill="var(--color-scene-bg)" />
        <ellipse cx="500" cy="490" rx="260" ry="25" fill="rgba(0,0,0,0.06)" />

        <AnimatePresence>
          {acc.hasFloorLamp && (
            <motion.g key="floor-lamp" variants={itemAnim} initial="hidden" animate="visible" exit="exit">
              <rect x="165" y="220" width="4" height="270" rx="2" fill="#9ca3af" />
              <ellipse cx="167" cy="490" rx="22" ry="7" fill="#7a7a7a" />
              <path d="M140 210 L167 226 L194 210 L190 188 Q167 178 144 188 Z" fill="#f5e6b8" opacity="0.9" />
              <circle cx="167" cy="210" r="35" fill="url(#floorLampGlow)" opacity="0.15" />
            </motion.g>
          )}

          {desk && (
            <motion.g key={`desk-${desk.id}`} variants={itemAnim} initial="hidden" animate="visible" exit="exit">
              {desk.id === "desk-lshape" ? (
                <g>
                  <path d="M270 320 L640 320 L640 340 L530 340 L530 410 L510 410 L510 340 L270 340 Z" fill={deskColor} />
                  <path d="M270 320 L640 320 L640 326 L270 326 Z" fill={deskLight} opacity="0.5" />
                  <path d="M510 340 L640 340 L640 410 L510 410 Z" fill={deskColor} opacity="0.9" />
                  <rect x="285" y="342" width="80" height="100" rx="3" fill={deskColor} opacity="0.75" />
                  <rect x="295" y="355" width="60" height="12" rx="2" fill="rgba(0,0,0,0.1)" />
                  <rect x="295" y="375" width="60" height="12" rx="2" fill="rgba(0,0,0,0.1)" />
                  <rect x="295" y="395" width="60" height="12" rx="2" fill="rgba(0,0,0,0.1)" />
                  <rect x="318" y="358" width="14" height="3" rx="1.5" fill="rgba(255,255,255,0.2)" />
                  <rect x="318" y="378" width="14" height="3" rx="1.5" fill="rgba(255,255,255,0.2)" />
                  <rect x="318" y="398" width="14" height="3" rx="1.5" fill="rgba(255,255,255,0.2)" />
                  <rect x="508" y="340" width="6" height="145" fill="rgba(0,0,0,0.15)" rx="1" />
                  <rect x="630" y="410" width="6" height="75" fill="rgba(0,0,0,0.15)" rx="1" />
                </g>
              ) : desk.id === "desk-standing" ? (
                <g>
                  <rect x="280" y="300" width="360" height="20" rx="4" fill={deskColor} />
                  <rect x="280" y="300" width="360" height="6" rx="3" fill={deskLight} opacity="0.4" />
                  <rect x="300" y="320" width="10" height="165" fill="#5a5a5a" rx="2" />
                  <rect x="610" y="320" width="10" height="165" fill="#5a5a5a" rx="2" />
                  <rect x="298" y="335" width="14" height="28" rx="4" fill="#444" />
                  <rect x="608" y="335" width="14" height="28" rx="4" fill="#444" />
                  <rect x="288" y="483" width="34" height="5" rx="2.5" fill="#5a5a5a" />
                  <rect x="598" y="483" width="34" height="5" rx="2.5" fill="#5a5a5a" />
                  <circle cx="320" cy="316" r="3" fill="#22c55e" opacity="0.8" />
                </g>
              ) : (
                <g>
                  <rect x="300" y="325" width="320" height="16" rx="3" fill={deskColor} />
                  <rect x="300" y="325" width="320" height="5" rx="2" fill={deskLight} opacity="0.35" />
                  <polygon points="318,341 326,341 322,488 314,488" fill={deskColor} opacity="0.7" />
                  <polygon points="595,341 603,341 608,488 600,488" fill={deskColor} opacity="0.7" />
                </g>
              )}
            </motion.g>
          )}

          {acc.hasMat && desk && (
            <motion.g key="mat" variants={itemAnim} initial="hidden" animate="visible" exit="exit">
              <rect x="350" y={desk.id === "desk-standing" ? 294 : desk.id === "desk-lshape" ? 312 : 319} width="230" height="12" rx="3" fill="#4a4a4a" opacity="0.5" />
            </motion.g>
          )}

          {acc.hasMonitor && desk && (
            <motion.g key="monitors" variants={itemAnim} initial="hidden" animate="visible" exit="exit">
              {acc.monitors.map((monitor, i) => {
                const spacing = monitor.id === "monitor-34" ? 150 : monitor.id === "monitor-portable" ? 90 : 120;
                const startX = 460 - ((acc.monitors.length - 1) * spacing) / 2;
                const x = startX + i * spacing;

                if (monitor.id === "monitor-34") {
                  return (
                    <g key={monitor.id}>
                      <rect x={x - 70} y={dTopY - 80} width="140" height="76" rx="5" fill="#222" stroke="#444" strokeWidth="2" />
                      <rect x={x - 64} y={dTopY - 76} width="128" height="65" rx="3" fill="#1a2332" />
                      <rect x={x - 56} y={dTopY - 68} width="45" height="2.5" rx="1" fill="#5b9bd5" opacity="0.6" />
                      <rect x={x - 56} y={dTopY - 62} width="65" height="2.5" rx="1" fill="#a78bfa" opacity="0.4" />
                      <rect x={x - 56} y={dTopY - 56} width="38" height="2.5" rx="1" fill="#34d399" opacity="0.5" />
                      <rect x={x - 56} y={dTopY - 50} width="55" height="2.5" rx="1" fill="#f472b6" opacity="0.35" />
                      <rect x={x - 56} y={dTopY - 44} width="48" height="2.5" rx="1" fill="#5b9bd5" opacity="0.5" />
                      <rect x={x - 56} y={dTopY - 38} width="30" height="2.5" rx="1" fill="#a78bfa" opacity="0.3" />
                      <rect x={x - 5} y={dTopY - 4} width="10" height="10" fill="#444" />
                      <rect x={x - 18} y={dTopY + 3} width="36" height="5" rx="2.5" fill="#444" />
                    </g>
                  );
                }
                if (monitor.id === "monitor-portable") {
                  return (
                    <g key={monitor.id}>
                      <rect x={x - 32} y={dTopY - 52} width="64" height="48" rx="3" fill="#2a2a2a" stroke="#444" strokeWidth="1.5" />
                      <rect x={x - 27} y={dTopY - 48} width="54" height="40" rx="2" fill="#1a2332" />
                      <rect x={x - 20} y={dTopY - 40} width="32" height="2" rx="1" fill="#60a5fa" opacity="0.5" />
                      <rect x={x - 20} y={dTopY - 35} width="22" height="2" rx="1" fill="#a78bfa" opacity="0.35" />
                    </g>
                  );
                }
                return (
                  <g key={monitor.id}>
                    <rect x={x - 50} y={dTopY - 75} width="100" height="65" rx="5" fill="#222" stroke="#444" strokeWidth="2" />
                    <rect x={x - 44} y={dTopY - 71} width="88" height="56" rx="3" fill="#1a2332" />
                    <rect x={x - 36} y={dTopY - 63} width="35" height="2.5" rx="1" fill="#5b9bd5" opacity="0.6" />
                    <rect x={x - 36} y={dTopY - 57} width="55" height="2.5" rx="1" fill="#34d399" opacity="0.4" />
                    <rect x={x - 36} y={dTopY - 51} width="30" height="2.5" rx="1" fill="#f472b6" opacity="0.35" />
                    <rect x={x - 36} y={dTopY - 45} width="45" height="2.5" rx="1" fill="#a78bfa" opacity="0.4" />
                    <rect x={x - 5} y={dTopY - 10} width="10" height="16" fill="#444" />
                    <ellipse cx={x} cy={dTopY + 3} rx="20" ry="6" fill="#444" />
                  </g>
                );
              })}
            </motion.g>
          )}

          {acc.hasMonitorBar && acc.hasMonitor && desk && (
            <motion.g key="monitor-bar" variants={itemAnim} initial="hidden" animate="visible" exit="exit">
              <rect x="410" y={dTopY - 82} width="100" height="5" rx="2.5" fill="#bbb" />
              <rect x="420" y={dTopY - 79} width="80" height="2" rx="1" fill="#fef3c7" opacity="0.7" />
            </motion.g>
          )}

          {acc.hasDeskLamp && desk && (
            <motion.g key="desk-lamp" variants={itemAnim} initial="hidden" animate="visible" exit="exit">
              {(() => {
                const lx = desk.id === "desk-lshape" ? 580 : 570;
                const ly = desk.id === "desk-lshape" ? 316 : dTopY;
                return (
                  <g>
                    <ellipse cx={lx} cy={ly} rx="14" ry="5" fill="#aaa" />
                    <line x1={lx} y1={ly} x2={lx - 12} y2={ly - 45} stroke="#aaa" strokeWidth="3.5" strokeLinecap="round" />
                    <line x1={lx - 12} y1={ly - 45} x2={lx + 12} y2={ly - 62} stroke="#aaa" strokeWidth="3.5" strokeLinecap="round" />
                    <rect x={lx + 4} y={ly - 68} width="24" height="10" rx="3" fill="#ccc" />
                    <rect x={lx + 7} y={ly - 60} width="18" height="3" rx="1.5" fill="#fef3c7" opacity="0.75" />
                    <path d={`M${lx + 8} ${ly - 58} L${lx - 5} ${ly - 10} L${lx + 30} ${ly - 10} Z`} fill="#fef3c7" opacity="0.04" />
                  </g>
                );
              })()}
            </motion.g>
          )}

          {acc.hasKeyboard && desk && (
            <motion.g key="keyboard" variants={itemAnim} initial="hidden" animate="visible" exit="exit">
              <rect x="405" y={dTopY - 14} width="90" height="12" rx="3" fill="#e8e8e8" stroke="#ccc" strokeWidth="1" />
              <rect x="412" y={dTopY - 11} width="76" height="2.5" rx="1" fill="#d0d0d0" />
              <rect x="412" y={dTopY - 7} width="76" height="2.5" rx="1" fill="#d0d0d0" />
            </motion.g>
          )}

          {acc.hasMouse && desk && (
            <motion.g key="mouse" variants={itemAnim} initial="hidden" animate="visible" exit="exit">
              <ellipse cx="520" cy={dTopY - 7} rx="9" ry="12" fill="#e0e0e0" stroke="#ccc" strokeWidth="1" />
              <rect x="519" y={dTopY - 16} width="2" height="6" rx="1" fill="#bbb" />
            </motion.g>
          )}

          {acc.hasLaptopStand && desk && (
            <motion.g key="laptop-stand" variants={itemAnim} initial="hidden" animate="visible" exit="exit">
              {(() => {
                const sx = acc.hasMonitor ? 350 : 420;
                return (
                  <g>
                    <polygon points={`${sx - 18},${dTopY} ${sx + 18},${dTopY} ${sx + 22},${dTopY - 24} ${sx - 22},${dTopY - 24}`} fill="#bbb" />
                    <rect x={sx - 26} y={dTopY - 40} width="52" height="32" rx="3" fill="#333" stroke="#555" strokeWidth="1" />
                    <rect x={sx - 21} y={dTopY - 36} width="42" height="25" rx="2" fill="#1a2332" />
                    <rect x={sx - 16} y={dTopY - 31} width="22" height="2" rx="1" fill="#60a5fa" opacity="0.5" />
                    <rect x={sx - 16} y={dTopY - 27} width="16" height="2" rx="1" fill="#34d399" opacity="0.35" />
                  </g>
                );
              })()}
            </motion.g>
          )}

          {acc.hasHeadphones && desk && (
            <motion.g key="headphones" variants={itemAnim} initial="hidden" animate="visible" exit="exit">
              {(() => {
                const hx = desk.id === "desk-lshape" ? 610 : 600;
                return (
                  <g>
                    <path d={`M${hx - 12} ${dTopY - 2} Q${hx} ${dTopY - 24} ${hx + 12} ${dTopY - 2}`} stroke="#333" strokeWidth="4" fill="none" />
                    <ellipse cx={hx - 12} cy={dTopY} rx="6" ry="9" fill="#333" />
                    <ellipse cx={hx + 12} cy={dTopY} rx="6" ry="9" fill="#333" />
                    <ellipse cx={hx - 12} cy={dTopY} rx="4" ry="6" fill="#444" />
                    <ellipse cx={hx + 12} cy={dTopY} rx="4" ry="6" fill="#444" />
                  </g>
                );
              })()}
            </motion.g>
          )}

          {acc.hasCable && desk && (
            <motion.g key="cable" variants={itemAnim} initial="hidden" animate="visible" exit="exit">
              <rect x="390" y={dBotY + 6} width="140" height="10" rx="3" fill="#777" opacity="0.4" />
              <path d={`M410 ${dBotY + 6} Q422 ${dBotY + 22} 435 ${dBotY + 12}`} stroke="#888" strokeWidth="1.5" fill="none" />
              <path d={`M480 ${dBotY + 6} Q492 ${dBotY + 20} 505 ${dBotY + 12}`} stroke="#888" strokeWidth="1.5" fill="none" />
            </motion.g>
          )}

          {chair && (
            <motion.g key={`chair-${chair.id}`} variants={itemAnim} initial="hidden" animate="visible" exit="exit">
              {chair.id === "chair-ergo" ? (
                <g>
                  <path d="M400 405 L520 405 L515 428 L405 428 Z" fill={chairColor} />
                  <path d="M405 400 L515 400 L515 408 L405 408 Z" fill={chairColor} opacity="0.85" />
                  <path d="M412 400 L412 318 Q460 304 508 318 L508 400 Z" fill={chairColor} opacity="0.85" />
                  {[330, 345, 360, 375, 390].map((ly) => (
                    <line key={ly} x1="420" y1={ly} x2="500" y2={ly} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                  ))}
                  {[430, 450, 470, 490].map((lx) => (
                    <line key={lx} x1={lx} y1="315" x2={lx} y2="395" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  ))}
                  <path d="M420 365 Q460 375 500 365" stroke="rgba(255,255,255,0.12)" strokeWidth="2" fill="none" />
                  <rect x="395" y="385" width="10" height="5" rx="2.5" fill="#555" />
                  <rect x="515" y="385" width="10" height="5" rx="2.5" fill="#555" />
                  <rect x="398" y="390" width="4" height="18" rx="1" fill="#555" />
                  <rect x="518" y="390" width="4" height="18" rx="1" fill="#555" />
                  <rect x="456" y="428" width="8" height="22" fill="#5a5a5a" rx="2" />
                  <line x1="460" y1="450" x2="415" y2="484" stroke="#555" strokeWidth="5" strokeLinecap="round" />
                  <line x1="460" y1="450" x2="505" y2="484" stroke="#555" strokeWidth="5" strokeLinecap="round" />
                  <line x1="460" y1="450" x2="460" y2="488" stroke="#555" strokeWidth="5" strokeLinecap="round" />
                  <circle cx="415" cy="486" r="5" fill="#444" />
                  <circle cx="505" cy="486" r="5" fill="#444" />
                  <circle cx="460" cy="490" r="5" fill="#444" />
                </g>
              ) : chair.id === "chair-executive" ? (
                <g>
                  <path d="M400 408 L520 408 L515 430 L405 430 Z" fill={chairColor} />
                  <path d="M408 408 L408 295 Q460 282 512 295 L512 408 Z" fill={chairColor} />
                  <rect x="425" y="288" width="70" height="20" rx="10" fill={chairColor} />
                  {[325, 348, 371, 394].map((ly) => (
                    <path key={ly} d={`M425 ${ly} Q460 ${ly + 5} 495 ${ly}`} stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />
                  ))}
                  <rect x="390" y="383" width="16" height="7" rx="3.5" fill="#555" />
                  <rect x="514" y="383" width="16" height="7" rx="3.5" fill="#555" />
                  <rect x="396" y="390" width="4" height="18" rx="1" fill="#666" />
                  <rect x="520" y="390" width="4" height="18" rx="1" fill="#666" />
                  <rect x="456" y="430" width="8" height="20" fill="#5a5a5a" rx="2" />
                  <line x1="460" y1="450" x2="410" y2="484" stroke="#555" strokeWidth="6" strokeLinecap="round" />
                  <line x1="460" y1="450" x2="510" y2="484" stroke="#555" strokeWidth="6" strokeLinecap="round" />
                  <line x1="460" y1="450" x2="460" y2="488" stroke="#555" strokeWidth="6" strokeLinecap="round" />
                  <circle cx="410" cy="486" r="6" fill="#444" />
                  <circle cx="510" cy="486" r="6" fill="#444" />
                  <circle cx="460" cy="490" r="6" fill="#444" />
                </g>
              ) : (
                <g>
                  <ellipse cx="460" cy="415" rx="48" ry="14" fill={chairColor} />
                  <path d="M422 415 L422 352 Q460 340 498 352 L498 415" stroke={chairLight} strokeWidth="4.5" fill="none" />
                  <line x1="426" y1="368" x2="494" y2="368" stroke={chairLight} strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="426" y1="385" x2="494" y2="385" stroke={chairLight} strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="425" y1="428" x2="412" y2="488" stroke={chairLight} strokeWidth="4.5" strokeLinecap="round" />
                  <line x1="495" y1="428" x2="508" y2="488" stroke={chairLight} strokeWidth="4.5" strokeLinecap="round" />
                  <line x1="440" y1="428" x2="433" y2="488" stroke={chairLight} strokeWidth="4.5" strokeLinecap="round" />
                  <line x1="480" y1="428" x2="487" y2="488" stroke={chairLight} strokeWidth="4.5" strokeLinecap="round" />
                </g>
              )}
            </motion.g>
          )}

          {acc.hasPlant && (
            <motion.g key="plants" variants={itemAnim} initial="hidden" animate="visible" exit="exit">
              {acc.plants.map((plant, i) => {
                const xOff = 700 + i * 55;
                return (
                  <g key={plant.id}>
                    <path d={`M${xOff - 16} 415 L${xOff - 12} 485 L${xOff + 12} 485 L${xOff + 16} 415 Z`} fill="#b45309" />
                    <rect x={xOff - 18} y={409} width="36" height="9" rx="2.5" fill="#ca6f19" />
                    {plant.id === "plant-monstera" ? (
                      <g>
                        <ellipse cx={xOff} cy={370} rx="28" ry="34" fill="#166534" />
                        <ellipse cx={xOff - 14} cy={352} rx="20" ry="24" fill="#15803d" />
                        <ellipse cx={xOff + 12} cy={346} rx="17" ry="28" fill="#166534" />
                        <ellipse cx={xOff} cy={382} rx="22" ry="24" fill="#14532d" />
                      </g>
                    ) : plant.id === "plant-snake" ? (
                      <g>
                        <rect x={xOff - 3} y={340} width="6" height="75" rx="3" fill="#15803d" />
                        <rect x={xOff - 11} y={350} width="5" height="65" rx="3" fill="#166534" transform={`rotate(-8, ${xOff - 11}, 415)`} />
                        <rect x={xOff + 7} y={345} width="5" height="70" rx="3" fill="#14532d" transform={`rotate(6, ${xOff + 7}, 415)`} />
                      </g>
                    ) : (
                      <g>
                        <path d={`M${xOff} 410 Q${xOff - 28} 380 ${xOff - 18} 358`} stroke="#22c55e" strokeWidth="3" fill="none" />
                        <circle cx={xOff - 18} cy={355} r="7" fill="#22c55e" />
                        <path d={`M${xOff} 410 Q${xOff + 22} 375 ${xOff + 12} 348`} stroke="#16a34a" strokeWidth="3" fill="none" />
                        <circle cx={xOff + 12} cy={345} r="6" fill="#16a34a" />
                        <path d={`M${xOff} 410 Q${xOff - 32} 400 ${xOff - 28} 378`} stroke="#22c55e" strokeWidth="2.5" fill="none" />
                        <circle cx={xOff - 28} cy={375} r="5" fill="#22c55e" />
                      </g>
                    )}
                  </g>
                );
              })}
            </motion.g>
          )}
        </AnimatePresence>

        {!desk && (
          <g opacity="0.35">
            <rect x="280" y="310" width="360" height="22" rx="6" fill="none" stroke="#999" strokeWidth="2" strokeDasharray="8 5" />
            <text x="460" y="326" textAnchor="middle" fontSize="11" fill="#999" fontFamily="Inter, sans-serif">Drop a desk here</text>
          </g>
        )}
        {!chair && desk && (
          <g opacity="0.55">
            <rect x="405" y="395" width="110" height="80" rx="6" fill="rgba(200,196,190,0.18)" stroke="#aaa" strokeWidth="2" strokeDasharray="8 5" />
            <text x="460" y="432" textAnchor="middle" fontSize="12" fontWeight="700" fill="#888" fontFamily="Inter, sans-serif">🪑</text>
            <text x="460" y="452" textAnchor="middle" fontSize="10" fontWeight="600" fill="#888" fontFamily="Inter, sans-serif">Add a chair</text>
          </g>
        )}
        {!acc.hasMonitor && desk && (
          <g opacity="0.45">
            <rect x="380" y="230" width="160" height="70" rx="6" fill="rgba(200,196,190,0.18)" stroke="#aaa" strokeWidth="2" strokeDasharray="8 5" />
            <text x="460" y="262" textAnchor="middle" fontSize="12" fontWeight="700" fill="#888" fontFamily="Inter, sans-serif">🖥️</text>
            <text x="460" y="280" textAnchor="middle" fontSize="10" fontWeight="600" fill="#888" fontFamily="Inter, sans-serif">Add monitors</text>
          </g>
        )}
        {!acc.hasPlant && desk && (
          <g opacity="0.45">
            <rect x="688" y="388" width="64" height="84" rx="6" fill="rgba(200,196,190,0.18)" stroke="#aaa" strokeWidth="2" strokeDasharray="8 5" />
            <text x="720" y="425" textAnchor="middle" fontSize="14" fontFamily="Inter, sans-serif">🌿</text>
            <text x="720" y="445" textAnchor="middle" fontSize="9" fontWeight="600" fill="#888" fontFamily="Inter, sans-serif">Plant</text>
          </g>
        )}

        {!desk && !chair && accessories.length === 0 && (
          <g>
            <text x="500" y="280" textAnchor="middle" fontSize="42" fontFamily="Inter, sans-serif">🏝️</text>
            <text x="500" y="315" textAnchor="middle" fontSize="16" fill="#888" fontWeight="600" fontFamily="Inter, sans-serif">
              Start building your dream workspace
            </text>
            <text x="500" y="340" textAnchor="middle" fontSize="12" fill="#aaa" fontFamily="Inter, sans-serif">
              Pick a desk from the panel to get started →
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
