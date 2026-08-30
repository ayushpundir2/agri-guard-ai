'use client';

import React, { useState, useEffect } from 'react';
import { FloodOverview, FloodEvent } from '@/lib/api';
import { Waves, RotateCcw, Play, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface FloodScenarioControlProps {
  scenarios: FloodEvent[];
  activeOverview: FloodOverview | null;
  onSimulate: (eventId: string) => void;
  onReset: () => void;
  loading: boolean;
}

export default function FloodScenarioControl({
  scenarios,
  activeOverview,
  onSimulate,
  onReset,
  loading
}: FloodScenarioControlProps) {
  const activeEventId = activeOverview?.active_event?.event_id || '';
  const [selectedEventId, setSelectedEventId] = useState<string>(activeEventId);

  useEffect(() => {
    if (activeEventId) {
      setSelectedEventId(activeEventId);
    } else if (scenarios.length > 0 && !selectedEventId) {
      setSelectedEventId(scenarios[0].event_id);
    }
  }, [activeEventId, scenarios]);

  const handleSimulateClick = () => {
    if (selectedEventId) {
      onSimulate(selectedEventId);
    }
  };

  const isActive = activeOverview?.status === 'ACTIVE_FLOOD';

  return (
    <div className="bg-civic-card border border-civic-neutral p-5 rounded-2xl shadow-sm flex flex-col gap-4 font-sans text-xs">
      {/* Header Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-civic-neutral pb-3">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-civic-forest flex items-center gap-2 font-mono">
            <Waves className="w-4 h-4 text-civic-teal" />
            DISASTER CONTROLLER
          </h3>
          <p className="text-xs text-civic-charcoal/70 mt-0.5 font-sans">
            Simulate a disaster scenario and measure its impact on Pune&apos;s food network.
          </p>
        </div>

        {/* Status Indicator */}
        <div>
          {isActive ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-civic-terracotta/10 border border-civic-terracotta/40 text-civic-terracotta font-mono font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-civic-terracotta animate-pulse" />
              <span>ACTIVE FLOOD SCENARIO</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-civic-forest/10 border border-civic-forest/30 text-civic-forest font-mono font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-civic-leaf" />
              <span>NORMAL CONDITIONS</span>
            </div>
          )}
        </div>
      </div>

      {/* Control Actions Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 font-mono">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <label className="text-[11px] font-bold text-civic-charcoal/80 uppercase">
            Select Scenario:
          </label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            disabled={loading}
            className="flex-1 min-w-[240px] bg-civic-ivory border border-civic-neutral text-civic-charcoal rounded-xl px-3 py-2 outline-none cursor-pointer font-sans text-xs focus:border-civic-forest disabled:opacity-50"
          >
            <option value="" disabled>Choose a scenario...</option>
            {scenarios.map((s) => (
              <option key={s.event_id} value={s.event_id}>
                {s.name} ({s.severity.toUpperCase()})
              </option>
            ))}
          </select>

          <button
            onClick={handleSimulateClick}
            disabled={loading || !selectedEventId}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-civic-forest hover:bg-civic-leaf text-white font-bold tracking-wider transition cursor-pointer text-xs shadow-md disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {loading ? 'SIMULATING...' : 'SIMULATE FLOOD'}
          </button>

          {isActive && (
            <button
              onClick={() => {
                onReset();
                if (scenarios.length > 0) setSelectedEventId(scenarios[0].event_id);
              }}
              disabled={loading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-civic-neutral hover:bg-civic-sage/40 text-civic-charcoal font-semibold transition cursor-pointer border border-civic-neutral text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Scenario
            </button>
          )}
        </div>
      </div>

      {/* Active Impact Metrics Banner */}
      {isActive && activeOverview && (
        <div className="p-3.5 bg-civic-terracotta/5 border border-civic-terracotta/30 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-civic-terracotta font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{activeOverview.active_event?.name} Impact Summary:</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-civic-charcoal">
            <div>
              <span className="text-civic-charcoal/60 uppercase text-[10px]">Affected Parcels: </span>
              <strong className="text-civic-forest font-bold">{activeOverview.affected_parcel_count}</strong>
            </div>

            <div>
              <span className="text-civic-charcoal/60 uppercase text-[10px]">Cultivated Area Loss: </span>
              <strong className="text-civic-forest font-bold">{activeOverview.affected_cultivated_acres} Acres</strong>
            </div>

            <div>
              <span className="text-civic-charcoal/60 uppercase text-[10px]">Avg Crop Damage: </span>
              <strong className="text-civic-red font-bold">{(activeOverview.average_crop_damage * 100).toFixed(1)}%</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
