"use client";

export default function Header() {
  return (
    <header className="container-padded text-center py-6 sm:py-8 lg:py-10">
      <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--color-foreground)] tracking-tight leading-tight">
        Design Your Workspace!
      </h1>
      <p className="text-xs sm:text-sm text-[var(--color-muted)] mt-2 sm:mt-2.5 font-medium tracking-widest uppercase">
        — Create Your Perfect Setup! —
      </p>
    </header>
  );
}
