'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Compass, 
  Users, 
  BookMarked, 
  ArrowRight, 
  MapPin, 
  Flame, 
  Heart, 
  Coffee, 
  PartyPopper,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { VibeTheme } from '@/types';

const VIBE_THEMES: { id: VibeTheme; label: string; icon: string; desc: string }[] = [
  { id: 'romantic', label: 'Romantic', icon: '🕯️', desc: 'Warm candlelight, wild truffles & rose amber glow' },
  { id: 'family', label: 'Family Feast', icon: '👨‍👩‍👧‍👦', desc: 'Sunny terracotta hearths & generous shareable platters' },
  { id: 'adventurous', label: 'Adventurous', icon: '⚡', desc: 'Electric jade neon, plancha seafood & 22-spice moles' },
  { id: 'chill', label: 'Chill Retreat', icon: '🌿', desc: 'Twilight serenity, soothing dashi broths & matcha clouds' },
  { id: 'celebration', label: 'Celebration', icon: '🥂', desc: 'Champagne sparkle, socarrat rice & euphoric midnight tapas' },
];

export function LandingHero() {
  const { 
    selectedLocation, 
    setConciergeOpen, 
    setFlowMode, 
    vibeTheme, 
    setVibeTheme, 
    setPassportOpen 
  } = useAppStore();

  return (
    <div className="relative min-h-[88vh] flex flex-col justify-center items-center text-center px-4 sm:px-8 overflow-hidden">
      {/* Dynamic Ambient Background Glow Mesh */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: 'var(--vibe-bg-gradient)',
          opacity: 0.95,
        }}
      />

      {/* Floating Radial Embers */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[var(--vibe-primary)] opacity-15 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />

      {/* Hero Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill border text-xs font-semibold uppercase tracking-widest mb-6"
      >
        <Sparkles className="w-3.5 h-3.5 animate-spin-slow text-[var(--vibe-accent)]" />
        <span>Next-Generation AI Dining Platform</span>
      </motion.div>

      {/* Hero Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="relative z-10 editorial-headline text-5xl sm:text-7xl md:text-8xl text-white max-w-4xl"
      >
        Enjoy healthy and <br />
        delicious food.
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative z-10 text-base sm:text-lg md:text-xl text-zinc-300 max-w-2xl mt-5 font-normal leading-relaxed"
      >
        TableTales reimagines restaurant discovery. Tell our AI Concierge who is eating and how you want to feel; it sets your visual atmosphere, curates dishes by sensory origin, and orchestrates group dining.
      </motion.p>

      {/* Primary CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="relative z-10 flex flex-col sm:flex-row items-center gap-3.5 mt-8 w-full sm:w-auto"
      >
        <button
          onClick={() => setConciergeOpen(true)}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl vibe-glow-button text-sm sm:text-base font-bold text-white shadow-2xl flex items-center justify-center gap-2.5 transition-transform hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-5 h-5" />
          <span>Start My Experience</span>
        </button>

        <button
          onClick={() => {
            const locEl = document.getElementById('locations');
            locEl?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-sm sm:text-base font-semibold text-white transition-all flex items-center justify-center gap-2"
        >
          <MapPin className="w-4 h-4 text-zinc-400" />
          <span>Explore 4 Signature Venues</span>
        </button>
      </motion.div>

      {/* Interactive Vibe Theme Selector Pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="relative z-10 mt-12 w-full max-w-3xl"
      >
        <div className="text-xs font-semibold text-zinc-400 mb-3 uppercase tracking-wider flex items-center justify-center gap-1.5">
          <span>Click to Preview Dynamic Ambiance:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5">
          {VIBE_THEMES.map((theme) => {
            const isActive = vibeTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setVibeTheme(theme.id)}
                className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                  isActive
                    ? 'border-[var(--vibe-primary)] bg-[var(--vibe-card-bg)] shadow-lg ring-1 ring-[var(--vibe-primary)]'
                    : 'border-white/10 bg-black/40 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{theme.icon}</span>
                  {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-[var(--vibe-accent)]" />}
                </div>
                <div className="mt-2">
                  <span className="text-xs font-bold text-white block capitalize">{theme.label}</span>
                  <span className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">{theme.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
