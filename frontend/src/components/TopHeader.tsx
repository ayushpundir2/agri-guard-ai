import React from 'react';
import Link from 'next/link';
import HealthBadge from '@/components/HealthBadge';
import { useAuth } from '@/context/AuthContext';
import { useLanguage, LanguageCode } from '@/context/LanguageContext';
import { ShieldAlert, CheckCircle2, MapPin, User as UserIcon, LogOut, Globe } from 'lucide-react';

interface TopHeaderProps {
  disasterStatus: 'NORMAL' | 'ACTIVE_FLOOD';
  activeEventName?: string | null;
}

export default function TopHeader({ disasterStatus, activeEventName }: TopHeaderProps) {
  const isFloodActive = disasterStatus === 'ACTIVE_FLOOD';
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="h-16 bg-civic-card/90 backdrop-blur border-b border-civic-neutral px-6 flex items-center justify-between z-30 select-none shadow-xs">
      {/* Left Title & Tagline */}
      <div className="flex items-center gap-6">
        <div>
          <h2 className="text-sm font-bold text-civic-forest tracking-wide font-sans">
            {t('nav.title', 'AgriGuard Civic Operations')}
          </h2>
          <p className="text-[11px] text-civic-charcoal/70 font-sans">
            {t('nav.tagline', 'Know what feeds your city. Know what happens when it fails.')}
          </p>
        </div>
      </div>

      {/* Center Region Badge */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-civic-ivory border border-civic-neutral text-xs text-civic-charcoal font-mono">
        <MapPin className="w-3.5 h-3.5 text-civic-leaf" />
        <span>PUNE, MAHARASHTRA, INDIA</span>
      </div>

      {/* Right User & Live Status */}
      <div className="flex items-center gap-3">
        {/* Global Language Selector */}
        <div className="flex items-center gap-1 bg-civic-ivory border border-civic-neutral rounded-xl px-2 py-1 text-xs font-mono">
          <Globe className="w-3.5 h-3.5 text-civic-leaf" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            aria-label="Select interface language"
            className="bg-transparent border-none text-civic-forest font-bold text-xs focus:outline-none cursor-pointer"
          >
            <option value="en">EN — English</option>
            <option value="hi">हि — हिन्दी</option>
            <option value="mr">मर — मराठी</option>
          </select>
        </div>

        {isFloodActive ? (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-civic-terracotta/10 border border-civic-terracotta text-civic-terracotta text-xs font-mono font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>{t('states.activeFlood', 'ACTIVE DISASTER')}: {activeEventName || 'DISRUPTION DETECTED'}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-civic-forest/10 border border-civic-forest/30 text-civic-forest text-xs font-mono font-semibold">
            <CheckCircle2 className="w-4 h-4 text-civic-leaf" />
            <span>{t('states.normal', 'NORMAL CONDITIONS')}</span>
          </div>
        )}

        <HealthBadge />

        {/* User Account / Profile Badge */}
        {user ? (
          <div className="flex items-center gap-2 pl-2 border-l border-civic-neutral">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-civic-ivory border border-civic-neutral text-xs font-sans">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="Avatar" className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <UserIcon className="w-4 h-4 text-civic-forest" />
              )}
              <div className="text-left font-mono text-[11px]">
                <span className="font-bold text-civic-forest block leading-tight truncate max-w-[120px]">{user.name || user.email}</span>
                <span className="text-[9px] uppercase font-bold text-civic-leaf">{user.role}</span>
              </div>
            </div>
            <button
              onClick={logout}
              title={t('actions.signOut', 'Sign Out')}
              className="p-1.5 rounded-lg text-civic-charcoal/60 hover:text-civic-red hover:bg-civic-red/10 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/auth"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-civic-forest hover:bg-civic-leaf text-white font-mono text-xs font-bold transition shadow-xs"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>{t('actions.signIn', 'Sign In')}</span>
          </Link>
        )}
      </div>
    </header>
  );
}
