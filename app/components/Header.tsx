export default function Header() {
  return (
    <header className="w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* AgentVitals logo — icon + name + tagline */}
        <div className="flex items-end gap-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/agentvitals-icon.png"
            alt=""
            className="h-10 sm:h-12 w-auto mb-2 sm:mb-2"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800 leading-none">
              AgentVitals
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-400 tracking-wide leading-tight mt-0.5">
              The AI readiness check for hospital websites
            </p>
          </div>
        </div>

        {/* Brought to you by — hidden on mobile, shown on sm+ */}
        <p className="hidden sm:block text-[10px] uppercase tracking-widest text-slate-400 font-medium">
          Brought to you by Hello Health
        </p>
      </div>
    </header>
  );
}
