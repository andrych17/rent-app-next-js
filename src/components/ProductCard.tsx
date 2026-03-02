"use client";

import { Check, Plus, Minus } from "lucide-react";
import { Product } from "@/types";
import { useWorkspaceStore } from "@/store/workspace";
import { useShallow } from "zustand/react/shallow";

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  selectionType: "single" | "multiple";
}

export default function ProductCard({
  product,
  isSelected,
  selectionType,
}: ProductCardProps) {
  const { setDesk, setChair, removeDesk, removeChair, toggleAccessory } = useWorkspaceStore(
    useShallow((s) => ({
      setDesk: s.setDesk,
      setChair: s.setChair,
      removeDesk: s.removeDesk,
      removeChair: s.removeChair,
      toggleAccessory: s.toggleAccessory,
    }))
  );

  const handleSelect = () => {
    if (product.category === "desk") {
      isSelected ? removeDesk() : setDesk(product);
    } else if (product.category === "chair") {
      isSelected ? removeChair() : setChair(product);
    } else {
      toggleAccessory(product);
    }
  };

  return (
    <button
      onClick={handleSelect}
      className={`relative flex flex-col items-center justify-center text-center rounded-2xl p-3 sm:p-4 transition-all duration-150 border-2 border-dashed ${
        isSelected
          ? "border-[var(--color-border-active)] bg-[rgba(61,61,61,0.05)] glow-selected"
          : "border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] hover:border-[rgba(61,61,61,0.3)]"
      }`}
    >
      <div
        className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
          isSelected
            ? "bg-[var(--color-primary)] text-white"
            : "bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-muted)]"
        }`}
      >
        {isSelected ? (
          selectionType === "multiple" ? (
            <Minus size={12} strokeWidth={3} />
          ) : (
            <Check size={12} strokeWidth={3} />
          )
        ) : (
          <Plus size={12} strokeWidth={2} />
        )}
      </div>

      <div className="text-3xl sm:text-4xl shrink-0 mb-2 sm:mb-3 drop-shadow-sm transition-transform hover:scale-110">
        {product.emoji}
      </div>
      
      <div className="flex flex-col items-center">
        <h3 className="font-bold text-xs text-[var(--color-foreground)] line-clamp-1">
          {product.name}
        </h3>
        
        <div className="mt-1 flex items-baseline gap-0.5">
          <span className="text-sm font-extrabold text-[var(--color-foreground)]">
            ${product.price}
          </span>
          <span className="text-[10px] font-medium text-[var(--color-muted)]">/mo</span>
        </div>
      </div>
    </button>
  );
}
