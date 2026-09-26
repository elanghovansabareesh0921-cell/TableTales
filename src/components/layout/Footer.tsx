'use client';

import React from 'react';
import { Sparkles, Heart, Compass, ShieldCheck } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function Footer() {
  const { vibeTheme, setVibeTheme } = useAppStore();

  return (
    <footer className="w-full border-t border-white/10 bg-zinc-950/90 py-12 px-4 sm:px-8 mt-16 text-zinc-400 text-xs">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div 
              className="w-7 h-7 rounded-xl flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, var(--vibe-primary), var(--vibe-secondary))' }}
            >
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-sm text-white tracking-tight">TableTales</span>
            <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest">• AI Vibe Concierge</span>
          </div>
          <p className="text-zinc-400 max-w-sm">
            Transforming restaurant discovery into a sensory narrative where ambient light, cultural origin stories, and live communal syncing converge.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="space-y-1">
            <span className="text-zinc-300 font-semibold block">Curated Terroirs</span>
            <div className="flex gap-3 text-zinc-400">
              <span>Kyoto</span>
              <span>Florence</span>
              <span>Sonoma</span>
              <span>Barcelona</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-zinc-300 font-semibold block">Architecture</span>
            <div className="flex gap-3 text-zinc-400">
              <span>Next.js 14+</span>
              <span>Supabase RLS</span>
              <span>Framer Motion</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-400">
        <div>© 2026 TableTales Dining Platform. All sensory stories reserved.</div>
        <div className="flex items-center gap-2">
          <span>Active Atmosphere:</span>
          <span className="capitalize text-[var(--vibe-accent)] font-semibold">{vibeTheme} Vibe</span>
        </div>
      </div>
    </footer>
  );
}
