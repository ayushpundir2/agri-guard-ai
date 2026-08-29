import React from 'react';
import { FloodOverview, FloodEvent } from '@/lib/api';
import { Waves, RotateCcw } from 'lucide-react';

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
  const selectedEventId = activeOverview?.active_event?.event_id || '';

  return (
    <div className="bg-civic-card border border-civic-neutral p-4 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-civic-forest font-bold uppercase tracking-wider">
          <Waves className="w-4 h-4 text-civic-teal" />
          <span>Disaster Scenario:</span>
        </div>

        <select
          value={selectedEventId}
          onChange={(e) => {
            if (e.target.value) {
              onSimulate(e.target.value);
            } else {
              onReset();
            }
          }}
          disabled={loading}
          className="bg-civic-ivory border border-civic-neutral text-civic-charcoal rounded-xl px-3 py-2 outline-none cursor-pointer font-sans text-xs focus:border-civic-forest"
        >
          <option value="">No Active Scenario (Normal Conditions)</option>
          {scenarios.map((s) => (
            <option key={s.event_id} value={s.event_id}>
              {s.name} ({s.severity.toUpperCase()})
            </option>
          ))}
        </select>

        {selectedEventId && (
          <button
            onClick={onReset}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-civic-neutral hover:bg-civic-sage/40 text-civic-charcoal font-semibold transition cursor-pointer border border-civic-neutral"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {activeOverview?.status === 'ACTIVE_FLOOD' ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-civic-terracotta/10 border border-civic-terracotta text-civic-terracotta font-semibold">
            <span className="w-2 h-2 rounded-full bg-civic-terracotta animate-pulse" />
            <span>Active Scenario: {activeOverview.active_event?.name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-civic-forest/10 border border-civic-forest/30 text-civic-forest font-semibold">
            <span className="w-2 h-2 rounded-full bg-civic-leaf" />
            <span>Disaster Status: NORMAL</span>
          </div>
        )}
      </div>
    </div>
  );
}
