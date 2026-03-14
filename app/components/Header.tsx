export default function Header() {
  return (
    <header className="w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">
            Agentic Readiness Analyzer
          </h1>
          <p className="text-xs text-slate-500 tracking-wide">
            For Hospital &amp; Health System Websites
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
            Brought to you by
          </p>
          <p className="text-xs text-slate-600 font-medium">
            <a
              href="https://hospitalwebsites.com"
              target="_blank"
              rel="noopener"
              className="hover:text-blue-600 transition-colors"
            >
              HospitalWebsites.com
            </a>
            {" "}
            <span className="text-slate-300">&amp;</span>{" "}
            <a
              href="https://www.sparkle.health/"
              target="_blank"
              rel="noopener"
              className="hover:text-blue-600 transition-colors"
            >
              Sparkle
            </a>
          </p>
        </div>
      </div>
    </header>
  );
}
