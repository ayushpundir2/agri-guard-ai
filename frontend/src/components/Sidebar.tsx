import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Store,
  ShieldAlert,
  ListOrdered,
  Bot,
  Activity,
  CheckCircle2,
  Info
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  systemStatus: string;
}

export default function Sidebar({ activeSection, onNavigate, systemStatus }: SidebarProps) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'map', label: 'Food Map', icon: MapPin },
    { id: 'markets', label: 'Markets', icon: Store },
    { id: 'analysis', label: 'Risk Analysis', icon: ShieldAlert },
    { id: 'recovery', label: 'Recovery Priorities', icon: ListOrdered },
    { id: 'ai-analyst', label: 'AI Analyst', icon: Bot },
    { id: 'city-action', label: 'City Action', icon: Activity },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between p-4 min-h-screen text-xs select-none">
      {/* Brand Section */}
      <div>
        <div className="flex items-center gap-3 px-2 py-3 border-b border-slate-800/80 mb-6">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <span className="text-xl">🌾</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">AgriGuard-AI</h1>
            <p className="text-[10px] text-slate-400 font-medium">City Food Resilience Intelligence</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Status & Disclaimer */}
      <div className="space-y-3 pt-4 border-t border-slate-800/80">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-semibold">{systemStatus}</span>
        </div>

        <div className="px-3 text-[10px] text-slate-500 space-y-1 leading-relaxed">
          <p className="flex items-center gap-1 font-semibold text-slate-400">
            <Info className="w-3 h-3 text-amber-400" /> Illustrative Prototype
          </p>
          <p>
            AI-assisted cultivation evidence requires administrative verification before legal decisions.
          </p>
        </div>
      </div>
    </aside>
  );
}
