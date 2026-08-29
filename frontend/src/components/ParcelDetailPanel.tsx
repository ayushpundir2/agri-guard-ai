import React, { useState } from 'react';
import { ParcelDetail, askGeminiAnalyst, AIAnalysisResult } from '@/lib/api';
import { X, Sparkles, Bot } from 'lucide-react';

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
    <div className="w-full md:w-96 bg-slate-900/95 backdrop-blur border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-4 text-sm font-mono">
      {/* Title Header */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              Parcel
            </span>
            <h3 className="text-lg font-bold text-white">{parcel.parcel_id}</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">Pune Agricultural Belt, Maharashtra</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Active Flood Impact Section */}
      {flood && (
        <div className="bg-cyan-950/40 border border-cyan-800/80 rounded-lg p-3 space-y-2 text-xs">
          <div className="text-cyan-300 font-bold uppercase tracking-wider border-b border-cyan-800/60 pb-1.5">
            Flood Event Impact
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Event:</span>
            <span className="font-semibold text-cyan-200 truncate max-w-[180px]">{flood.flood_event_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Flood Exposure:</span>
            <span className="font-bold text-cyan-300">{flood.overlap_percentage}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Est. Crop Damage:</span>
            <span className="font-bold text-orange-400">{flood.estimated_crop_damage} / 100</span>
          </div>
        </div>
      )}

      {/* Primary Crop & Specs */}
      <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 text-xs">
        <div>
          <span className="text-[10px] text-slate-500 uppercase block">Crop Type</span>
          <span className="text-slate-200 font-semibold text-base">{parcel.crop_type}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase block">Area</span>
          <span className="text-slate-200 font-semibold text-base">{parcel.area_acres} Acres</span>
        </div>
      </div>

      {/* AI Cultivation Evidence Box */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-2 text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
          <span className="font-semibold uppercase tracking-wider text-slate-300">
            Cultivation Evidence
          </span>
          <span className="font-bold text-emerald-400">
            {ev ? ev.evidence_score : parcel.evidence_score ?? 'N/A'} / 100
          </span>
        </div>
        <div className="text-[10px] text-amber-300/80 bg-amber-950/30 p-2 rounded">
          <strong>AI-assisted cultivation evidence</strong> — requires administrative verification.
        </div>
      </div>

      {/* Ask Gemini Button for Parcel */}
      <button
        onClick={handleAskGeminiParcel}
        disabled={aiLoading}
        className="flex items-center justify-center gap-2 py-2 px-3 bg-indigo-950 hover:bg-indigo-900 border border-indigo-700 text-indigo-200 font-bold rounded-lg transition cursor-pointer text-xs"
      >
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        {aiLoading ? 'ANALYZING PARCEL...' : 'ASK GEMINI ABOUT THIS PARCEL'}
      </button>

      {/* Gemini Parcel Reasoning */}
      {aiResult && aiResult.analysis && (
        <div className="bg-slate-950 p-3 rounded-lg border border-indigo-800 text-xs space-y-2 font-sans text-slate-200">
          <p className="font-semibold text-indigo-300">{aiResult.analysis.summary}</p>
          <p className="text-slate-300">{aiResult.analysis.reasoning}</p>
        </div>
      )}
    </div>
  );
}
