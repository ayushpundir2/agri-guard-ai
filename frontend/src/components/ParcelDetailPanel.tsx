import React, { useState } from 'react';
import { ParcelDetail, askGeminiAnalyst, AIAnalysisResult } from '@/lib/api';
import { X, Sparkles, AlertTriangle } from 'lucide-react';

interface ParcelDetailPanelProps {
  parcel: ParcelDetail | null;
  onClose: () => void;
}

export default function ParcelDetailPanel({ parcel, onClose }: ParcelDetailPanelProps) {
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);

  if (!parcel) return null;

  const ev = parcel.evidence;
  const flood = parcel.active_flood_impact;

  const handleAskGeminiParcel = async () => {
    setAiLoading(true);
    const res = await askGeminiAnalyst(
      `Why is parcel ${parcel.parcel_id} prioritized and what are the recommended recovery actions?`,
      parcel.parcel_id
    );
    setAiResult(res);
    setAiLoading(false);
  };

  return (
    <div className="w-full md:w-96 bg-civic-card border border-civic-neutral rounded-2xl p-5 shadow-2xl flex flex-col gap-4 text-sm font-mono select-none">
      <div className="flex items-start justify-between border-b border-civic-neutral pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase px-2 py-0.5 rounded bg-civic-forest/10 text-civic-forest border border-civic-forest/30 font-bold">
              Parcel
            </span>
            <h3 className="text-lg font-bold text-civic-forest">{parcel.parcel_id}</h3>
          </div>
          <p className="text-xs text-civic-charcoal/70 mt-1 font-sans">Pune Agricultural Belt, Maharashtra</p>
        </div>
        <button
          onClick={onClose}
          className="text-civic-charcoal/60 hover:text-civic-charcoal p-1 rounded-lg hover:bg-civic-ivory transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {flood && (
        <div className="bg-civic-terracotta/10 border border-civic-terracotta/30 rounded-xl p-3 space-y-2 text-xs">
          <div className="text-civic-terracotta font-bold uppercase tracking-wider border-b border-civic-terracotta/20 pb-1.5 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Flood Event Impact</span>
          </div>
          <div className="flex justify-between">
            <span className="text-civic-charcoal/70">Event:</span>
            <span className="font-semibold text-civic-charcoal truncate max-w-[180px]">{flood.flood_event_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-civic-charcoal/70">Flood Exposure:</span>
            <span className="font-bold text-civic-terracotta">{flood.overlap_percentage}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-civic-charcoal/70">Est. Crop Damage:</span>
            <span className="font-bold text-civic-red">{flood.estimated_crop_damage} / 100</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 bg-civic-ivory/60 p-3 rounded-xl border border-civic-neutral text-xs">
        <div>
          <span className="text-[10px] text-civic-charcoal/60 uppercase block">Crop Type</span>
          <span className="text-civic-forest font-semibold text-base">{parcel.crop_type}</span>
        </div>
        <div>
          <span className="text-[10px] text-civic-charcoal/60 uppercase block">Area</span>
          <span className="text-civic-forest font-semibold text-base">{parcel.area_acres} Acres</span>
        </div>
      </div>

      <div className="bg-civic-ivory/60 border border-civic-neutral rounded-xl p-3 space-y-2 text-xs">
        <div className="flex items-center justify-between border-b border-civic-neutral pb-1.5">
          <span className="font-semibold uppercase tracking-wider text-civic-forest">
            Cultivation Evidence
          </span>
          <span className="font-bold text-civic-leaf">
            {ev ? ev.evidence_score : parcel.evidence_score ?? 'N/A'} / 100
          </span>
        </div>
        <div className="text-[10px] text-civic-saffron bg-civic-saffron/10 p-2 rounded border border-civic-saffron/30 font-sans">
          <strong>AI-assisted cultivation evidence</strong> — requires administrative verification.
        </div>
      </div>

      <button
        onClick={handleAskGeminiParcel}
        disabled={aiLoading}
        className="flex items-center justify-center gap-2 py-2.5 px-3 bg-civic-forest hover:bg-civic-leaf text-white font-bold rounded-xl transition cursor-pointer text-xs shadow-sm"
      >
        <Sparkles className="w-3.5 h-3.5 text-civic-sage" />
        {aiLoading ? 'ANALYZING PARCEL...' : 'ASK GEMINI ABOUT THIS PARCEL'}
      </button>

      {aiResult && aiResult.analysis && (
        <div className="bg-civic-ivory p-3 rounded-xl border border-civic-neutral text-xs space-y-2 font-sans text-civic-charcoal">
          <p className="font-semibold text-civic-forest">{aiResult.analysis.summary}</p>
          <p className="text-civic-charcoal/80">{aiResult.analysis.reasoning}</p>
        </div>
      )}
    </div>
  );
}
