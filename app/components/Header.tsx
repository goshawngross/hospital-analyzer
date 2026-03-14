export default function Header() {
  return (
    <header className="w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* AgentVitals logo — icon + name + tagline */}
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/agentvitals-icon.png"
            alt=""
            className="h-8 sm:h-10 w-auto"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800 leading-tight">
              AgentVitals
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-400 tracking-wide leading-tight">
              The AI readiness check for hospital websites
            </p>
          </div>
        </div>

        {/* Partner logos — hidden on mobile, shown on sm+ */}
        <div className="hidden sm:flex items-center gap-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
            Brought to you by
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://hospitalwebsites.com"
              target="_blank"
              rel="noopener"
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hospitalwebsites-logo.webp"
                alt="HospitalWebsites.com"
                className="h-7 w-auto"
              />
            </a>
            <span className="text-slate-300 text-xs">&amp;</span>
            <a
              href="https://www.sparkle.health/"
              target="_blank"
              rel="noopener"
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/sparkle-logo.png"
                alt="Sparkle"
                className="h-7 w-auto"
              />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
