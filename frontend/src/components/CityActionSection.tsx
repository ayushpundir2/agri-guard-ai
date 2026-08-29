import React from 'react';
import { SearchCheck, Shield, Target, RefreshCw } from 'lucide-react';

export default function CityActionSection() {
  const actions = [
    {
      code: 'VERIFY',
      title: 'Field Verification',
      desc: 'Prioritize administrative field verification of high-evidence, high-impact cultivation clusters.',
      icon: SearchCheck,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    },
    {
      code: 'PROTECT',
      title: 'Market Supply Lines',
      desc: 'Investigate alternative wholesale supply corridors for exposed urban produce categories.',
      icon: Shield,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    },
    {
      code: 'PRIORITIZE',
      title: 'Targeted Recovery',
      desc: 'Deploy municipal drainage and crop recovery aid to critical priority agricultural parcels.',
      icon: Target,
      color: 'text-orange-400 bg-orange-500/10 border-orange-500/30'
    },
    {
      code: 'RECOVER',
      title: 'System Re-balancing',
      desc: 'Coordinate regional agricultural re-seeding and market baseline stabilization.',
      icon: RefreshCw,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30'
    }
  ];

  return (
    <section className="bg-slate-950/80 border border-slate-800/80 p-6 rounded-2xl shadow-xl flex flex-col gap-5">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 font-mono">
          <span>🏛️</span> City Action & Decision Support
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Operational framework translating platform risk intelligence into targeted municipal response.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.code}
              className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl flex flex-col justify-between gap-3 hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${act.color}`}>
                    {act.code}
                  </span>
                  <Icon className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{act.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{act.desc}</p>
              </div>
              <div className="text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800/60">
                Decision Support Output
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
