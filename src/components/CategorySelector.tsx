"use client";

import { useCallback } from "react";
import { useWorkspaceStore } from "@/store/workspace";
import { useShallow } from "zustand/react/shallow";
import { categories, getProductsByCategory } from "@/data/products";
import ProductCard from "./ProductCard";
import type { ProductCategory } from "@/types";

// Categories that require a desk to be selected first
const ACCESSORY_CATEGORIES = new Set<ProductCategory>([
  "monitor",
  "lamp",
  "plant",
  "accessory",
]);

export default function CategorySelector() {
  const { activeCategory, setActiveCategory, setup } = useWorkspaceStore(
    useShallow((s) => ({
      activeCategory: s.activeCategory,
      setActiveCategory: s.setActiveCategory,
      setup: s.setup,
    }))
  );

  const categoryInfo = categories.find((c) => c.id === activeCategory);
  const products = getProductsByCategory(activeCategory);
  const isAccessoryCategory = ACCESSORY_CATEGORIES.has(activeCategory as ProductCategory);
  const hasDeskSelected = !!setup.desk;

  /** Returns selection count for a given category derived from current setup */
  const getCategoryCount = useCallback(
    (catId: string): number => {
      if (catId === "desk") return setup.desk ? 1 : 0;
      if (catId === "chair") return setup.chair ? 1 : 0;
      return setup.accessories.filter((a) => a.category === catId).length;
    },
    [setup]
  );

  /** Returns true if a product is part of the current workspace setup */
  const isProductSelected = useCallback(
    (productId: string): boolean =>
      setup.desk?.id === productId ||
      setup.chair?.id === productId ||
      setup.accessories.some((a) => a.id === productId),
    [setup]
  );

  const activeCount = getCategoryCount(activeCategory);

  return (
    <div className="flex flex-col gap-3 max-h-[52vh] sm:max-h-[60vh] lg:max-h-[500px]">
      {/* ── Category Select ── */}
      <div className="form-field">
        <label htmlFor="category-select" className="form-label">
          <span>{categoryInfo?.emoji}</span>
          Category
          {activeCount > 0 && (
            <span className="ml-auto w-5 h-5 rounded-full bg-[var(--color-primary)] text-white text-[10px] flex items-center justify-center font-bold">
              {activeCount}
            </span>
          )}
        </label>
        <select
          id="category-select"
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
          className="form-select"
          aria-label="Select furniture category"
        >
          {categories.map((cat) => {
            const count = getCategoryCount(cat.id);
            return (
              <option key={cat.id} value={cat.id}>
                {cat.emoji} {cat.label}{count > 0 ? ` (${count})` : ""}
              </option>
            );
          })}
        </select>
      </div>

      {/* ── Product Panel ── */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl border-2 border-[var(--color-border)] shadow-xl overflow-hidden">
        {/* Panel header */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 shrink-0 border-b border-[var(--color-border)]">
          {categoryInfo?.selectionType === "multiple" && (
            <span className="inline-block text-[10px] font-bold text-[var(--color-primary)] bg-[var(--color-surface-hover)] px-2.5 py-0.5 rounded-full mb-1.5">
              Multiple selection
            </span>
          )}
          <p className="text-xs text-[var(--color-muted)] leading-relaxed">
            {categoryInfo?.description}
          </p>
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-3 sm:py-4">
          {isAccessoryCategory && !hasDeskSelected ? (
            <div className="flex flex-col items-center justify-center text-center py-12 px-6 gap-4">
              <span className="text-4xl">🪑</span>
              <p className="text-sm font-bold text-[var(--color-foreground)]">Pick a desk first!</p>
              <p className="text-xs text-[var(--color-muted)] leading-relaxed px-2">
                You need a desk before adding {categoryInfo?.label?.toLowerCase()}.
              </p>
              <button
                onClick={() => setActiveCategory("desk")}
                className="mt-2 px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold hover:bg-[var(--color-primary-hover)] transition-colors"
              >
                Choose a Desk →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:gap-3.5">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isSelected={isProductSelected(product.id)}
                  selectionType={categoryInfo?.selectionType ?? "single"}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
