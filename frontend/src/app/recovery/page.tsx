'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import RecoveryPriorityList from '@/components/RecoveryPriorityList';
import ParcelDetailPanel from '@/components/ParcelDetailPanel';
import {
  fetchRecoveryPriorities,
  fetchParcelDetail,
  fetchFloodOverview,
  RecoveryPriority,
  ParcelDetail,
  FloodOverview
} from '@/lib/api';

export default function RecoveryPage() {
  const [priorities, setPriorities] = useState<RecoveryPriority[]>([]);
  const [floodOverview, setFloodOverview] = useState<FloodOverview | null>(null);
  const [selectedParcel, setSelectedParcel] = useState<ParcelDetail | null>(null);

  useEffect(() => {
    async function loadData() {
      const [recs, floodRes] = await Promise.all([
        fetchRecoveryPriorities(25),
        fetchFloodOverview()
      ]);
      setPriorities(recs);
      setFloodOverview(floodRes);
    }
    loadData();
  }, []);

  const handleSelectParcel = async (parcelId: string) => {
    const detail = await fetchParcelDetail(parcelId);
    setSelectedParcel(detail);
  };

  return (
    <AppShell
      disasterStatus={floodOverview?.status || 'NORMAL'}
      activeEventName={floodOverview?.active_event?.name}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold font-sans text-civic-forest">Recovery — Recovery Priorities</h2>
        <p className="text-xs text-civic-charcoal/80 font-sans">
          Ranked agricultural intervention areas prioritized by flood exposure, cultivation evidence, crop vulnerability, and market importance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {priorities.length > 0 ? (
            <RecoveryPriorityList priorities={priorities} onSelectParcel={handleSelectParcel} />
          ) : (
            <div className="bg-slate-950/90 border border-slate-800/80 p-8 rounded-2xl text-center text-xs text-slate-400 font-mono space-y-2">
              <p className="text-emerald-400 font-bold">No Active Disaster Recovery Required</p>
              <p className="font-sans">
                Simulate a flood scenario from the Command Center or Food Map to calculate and rank agricultural recovery priorities.
              </p>
            </div>
          )}
        </div>

        <div>
          {selectedParcel ? (
            <ParcelDetailPanel parcel={selectedParcel} onClose={() => setSelectedParcel(null)} />
          ) : (
            <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-2xl text-center text-xs text-slate-500 font-mono">
              Click any recovery priority item to inspect full parcel evidence scores, flood exposure levels, and structured reasoning.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
