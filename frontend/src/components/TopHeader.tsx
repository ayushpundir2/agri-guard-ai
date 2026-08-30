'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage, LanguageCode } from '@/context/LanguageContext';
import { fetchBackendHealth, HealthCheckData } from '@/lib/api';
import { MapPin, Globe, ChevronDown, User as UserIcon, LogOut, Database, Server } from 'lucide-react';

interface TopHeaderProps {
  disasterStatus: 'NORMAL' | 'ACTIVE_FLOOD';
  activeEventName?: string | null;
}

export default function TopHeader({ disasterStatus, activeEventName }: TopHeaderProps) {
  const isFloodActive = disasterStatus === 'ACTIVE_FLOOD';
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [health, setHealth] = useState<HealthCheckData | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadHealth() {
      const data = await fetchBackendHealth();
      setHealth(data);
    }
    loadHealth();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-civic-card border-b border-civic-neutral px-6 flex items-center justify-between z-30 select-none shadow-xs">
      {/* LEFT: Title */}
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-sm font-bold text-civic-forest tracking-tight font-sans">
            {t('nav.title', 'AgriGuard Civic Operations')}
          </h2>
        </div>
      </div>

      {/* CENTER / RIGHT: Location + Language + Status + User */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Location Indicator */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-civic-charcoal/80 font-sans">
          <MapPin className="w-3.5 h-3.5 text-civic-leaf shrink-0" />
          <span className="font-medium whitespace-nowrap">Pune, Maharashtra</span>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-1 bg-civic-ivory/80 border border-civic-neutral rounded-lg px-2 py-1 text-xs font-sans">
          <Globe className="w-3.5 h-3.5 text-civic-leaf shrink-0" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            aria-label="Select interface language"
            className="bg-transparent border-none text-civic-forest font-semibold text-xs focus:outline-none cursor-pointer pr-1"
          >
            <option value="en">EN</option>
            <option value="hi">हि</option>
            <option value="mr">मर</option>
          </select>
        </div>

        {/* Operational Status */}
        {isFloodActive ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-civic-terracotta/10 border border-civic-terracotta/30 text-civic-terracotta text-xs font-sans font-bold">
            <span className="w-2 h-2 rounded-full bg-civic-terracotta animate-pulse shrink-0" />
            <span className="truncate max-w-[140px] sm:max-w-[200px]">
              {activeEventName ? `Active: ${activeEventName}` : t('states.activeFlood', 'Active Disaster')}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-civic-forest/10 border border-civic-forest/20 text-civic-forest text-xs font-sans font-medium">
            <span className="w-2 h-2 rounded-full bg-civic-leaf shrink-0" />
            <span>{t('states.normal', 'Normal')}</span>
          </div>
        )}

        {/* FAR RIGHT: Compact User Menu */}
        <div className="relative" ref={dropdownRef}>
          {user ? (
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-civic-ivory hover:bg-civic-neutral/60 border border-civic-neutral text-xs font-sans transition cursor-pointer"
            >
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="Avatar" className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <UserIcon className="w-4 h-4 text-civic-forest shrink-0" />
              )}
              <span className="font-semibold text-civic-forest truncate max-w-[100px] sm:max-w-[140px]">
                {user.name || user.email.split('@')[0]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-civic-charcoal/60 shrink-0" />
            </button>
          ) : (
            <Link
              href="/auth"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-civic-forest hover:bg-civic-leaf text-white font-sans text-xs font-bold transition shadow-xs"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>{t('actions.signIn', 'Sign In')}</span>
            </Link>
          )}

          {/* User Dropdown Menu */}
          {user && dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-civic-white border border-civic-neutral rounded-2xl shadow-civic py-3 px-2 z-50 text-xs font-sans space-y-2">
              {/* Profile Details Header */}
              <div className="px-3 py-1.5 border-b border-civic-neutral/60 space-y-0.5">
                <p className="font-bold text-civic-forest text-xs truncate">{user.name || 'User'}</p>
                <p className="text-[11px] text-civic-charcoal/70 truncate">{user.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-civic-forest/10 text-civic-forest text-[9px] font-mono uppercase font-bold">
                  {user.role}
                </span>
              </div>

              {/* System Diagnostics Section */}
              <div className="px-3 py-1.5 space-y-1.5 bg-civic-ivory/60 rounded-xl border border-civic-neutral/60 text-[11px] font-mono">
                <div className="flex items-center justify-between text-civic-charcoal/80">
                  <span className="flex items-center gap-1 text-civic-forest">
                    <Server className="w-3 h-3" /> Backend API
                  </span>
                  <span className="font-semibold">{health ? `${health.status} (${health.version})` : 'Connected'}</span>
                </div>
                <div className="flex items-center justify-between text-civic-charcoal/80">
                  <span className="flex items-center gap-1 text-civic-forest">
                    <Database className="w-3 h-3" /> Database
                  </span>
                  <span className="font-semibold text-civic-leaf">{health?.database_connected ? 'Connected' : 'OK'}</span>
                </div>
              </div>

              {/* Sign Out Button */}
              <div className="pt-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-civic-red hover:bg-civic-red/10 transition text-xs font-semibold cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('actions.signOut', 'Sign Out')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
