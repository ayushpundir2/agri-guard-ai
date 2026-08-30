'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Sprout,
  Store,
  Building2,
  MapPin,
  Activity,
  BarChart3,
  ListOrdered,
  AlertTriangle,
  ShieldCheck,
  Waves
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-civic-ivory text-civic-charcoal font-sans selection:bg-civic-forest selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-civic-ivory/95 backdrop-blur-md border-b border-civic-neutral px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/agriguard-logo.png"
              alt="AgriGuard-AI Logo"
              className="h-10 w-auto object-contain shrink-0"
            />
          </Link>

          <Link
            href="/command-center"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-civic-forest hover:bg-civic-leaf text-white font-medium text-sm rounded-xl transition duration-150 shadow-sm"
          >
            <span>Command Center</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 px-6 border-b border-civic-neutral">
        {/* Subtle agricultural background layer */}
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#14532D_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-civic-forest/10 border border-civic-forest/20 text-civic-forest text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-civic-leaf animate-pulse" />
            <span>Civic Food Security System</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-civic-forest leading-[1.1] font-google">
            CITIES DEPEND ON FARMS <br className="hidden sm:inline" />
            <span className="text-civic-charcoal">THEY RARELY SEE.</span>
          </h1>

          <p className="text-lg sm:text-xl text-civic-charcoal/80 max-w-2xl mx-auto font-normal leading-relaxed font-google">
            Connecting peri-urban agricultural production with wholesale market flow to safeguard urban food security when climate disasters strike.
          </p>

          <div className="pt-6 flex justify-center">
            <Link
              href="/command-center"
              className="inline-flex items-center gap-3 px-8 py-4 bg-civic-forest hover:bg-civic-leaf text-white font-semibold rounded-xl text-base transition-all duration-200 shadow-md transform hover:-translate-y-0.5"
            >
              <span>EXPLORE AGRIGUARD</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Hidden Supply Chain Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-civic-leaf">
            The Invisible Network
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-civic-forest font-google">
            THE HIDDEN SUPPLY CHAIN
          </h2>
          <p className="text-sm sm:text-base text-civic-charcoal/70 max-w-xl mx-auto font-google">
            How produce moves silently from regional soil to the urban plate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative items-center">
          {/* Card 1 */}
          <div className="bg-civic-white p-8 rounded-2xl border border-civic-neutral shadow-civic space-y-4 flex flex-col items-center text-center relative group hover:border-civic-leaf/40 transition">
            <div className="w-14 h-14 rounded-full bg-civic-ivory flex items-center justify-center text-civic-leaf border border-civic-neutral">
              <Sprout className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-civic-forest font-google">Farm Production</h3>
              <p className="text-sm text-civic-charcoal/80 leading-relaxed font-google">
                Peri-urban agricultural parcels cultivate essential perishable and grain crops powering regional food supply.
              </p>
            </div>
          </div>

          {/* Flow Indicator 1 (Desktop) */}
          <div className="hidden md:flex absolute left-[31.5%] top-1/2 -translate-y-1/2 z-10 text-civic-leaf">
            <div className="w-8 h-8 rounded-full bg-civic-ivory border border-civic-neutral flex items-center justify-center shadow-xs">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-civic-white p-8 rounded-2xl border border-civic-neutral shadow-civic space-y-4 flex flex-col items-center text-center relative group hover:border-civic-leaf/40 transition">
            <div className="w-14 h-14 rounded-full bg-civic-ivory flex items-center justify-center text-civic-leaf border border-civic-neutral">
              <Store className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-civic-forest font-google">Wholesale Markets</h3>
              <p className="text-sm text-civic-charcoal/80 leading-relaxed font-google">
                Central wholesale yards (APMCs) aggregate daily yields, determining market price stability and distribution.
              </p>
            </div>
          </div>

          {/* Flow Indicator 2 (Desktop) */}
          <div className="hidden md:flex absolute left-[65%] top-1/2 -translate-y-1/2 z-10 text-civic-leaf">
            <div className="w-8 h-8 rounded-full bg-civic-ivory border border-civic-neutral flex items-center justify-center shadow-xs">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-civic-white p-8 rounded-2xl border border-civic-neutral shadow-civic space-y-4 flex flex-col items-center text-center relative group hover:border-civic-leaf/40 transition">
            <div className="w-14 h-14 rounded-full bg-civic-ivory flex items-center justify-center text-civic-leaf border border-civic-neutral">
              <Building2 className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-civic-forest font-google">Secure City Food Supply</h3>
              <p className="text-sm text-civic-charcoal/80 leading-relaxed font-google">
                Urban households receive uninterrupted food availability and price protection against systemic shocks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Disaster State Section */}
      <section className="bg-civic-terra text-white py-20 md:py-28 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-12 relative z-10">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-mono uppercase tracking-wider">
              <Waves className="w-4 h-4" />
              <span>Climate Vulnerability Alert</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight font-google">
              THEN THE WATER RISES.
            </h2>
            <p className="text-base sm:text-lg text-white/90 leading-relaxed font-google">
              When extreme flooding submerges agricultural zones, the supply link breaks long before food shortages manifest on urban shelves.
            </p>
          </div>

          {/* Stylized Disaster Map & Indicators */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/20 pb-4 gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-300" />
                <span className="font-mono text-sm font-bold tracking-wider uppercase">
                  Flood Impact Mapping • Active Disruption Zone
                </span>
              </div>
              <span className="px-3 py-1 bg-red-900/60 border border-red-400/40 text-red-200 text-xs font-mono rounded-md">
                SEVERITY: CRITICAL (HIGH INUNDATION)
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              {/* Stylized Map View Box */}
              <div className="lg:col-span-2 bg-neutral-900/40 rounded-xl p-6 border border-white/15 h-64 sm:h-72 relative flex flex-col justify-between overflow-hidden">
                {/* Visual grid / map overlay representation */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl" />
                <div className="absolute bottom-1/4 right-1/3 w-40 h-24 bg-red-500/10 rounded-full blur-lg" />

                <div className="relative z-10 flex justify-between items-start font-mono text-xs">
                  <span className="bg-black/50 px-2.5 py-1 rounded border border-white/10 text-white/80">
                    PUNE REGION • PARCEL OVERLAY
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    85% INUNDATED
                  </span>
                </div>

                <div className="relative z-10 grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-black/60 p-3 rounded-lg border border-white/10">
                    <div className="text-white/60 text-[10px]">AFFECTED CLUSTER</div>
                    <div className="font-bold text-white text-sm">Chakan Tomato Belt</div>
                  </div>
                  <div className="bg-black/60 p-3 rounded-lg border border-white/10">
                    <div className="text-white/60 text-[10px]">WHOLESALE IMPACT</div>
                    <div className="font-bold text-red-300 text-sm">Gultekdi APMC (-28%)</div>
                  </div>
                </div>
              </div>

              {/* Warning Indicator Cards */}
              <div className="space-y-4 font-mono text-xs">
                <div className="bg-black/30 p-4 rounded-xl border border-white/15 space-y-1">
                  <div className="text-amber-300 font-bold flex items-center justify-between">
                    <span>1. CROP INUNDATION</span>
                    <span>HIGH</span>
                  </div>
                  <p className="text-white/80 text-[11px] font-sans">
                    Critical agricultural parcels experience prolonged waterlogging during peak harvest.
                  </p>
                </div>

                <div className="bg-black/30 p-4 rounded-xl border border-white/15 space-y-1">
                  <div className="text-amber-300 font-bold flex items-center justify-between">
                    <span>2. SUPPLY DEFICIT</span>
                    <span>IMMINENT</span>
                  </div>
                  <p className="text-white/80 text-[11px] font-sans">
                    Wholesale arriving volume drops, causing regional price spikes for key perishables.
                  </p>
                </div>

                <div className="bg-black/30 p-4 rounded-xl border border-white/15 space-y-1">
                  <div className="text-amber-300 font-bold flex items-center justify-between">
                    <span>3. URBAN VULNERABILITY</span>
                    <span>ELEVATED</span>
                  </div>
                  <p className="text-white/80 text-[11px] font-sans">
                    Urban centers face food availability risks without early intervention and targeted recovery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Features Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-civic-leaf">
            System Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-civic-forest font-google">
            INTRODUCING AGRIGUARD
          </h2>
          <p className="text-sm sm:text-base text-civic-charcoal/70 max-w-xl mx-auto font-google">
            An end-to-end intelligence platform for monitoring, simulating, and mitigating food supply risks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="bg-civic-white p-6 rounded-2xl border border-civic-neutral shadow-civic space-y-4 flex flex-col justify-between group hover:border-civic-leaf/40 transition">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-civic-ivory flex items-center justify-center text-civic-forest border border-civic-neutral">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-civic-forest font-google">Map & Trace</h3>
              <p className="text-xs text-civic-charcoal/80 leading-relaxed font-google">
                Interactively map agricultural parcels, crop types, and physical supply lines connecting peri-urban farms to municipal wholesale markets.
              </p>
            </div>
            <div className="pt-2 border-t border-civic-neutral text-[11px] font-mono text-civic-leaf font-semibold">
              01 / GEOSPATIAL INTELLIGENCE
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-civic-white p-6 rounded-2xl border border-civic-neutral shadow-civic space-y-4 flex flex-col justify-between group hover:border-civic-leaf/40 transition">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-civic-ivory flex items-center justify-center text-civic-forest border border-civic-neutral">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-civic-forest font-google">Simulate Impact</h3>
              <p className="text-xs text-civic-charcoal/80 leading-relaxed font-google">
                Run flood scenario models to quantify exact parcel inundation levels, crop damage estimates, and yield loss projections.
              </p>
            </div>
            <div className="pt-2 border-t border-civic-neutral text-[11px] font-mono text-civic-leaf font-semibold">
              02 / DISASTER SIMULATION
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-civic-white p-6 rounded-2xl border border-civic-neutral shadow-civic space-y-4 flex flex-col justify-between group hover:border-civic-leaf/40 transition">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-civic-ivory flex items-center justify-center text-civic-forest border border-civic-neutral">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-civic-forest font-google">Quantify Risk</h3>
              <p className="text-xs text-civic-charcoal/80 leading-relaxed font-google">
                Evaluate market exposure scores and city risk indices to measure potential urban food supply deficits in real time.
              </p>
            </div>
            <div className="pt-2 border-t border-civic-neutral text-[11px] font-mono text-civic-leaf font-semibold">
              03 / SUPPLY RISK ANALYSIS
            </div>
          </div>

          {/* Feature 4 */}
          <div className="bg-civic-white p-6 rounded-2xl border border-civic-neutral shadow-civic space-y-4 flex flex-col justify-between group hover:border-civic-leaf/40 transition">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-civic-ivory flex items-center justify-center text-civic-forest border border-civic-neutral">
                <ListOrdered className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-civic-forest font-google">Rank Recovery</h3>
              <p className="text-xs text-civic-charcoal/80 leading-relaxed font-google">
                Prioritize emergency relief and agricultural recovery resources based on cultivation evidence, vulnerability, and city impact.
              </p>
            </div>
            <div className="pt-2 border-t border-civic-neutral text-[11px] font-mono text-civic-leaf font-semibold">
              04 / ACTIONABLE PRIORITIZATION
            </div>
          </div>
        </div>
      </section>

      {/* Final Call To Action Section */}
      <section className="py-24 px-6 bg-civic-ivory border-t border-civic-neutral text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="w-12 h-12 rounded-full bg-civic-forest/10 border border-civic-forest/20 text-civic-forest flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-civic-forest leading-tight font-google">
            PROTECTING A CITY'S FOOD SUPPLY STARTS OUTSIDE THE CITY.
          </h2>

          <p className="text-base sm:text-lg text-civic-charcoal/80 max-w-2xl mx-auto font-normal leading-relaxed font-google">
            Access the AgriGuard-AI Command Center to analyze regional food security and make data-driven emergency management decisions.
          </p>

          <div className="pt-2">
            <Link
              href="/command-center"
              className="inline-flex items-center gap-3 px-8 py-4 bg-civic-forest hover:bg-civic-leaf text-white font-semibold rounded-xl text-base transition-all duration-200 shadow-md transform hover:-translate-y-0.5"
            >
              <span>EXPLORE AGRIGUARD</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-civic-neutral text-xs font-mono text-civic-charcoal/60 bg-civic-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img
              src="/agriguard-emblem.png"
              alt="AgriGuard Emblem"
              className="w-5 h-5 object-contain shrink-0"
            />
            <span className="font-bold text-civic-forest">AgriGuard-AI</span>
            <span>• Civic Food System Intelligence</span>
          </div>
          <div>Pune Prototype Region</div>
        </div>
      </footer>
    </div>
  );
}
