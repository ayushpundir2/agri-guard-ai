'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import {
  LayoutDashboard,
  MapPin,
  Store,
  ShieldAlert,
  ListOrdered,
  Bot,
  Activity,
  Info
} from 'lucide-react';

interface SidebarProps {
  systemStatus?: string;
}

export default function Sidebar({ systemStatus = 'All Systems Operational' }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: '/command-center', label: t('nav.overview', 'Overview'), icon: LayoutDashboard },
    { href: '/food-map', label: t('nav.foodMap', 'Food Map'), icon: MapPin },
    { href: '/markets', label: t('nav.markets', 'Markets'), icon: Store },
    { href: '/risk-analysis', label: t('nav.riskAnalysis', 'Risk Analysis'), icon: ShieldAlert },
    { href: '/recovery', label: t('nav.recovery', 'Recovery Priorities'), icon: ListOrdered },
    { href: '/ai-analyst', label: t('nav.aiAnalyst', 'AI Analyst'), icon: Bot },
    { href: '/city-action', label: t('nav.cityAction', 'City Action'), icon: Activity },
  ];

  return (
    <aside className="w-64 bg-civic-card border-r border-civic-neutral flex flex-col justify-between p-4 min-h-screen text-xs select-none shadow-sm">
      {/* Brand Section */}
      <div>
        <Link href="/" className="flex items-center gap-3 px-2 py-3 border-b border-civic-neutral mb-6 group cursor-pointer">
          <img
            src="/agriguard-emblem.png"
            alt="AgriGuard Emblem"
            className="w-8 h-8 object-contain shrink-0 group-hover:scale-105 transition-transform"
          />
          <div>
            <h1 className="text-sm font-bold text-civic-forest tracking-tight">AgriGuard-AI</h1>
            <p className="text-[10px] text-civic-charcoal/70 font-medium">City Food Resilience Intelligence</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === '/command-center' && pathname === '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-semibold text-sm transition ${
                  isActive
                    ? 'bg-civic-forest text-white shadow-sm'
                    : 'text-civic-charcoal/80 hover:text-civic-forest hover:bg-civic-ivory'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-civic-leaf'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Status & Disclaimer */}
      <div className="space-y-3 pt-4 border-t border-civic-neutral">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-civic-ivory border border-civic-neutral text-[11px] font-mono">
          <span className="w-2 h-2 rounded-full bg-civic-leaf animate-pulse" />
          <span className="text-civic-charcoal font-semibold">{systemStatus}</span>
        </div>

        <div className="px-3 text-[10px] text-civic-charcoal/70 space-y-1 leading-relaxed">
          <p className="flex items-center gap-1 font-semibold text-civic-forest">
            <Info className="w-3 h-3 text-civic-saffron" /> Illustrative Prototype
          </p>
          <p>
            AI-assisted cultivation evidence requires administrative verification.
          </p>
        </div>
      </div>
    </aside>
  );
}
