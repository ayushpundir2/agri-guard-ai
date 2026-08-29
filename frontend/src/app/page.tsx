'use client';

import Link from 'next/link';
import { ArrowRight, ChevronDown, MapPin, Shield, Waves, Cpu, Sparkles, AlertTriangle } from 'lucide-react';

export default function LandingPage() {
  const scrollToSection = (id: string) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur border-b border-slate-800/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">🌾</span>
          <span className="text-sm font-bold tracking-tight font-mono text-white">AgriGuard-AI</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-400">
          <button onClick={() => scrollToSection('network')} className="hover:text-white transition cursor-pointer">
            How It Works
          </button>
          <button onClick={() => scrollToSection('problem')} className="hover:text-white transition cursor-pointer">
            The Problem
          </button>
          <button onClick={() => scrollToSection('solution')} className="hover:text-white transition cursor-pointer">
            The System
          </button>
          <button onClick={() => scrollToSection('priorities')} className="hover:text-white transition cursor-pointer">
            Recovery Priorities
          </button>
        </div>

        <Link
          href="/command-center"
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition font-mono"
        >
          <span>COMMAND CENTER</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </nav>

      {/* 1. Cinematic Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-between pt-32 pb-16 px-6 max-w-6xl mx-auto">
        <div className="my-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>CITY FOOD RESILIENCE INTELLIGENCE</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] text-white">
            CITIES DEPEND ON FARMS <br />
            <span className="text-slate-500">THEY RARELY SEE.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-2xl font-light leading-relaxed">
            When disaster strikes agricultural land, the impact doesn't stop at the farm. It moves through markets and reaches the city.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
            <Link
              href="/command-center"
              className="flex items-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition text-sm font-mono shadow-xl shadow-emerald-500/10"
            >
              <span>EXPLORE AGRIGUARD</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => scrollToSection('network')}
              className="flex items-center gap-2 px-6 py-4 text-slate-400 hover:text-white text-xs font-mono transition cursor-pointer"
            >
              <span>SEE HOW IT WORKS</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-t border-slate-900 pt-8 text-xs font-mono text-slate-500">
          <p>PROTOTYPE REGION: PUNE, MAHARASHTRA, INDIA</p>
          <p>FUND MY CRAZY — &ldquo;SURPRISE US!&rdquo; ENTRY</p>
        </div>
      </section>

      {/* 2. Visual Transition Section */}
      <section id="network" className="py-32 px-6 bg-slate-950 border-t border-slate-900">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <span className="text-xs uppercase font-mono tracking-widest text-emerald-400">
              The Invisible Network
            </span>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
              YOU SEE THE CITY. <br />
              <span className="text-slate-500">WE MAP WHAT FEEDS IT.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono text-xs">
            <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-2xl">🌾</span>
              <h3 className="text-sm font-bold text-white uppercase">1. Agricultural Land</h3>
              <p className="text-slate-400 leading-relaxed font-sans">
                Peri-urban cultivation parcels around Pune growing essential produce.
              </p>
            </div>

            <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-2xl">📦</span>
              <h3 className="text-sm font-bold text-white uppercase">2. Crop Yields</h3>
              <p className="text-slate-400 leading-relaxed font-sans">
                Perishable and grain crops (Tomatoes, Onions, Sugarcane, Wheat).
              </p>
            </div>

            <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-2xl">🏪</span>
              <h3 className="text-sm font-bold text-white uppercase">3. Wholesale Markets</h3>
              <p className="text-slate-400 leading-relaxed font-sans">
                Gultekdi APMC and regional collection yards distributing urban food.
              </p>
            </div>

            <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-2xl">🏙️</span>
              <h3 className="text-sm font-bold text-white uppercase">4. City Supply</h3>
              <p className="text-slate-400 leading-relaxed font-sans">
                Daily urban food availability and resilience for city residents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Moment Everything Changes (Disaster Inundation) */}
      <section id="problem" className="py-32 px-6 bg-gradient-to-b from-slate-950 via-cyan-950/20 to-slate-950 border-t border-slate-900">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono text-xs">
            <Waves className="w-3.5 h-3.5" />
            <span>DISRUPTION DETECTED</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-tight">
            THEN THE WATER RISES.
          </h2>

          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            A flood isn't just a farmer's problem. One flooded agricultural cluster can become a supply problem for markets — and eventually a food-security risk for the city.
          </p>

          <div className="p-8 bg-slate-900/80 border border-cyan-800/60 rounded-2xl font-mono text-xs space-y-4 max-w-xl mx-auto text-left">
            <div className="flex items-center justify-between text-cyan-300 font-bold uppercase border-b border-slate-800 pb-2">
              <span>Cascading Impact Chain</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="space-y-2 text-slate-300">
              <p className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold">1.</span> Flooded Farmland Inundation
              </p>
              <p className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">2.</span> Lost Agricultural Crop Yields
              </p>
              <p className="flex items-center gap-2">
                <span className="text-orange-400 font-bold">3.</span> Wholesale Market Supply Deficits
              </p>
              <p className="flex items-center gap-2">
                <span className="text-red-400 font-bold">4.</span> Urban Food Supply Risk & Price Volatility
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Introduce AgriGuard Solution */}
      <section id="solution" className="py-32 px-6 bg-slate-950 border-t border-slate-900">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <span className="text-xs uppercase font-mono tracking-widest text-emerald-400">
              The Intelligence Layer
            </span>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
              AGRIGUARD CONNECTS THE DOTS.
            </h2>
            <p className="text-base text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
              AgriGuard turns fragmented agricultural and disaster signals into a city-level picture of food resilience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs uppercase text-emerald-400 font-bold">01. GEOSPATIAL ANALYSIS</span>
              <h3 className="text-sm font-bold text-white">PostGIS Flood Intersection</h3>
              <p className="text-slate-400 font-sans leading-relaxed">
                Calculates exact parcel overlap percentages and affected cultivated acreage.
              </p>
            </div>

            <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs uppercase text-amber-400 font-bold">02. MARKET EXPOSURE</span>
              <h3 className="text-sm font-bold text-white">Wholesale Supply Vulnerability</h3>
              <p className="text-slate-400 font-sans leading-relaxed">
                Models parcel-to-market dependency decay and supply deficit ratios.
              </p>
            </div>

            <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs uppercase text-orange-400 font-bold">03. RECOVERY PRIORITY</span>
              <h3 className="text-sm font-bold text-white">Resource Allocation Ranking</h3>
              <p className="text-slate-400 font-sans leading-relaxed">
                Ranks agricultural interventions by evidence, vulnerability, and city impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Recovery Priorities Story */}
      <section id="priorities" className="py-32 px-6 bg-slate-950 border-t border-slate-900">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white">
            WHEN EVERYTHING IS A PRIORITY, <br />
            <span className="text-slate-500">NOTHING IS.</span>
          </h2>

          <p className="text-base text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            AgriGuard ranks affected agricultural areas by flood exposure, cultivation evidence, crop vulnerability, market importance, and production impact.
          </p>

          <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl font-mono text-xs max-w-xl mx-auto text-left space-y-3">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block">
              AI-ASSISTED CULTIVATION EVIDENCE
            </span>
            <p className="text-slate-300 font-sans leading-relaxed">
              Land records tell you who owns land. The food system needs to know who is cultivating it.
            </p>
            <div className="p-3 bg-amber-950/30 border border-amber-900/40 rounded text-[11px] text-amber-300/90">
              <strong>Methodology Rule:</strong> AI-assisted cultivation evidence requires administrative verification. Not legal proof of tenancy or land ownership.
            </div>
          </div>
        </div>
      </section>

      {/* 6. Gemini Intelligence Layer */}
      <section className="py-32 px-6 bg-slate-950 border-t border-slate-900">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300 font-mono text-xs">
            <Cpu className="w-3.5 h-3.5" />
            <span>GEMINI REASONING LAYER</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white">
            AND THEN, ASK THE SYSTEM WHY.
          </h2>

          <p className="text-base text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Gemini translates AgriGuard's calculated risk and recovery intelligence into clear decision-support recommendations for urban emergency planners.
          </p>

          <div className="p-6 bg-slate-900/90 border border-indigo-900/60 rounded-2xl text-left max-w-xl mx-auto font-mono text-xs space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold border-b border-slate-800 pb-2">
              <Sparkles className="w-4 h-4" />
              <span>Prompt: "What should the city prioritize first?"</span>
            </div>
            <p className="text-slate-300 font-sans leading-relaxed">
              "Prioritize emergency drainage in Chakan tomato cluster (Parcel PNE-014). This cluster supplies 28% of Gultekdi APMC's perishable vegetables and faces 85% flood inundation."
            </p>
          </div>
        </div>
      </section>

      {/* 7. Big Idea Section */}
      <section className="py-40 px-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-t border-slate-900 text-center">
        <div className="max-w-5xl mx-auto space-y-6">
          <h2 className="text-4xl md:text-7xl font-black tracking-tight text-white leading-tight">
            PROTECTING A CITY'S FOOD SUPPLY <br />
            <span className="text-emerald-400">STARTS OUTSIDE THE CITY.</span>
          </h2>
        </div>
      </section>

      {/* 8. CTA & Command Center Entry */}
      <section className="py-24 px-6 bg-slate-950 border-t border-slate-900 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            SEE THE CITY THROUGH ITS FOOD SYSTEM.
          </h2>

          <p className="text-slate-400 font-light text-base max-w-xl mx-auto leading-relaxed">
            Explore how AgriGuard detects disruption, measures food-supply risk and prioritizes recovery.
          </p>

          <Link
            href="/command-center"
            className="inline-flex items-center gap-3 px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl transition text-base font-mono shadow-2xl shadow-emerald-500/20"
          >
            <span>ENTER COMMAND CENTER</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-900 text-xs font-mono text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4 max-w-6xl mx-auto">
        <div>
          <span className="text-white font-bold">AgriGuard-AI</span> • Pune Prototype
        </div>
        <p className="text-amber-400/80">
          Illustrative prototype methodology demonstration — AI-assisted evidence requires administrative verification.
        </p>
      </footer>
    </div>
  );
}
