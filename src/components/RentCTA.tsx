"use client";

import { useWorkspaceStore } from "@/store/workspace";

export default function RentCTA() {
  const setShowCheckout = useWorkspaceStore((s) => s.setShowCheckout);
  const total = useWorkspaceStore((s) => {
    const { setup } = s;
    return (
      (setup.desk?.price ?? 0) +
      (setup.chair?.price ?? 0) +
      setup.accessories.reduce((sum, a) => sum + a.price, 0)
    );
  });
  const count = useWorkspaceStore(
    (s) =>
      (s.setup.desk ? 1 : 0) +
      (s.setup.chair ? 1 : 0) +
      s.setup.accessories.length
  );
  const hasDeskSelected = useWorkspaceStore((s) => !!s.setup.desk);

  if (count === 0) return null;

  return (
    <div className="w-full flex flex-col items-center gap-3 py-8 sm:py-10">
      {/* Label */}
      <p className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[var(--color-muted)]">
        Ready to Rent?
      </p>

      {/* Summary pill */}
      {hasDeskSelected && (
        <p className="text-xs font-semibold text-[var(--color-foreground)] bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-full px-4 py-1.5">
          {count} item{count !== 1 ? "s" : ""} selected
          <span className="mx-2 text-[var(--color-border)]">·</span>
          <span className="font-extrabold">${total}/mo</span>
        </p>
      )}

      {/* CTA button */}
      <button
        onClick={() => setShowCheckout(true)}
        disabled={!hasDeskSelected}
        className={`w-full max-w-xs sm:max-w-sm btn-primary text-base sm:text-lg py-4 sm:py-5 rounded-2xl ${
          hasDeskSelected ? "pulse-cta" : "opacity-50 cursor-not-allowed"
        }`}
      >
        {hasDeskSelected ? (
          <>
            Rent Your Setup!
            <span className="opacity-60 font-semibold text-sm">— ${total}/mo</span>
          </>
        ) : (
          "Pick a desk to continue"
        )}
      </button>

      {/* Sub-note */}
      {!hasDeskSelected ? (
        <p className="text-xs font-semibold text-red-500 flex items-center gap-1.5">
          <span>⚠️</span> Select a desk to continue
        </p>
      ) : (
        <p className="text-xs text-[var(--color-muted)] font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] shrink-0" />
          Free delivery in Bali
        </p>
      )}
    </div>
  );
}
