"use client";

import Header from "@/components/Header";
import WorkspacePreview from "@/components/WorkspacePreview";
import CategorySelector from "@/components/CategorySelector";
import CheckoutPanel from "@/components/CheckoutPanel";
import FloatingCart from "@/components/FloatingCart";
import RentCTA from "@/components/RentCTA";
import LifestyleZones from "@/components/LifestyleZones";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[var(--color-background)]">
      <Header />
      <main className="flex-1 w-full">
        <div className="container-padded flex flex-col">
          {/* Scene: Category Selector + Workspace Preview */}
          <div className="relative w-full flex flex-col lg:flex-row items-stretch lg:items-start gap-4 sm:gap-6 lg:gap-8">
            {/* Left panel: Category Selector */}
            <div className="w-full lg:w-[360px] xl:w-[400px] shrink-0 z-10 pt-3 sm:pt-4">
              <CategorySelector />
            </div>

            {/* Right panel: Workspace Scene */}
            <div className="flex-1 relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[var(--color-border)] shadow-sm bg-white min-h-[280px] sm:min-h-[380px] lg:min-h-[500px]">
              <WorkspacePreview />
            </div>
          </div>

          {/* RentCTA — centered below scene */}
          <RentCTA />

          {/* Lifestyle Zones */}
          <div className="w-full pt-8 sm:pt-12 pb-12 sm:pb-16 lg:pb-20">
            <LifestyleZones />
          </div>
        </div>
      </main>
      <Footer />
      <FloatingCart />
      <CheckoutPanel />
    </div>
  );
}
