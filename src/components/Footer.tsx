export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--color-border)]">
      <div className="container-padded py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="text-center sm:text-left shrink-0">
            <p className="text-base font-extrabold text-[var(--color-foreground)] tracking-tight">
              monis<span className="text-[var(--color-muted)] font-normal">.rent</span>
            </p>
            <p className="text-xs text-[var(--color-muted)] mt-1.5">
              Office equipment rental in Bali, Indonesia 🌴
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-xs text-[var(--color-muted)]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--color-success)] shrink-0" />
              Free delivery in Bali
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--color-success)] shrink-0" />
              No minimum commitment
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--color-success)] shrink-0" />
              Cancel anytime
            </span>
          </div>

          <p className="text-xs text-[var(--color-muted)] shrink-0">
            © 2026 Desent Solutions · Bali, Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
