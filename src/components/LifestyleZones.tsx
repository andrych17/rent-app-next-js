"use client";

import { Lock } from "lucide-react";

interface ZoneItem {
  emoji: string;
  label: string;
}

interface LifestyleZone {
  title: string;
  items: ZoneItem[];
}

const zones: LifestyleZone[] = [
  {
    title: "Coffee Station",
    items: [
      { emoji: "☕", label: "Coffee Machine" },
      { emoji: "🖥️", label: "Mini Display" },
    ],
  },
  {
    title: "Outdoor Gear",
    items: [
      { emoji: "🏄", label: "Surfboard" },
      { emoji: "🏍️", label: "Motorcycle" },
    ],
  },
  {
    title: "Relax Zone",
    items: [
      { emoji: "☕", label: "Bean Bag" },
      { emoji: "🌿", label: "Hammock" },
    ],
  },
  {
    title: "Garage Space",
    items: [
      { emoji: "🔧", label: "Tool Shelf" },
      { emoji: "📦", label: "Storage Box" },
    ],
  },
];

export default function LifestyleZones() {
  return (
    <div className="w-full">
      {/* Section header */}
      <div className="mb-6 sm:mb-8 lg:mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-[var(--color-foreground)] tracking-tight">
            Explore Lifestyle Zones
          </h2>
          <p className="text-sm text-[var(--color-muted)] mt-2">
            More curated setups coming soon to Bali 🌴
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-muted)] bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-full px-4 py-2">
          Coming soon
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {zones.map((zone) => (
          <div
            key={zone.title}
            className="relative bg-white rounded-xl sm:rounded-2xl border border-[var(--color-border)] shadow-sm p-4 sm:p-6 overflow-hidden opacity-70"
          >
            {/* Coming soon overlay */}
            <div className="absolute inset-0 rounded-2xl bg-white/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center gap-2">
              <Lock size={20} className="text-[var(--color-muted)]" />
              <span className="text-xs font-bold text-[var(--color-muted)] tracking-wider uppercase">Coming Soon</span>
            </div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-[var(--color-foreground)] mb-5">
              {zone.title}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {zone.items.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-3.5 p-5 rounded-xl bg-[var(--color-surface)] border-2 border-dashed border-[var(--color-border)]"
                >
                  <span className="text-4xl">{item.emoji}</span>
                  <span className="text-xs text-[var(--color-muted)] font-bold text-center leading-tight px-1">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
