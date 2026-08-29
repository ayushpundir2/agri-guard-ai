import React from 'react';
import { FloodOverview, FloodEvent } from '@/lib/api';
import { CloudRain, AlertTriangle, Play, RotateCcw } from 'lucide-react';

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
    <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs">
      {/* Simulation Dropdown & Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-slate-300 font-bold uppercase tracking-wider">
          <CloudRain className="w-4 h-4 text-cyan-400" />
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
          className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-cyan-500 outline-none cursor-pointer"
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
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold border border-slate-700 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Dynamic Status Pill */}
      <div className="flex items-center gap-2">
        {activeOverview?.status === 'ACTIVE_FLOOD' ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Active Scenario: {activeOverview.active_event?.name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Disaster Status: NORMAL</span>
          </div>
        )}
      </div>
    </div>
  );
}
