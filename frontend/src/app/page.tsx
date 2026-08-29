import HealthBadge from '@/components/HealthBadge';
import MapView from '@/components/MapView';

export default function Home() {
  return (
    <main className="min-h-screen p-6 md:p-12 flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Header section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌾🛡️</span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              AgriGuard-AI Foundation
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            AI-powered City Food-Resilience Intelligence Platform (Prototype Target: Pune, India)
          </p>
        </div>
        <div>
          <HealthBadge />
        </div>
      </header>

      {/* Concept Architecture Flow */}
      <section className="bg-slate-800/40 border border-slate-800 rounded-xl p-6">
        <h2 className="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-3">
          Intelligence Cascade Chain
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center text-sm">
          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 font-medium">
            1. Agricultural Land
          </div>
          <div className="hidden md:flex items-center justify-center text-slate-500">→</div>
          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 font-medium">
            2. Disaster Event
          </div>
          <div className="hidden md:flex items-center justify-center text-slate-500">→</div>
          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 font-medium">
            3. Food Markets
          </div>
          <div className="hidden md:flex items-center justify-center text-slate-500">→</div>
          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 font-medium">
            4. Food-Supply Risk
          </div>
          <div className="hidden md:flex items-center justify-center text-slate-500">→</div>
          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 font-medium">
            5. Recovery Priorities
          </div>
        </div>
      </section>

      {/* Geospatial Map Container */}
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-slate-200">
          Target Prototype Region: Pune, Maharashtra
        </h2>
        <div className="h-[450px]">
          <MapView />
        </div>
      </section>

      {/* Foundation Status Footer */}
      <footer className="mt-auto border-t border-slate-800 pt-6 text-xs text-slate-500 flex flex-col md:flex-row justify-between gap-2">
        <p>AgriGuard-AI Foundation Setup — Ready for engine integration.</p>
        <p>Fund My Crazy — &ldquo;Surprise Us!&rdquo; Competition Entry</p>
      </footer>
    </main>
  );
}
