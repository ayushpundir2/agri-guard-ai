'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import GeminiAnalystPanel from '@/components/GeminiAnalystPanel';
import { useLanguage } from '@/context/LanguageContext';
import { fetchFloodOverview, fetchRiskOverview, FloodOverview, FoodRiskOverview } from '@/lib/api';

export default function AIAnalystPage() {
  const { t } = useLanguage();
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
      <div className="flex flex-col gap-1.5">
        <h2 className="text-xl font-bold font-sans text-civic-forest">
          {t('nav.aiAnalyst', 'AI Analyst')} — Food-System Intelligence Assistant
        </h2>
        <p className="text-xs text-civic-charcoal/80 font-sans leading-relaxed">
          Server-side LLM reasoning layer synthesizing deterministic AgriGuard risk models into actionable municipal recovery guidance.
        </p>
      </div>

      <GeminiAnalystPanel
        activeDisasterName={floodOverview?.active_event?.name}
        overallRiskScore={riskOverview?.overall_risk_score}
        riskLevel={riskOverview?.risk_level}
      />
    </AppShell>
  );
}
