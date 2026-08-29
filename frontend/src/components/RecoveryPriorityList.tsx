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
    <div className="bg-slate-950/90 border border-slate-800/80 p-5 rounded-2xl shadow-xl flex flex-col gap-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-emerald-400" />
            RECOVERY PRIORITIES
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5 font-sans">
            Where should limited recovery resources go first?
          </p>
        </div>
        <span className="text-[10px] text-slate-500">Top Ranked Agricultural Parcels</span>
      </div>

      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {priorities.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => onSelectParcel(item.parcel_id)}
            className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl hover:border-slate-700 cursor-pointer transition flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center font-bold text-[10px] text-slate-300">
                  {idx + 1}
                </span>
                <span className="font-bold text-slate-100">{item.parcel_id}</span>
                <span className="text-slate-400">({item.crop_type} • {item.area_acres} Acres)</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-400">{item.priority_score} / 100</span>
                <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                  item.priority_level === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-800' :
                  item.priority_level === 'HIGH' ? 'bg-orange-950 text-orange-300 border border-orange-800' :
                  item.priority_level === 'MODERATE' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {item.priority_level}
                </span>
              </div>
            </div>

            {/* Structured Reasons */}
            {item.structured_reasons && item.structured_reasons.length > 0 && (
              <div className="pl-7 text-[10px] text-slate-400 space-y-0.5 font-sans">
                {item.structured_reasons.map((reason, i) => (
                  <p key={i} className="flex items-center gap-1.5 text-slate-300">
                    <span className="text-amber-400 font-bold">•</span> {reason}
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
