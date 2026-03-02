"use client";

import { ShoppingCart } from "lucide-react";
import { useWorkspaceStore } from "@/store/workspace";

export default function FloatingCart() {
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

  if (count === 0) return null;

  return (
    <button
      onClick={() => setShowCheckout(true)}
      className="fixed bottom-5 right-4 sm:bottom-8 sm:right-6 z-40 flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-[var(--color-primary)] text-white font-bold shadow-xl hover:bg-[var(--color-primary-hover)] transition-colors lg:hidden"
    >
      <div className="relative">
        <ShoppingCart size={18} />
        <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-white text-[var(--color-primary)] text-[10px] flex items-center justify-center font-bold">
          {count}
        </span>
      </div>
      <div className="text-left">
        <p className="text-xs font-bold">Rent Setup</p>
        <p className="text-xs opacity-80">${total}/mo</p>
      </div>
    </button>
  );
}
