'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import CityActionSection from '@/components/CityActionSection';
import { fetchFloodOverview, fetchRiskOverview, FloodOverview, FoodRiskOverview } from '@/lib/api';

export default function CityActionPage() {
  const [floodOverview, setFloodOverview] = useState<FloodOverview | null>(null);
  const [riskOverview, setRiskOverview] = useState<FoodRiskOverview | null>(null);

  useEffect(() => {
    async function loadData() {
      const [floodRes, riskRes] = await Promise.all([
        fetchFloodOverview(),
        fetchRiskOverview()
      ]);
      setFloodOverview(floodRes);
      setRiskOverview(riskRes);
    }
    loadData();
  }, []);

  return (
    <AppShell
      disasterStatus={floodOverview?.status || 'NORMAL'}
      activeEventName={floodOverview?.active_event?.name}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold font-mono text-white">City Response & Action Framework</h2>
        <p className="text-xs text-slate-400 font-sans">
          Operational framework translating platform risk intelligence into targeted municipal field response.
        </p>
      </div>

      <CityActionSection />
    </AppShell>
  );
}
