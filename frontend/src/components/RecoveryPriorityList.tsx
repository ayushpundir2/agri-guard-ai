import React from 'react';
import { RecoveryPriority } from '@/lib/api';
import { ListOrdered } from 'lucide-react';

interface RecoveryPriorityListProps {
  priorities: RecoveryPriority[];
  onSelectParcel: (parcelId: string) => void;
}

export default function RecoveryPriorityList({
  priorities,
  onSelectParcel
}: RecoveryPriorityListProps) {
  if (!priorities || priorities.length === 0) return null;

  return (
    <div className="bg-civic-card border border-civic-neutral p-5 rounded-2xl shadow-sm flex flex-col gap-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-civic-neutral pb-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-civic-forest flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-civic-leaf" />
            RECOVERY PRIORITIES
          </h3>
          <p className="text-[10px] text-civic-charcoal/70 mt-0.5 font-sans">
            Where should limited recovery resources go first?
          </p>
        </div>
        <span className="text-[10px] text-civic-charcoal/60">Top Ranked Agricultural Parcels</span>
      </div>

      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {priorities.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => onSelectParcel(item.parcel_id)}
            className="p-3 bg-civic-ivory/60 border border-civic-neutral rounded-xl hover:border-civic-sage cursor-pointer transition flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-civic-forest text-white flex items-center justify-center font-bold text-[10px]">
                  {idx + 1}
                </span>
                <span className="font-bold text-civic-forest">{item.parcel_id}</span>
                <span className="text-civic-charcoal/70">({item.crop_type} • {item.area_acres} Acres)</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-civic-saffron">{item.priority_score} / 100</span>
                <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                  item.priority_level === 'CRITICAL' ? 'bg-civic-red/10 text-civic-red border border-civic-red/30' :
                  item.priority_level === 'HIGH' ? 'bg-civic-terracotta/10 text-civic-terracotta border border-civic-terracotta/30' :
                  item.priority_level === 'MODERATE' ? 'bg-civic-saffron/10 text-civic-saffron border border-civic-saffron/30' :
                  'bg-civic-forest/10 text-civic-forest border border-civic-forest/30'
                }`}>
                  {item.priority_level}
                </span>
              </div>
            </div>

            {/* Structured Reasons */}
            {item.structured_reasons && item.structured_reasons.length > 0 && (
              <div className="pl-7 text-[10px] text-civic-charcoal/70 space-y-0.5 font-sans">
                {item.structured_reasons.map((reason, i) => (
                  <p key={i} className="flex items-center gap-1.5 text-civic-charcoal">
                    <span className="text-civic-terracotta font-bold">•</span> {reason}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
