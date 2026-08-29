'use client';

import { useEffect, useState } from 'react';
import { fetchBackendHealth, HealthCheckData } from '@/lib/api';

export default function HealthBadge() {
  const [health, setHealth] = useState<HealthCheckData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkHealth() {
      setLoading(true);
      setError(null);
      const data = await fetchBackendHealth();
      if (data) {
        setHealth(data);
      } else {
        setError('Backend Unreachable');
      }
      setLoading(false);
    }

    checkHealth();
  }, []);

  if (loading) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 text-slate-400 text-xs font-mono">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        Checking API connection...
      </div>
    );
  }

  if (error || !health) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/80 border border-red-800 text-red-300 text-xs font-mono">
        <span className="w-2 h-2 rounded-full bg-red-500" />
        Backend: Offline
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-mono">
      <span className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        Backend API: {health.status} ({health.version})
      </span>
      <span className="text-slate-600">|</span>
      <span>City: {health.target_city}</span>
      <span className="text-slate-600">|</span>
      <span>DB: {health.database_connected ? 'Connected' : 'Disconnected'}</span>
    </div>
  );
}
