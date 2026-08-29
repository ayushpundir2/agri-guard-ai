import React from 'react';
import { SearchCheck, Shield, Target, RefreshCw } from 'lucide-react';

export default function CityActionSection() {
  const actions = [
    {
      code: 'VERIFY',
      title: 'Field Verification',
      desc: 'Prioritize administrative field verification of high-evidence, high-impact cultivation clusters.',
      icon: SearchCheck,
      color: 'text-civic-forest bg-civic-forest/10 border-civic-forest/30'
    },
    {
      code: 'PROTECT',
      title: 'Market Supply Lines',
      desc: 'Investigate alternative wholesale supply corridors for exposed urban produce categories.',
      icon: Shield,
      color: 'text-civic-saffron bg-civic-saffron/10 border-civic-saffron/30'
    },
    {
      code: 'PRIORITIZE',
      title: 'Targeted Recovery',
      desc: 'Deploy municipal drainage and crop recovery aid to critical priority agricultural parcels.',
      icon: Target,
      color: 'text-civic-terracotta bg-civic-terracotta/10 border-civic-terracotta/30'
    },
    {
      code: 'RECOVER',
      title: 'System Re-balancing',
      desc: 'Coordinate regional agricultural re-seeding and market baseline stabilization.',
      icon: RefreshCw,
      color: 'text-civic-teal bg-civic-teal/10 border-civic-teal/30'
    }
  ];

  return (
    <section className="bg-civic-card border border-civic-neutral p-6 rounded-2xl shadow-sm flex flex-col gap-5">
      <div className="border-b border-civic-neutral pb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-civic-forest flex items-center gap-2 font-mono">
          <span>🏛️</span> City Action & Decision Support
        </h3>
        <p className="text-xs text-civic-charcoal/70 mt-1">
          Operational framework translating platform risk intelligence into targeted municipal response.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.code}
              className="p-4 bg-civic-ivory/60 border border-civic-neutral rounded-xl flex flex-col justify-between gap-3 hover:border-civic-sage transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${act.color}`}>
                    {act.code}
                  </span>
                  <Icon className="w-4 h-4 text-civic-charcoal/60" />
                </div>
                <h4 className="text-sm font-bold text-civic-forest mb-1">{act.title}</h4>
                <p className="text-xs text-civic-charcoal/80 leading-relaxed font-sans">{act.desc}</p>
              </div>
              <div className="text-[10px] text-civic-charcoal/60 font-mono pt-2 border-t border-civic-neutral">
                Decision Support Output
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
