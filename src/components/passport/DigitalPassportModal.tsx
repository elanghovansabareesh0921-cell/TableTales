'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookMarked, 
  X, 
  Award, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Compass, 
  ShieldCheck,
  Globe2,
  ChevronRight
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function DigitalPassportModal() {
  const { isPassportOpen, setPassportOpen, passportStamps, currentUserName, setFlowMode } = useAppStore();
  const [filterType, setFilterType] = useState<'all' | 'dish' | 'region' | 'vibe'>('all');

  const filteredStamps = passportStamps.filter((stamp) => {
    if (filterType === 'all') return true;
    return stamp.stamp_type === filterType;
  });

  if (!isPassportOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setPassportOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Passport Booklet Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 15 }}
          className="relative z-10 w-full max-w-2xl max-h-[85vh] flex flex-col glass-panel rounded-3xl border border-white/20 bg-zinc-950/95 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-zinc-900/60">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg"
                style={{ background: 'linear-gradient(135deg, var(--vibe-primary), var(--vibe-secondary))' }}
              >
                <BookMarked className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Digital Dining Passport</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Grand Voyager
                  </span>
                </h2>
                <p className="text-xs text-zinc-400">
                  Passport ID: #TT-PASSPORT-8824 • Traveler: {currentUserName}
                </p>
              </div>
            </div>

            <button
              onClick={() => setPassportOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Traveler Stats Banner */}
          <div className="p-4 bg-white/[0.02] border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-zinc-300">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white">{passportStamps.length}</span> Total Stamps
              </div>
              <div className="flex items-center gap-1.5 text-zinc-300">
                <Globe2 className="w-4 h-4 text-sky-400" />
                <span className="font-bold text-white">4</span> Culinary Terroirs
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
              {(['all', 'dish', 'region', 'vibe'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition-all capitalize ${
                    filterType === type
                      ? 'bg-white/15 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Stamps Grid Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {filteredStamps.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredStamps.map((stamp) => (
                  <motion.div
                    key={stamp.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-white/20 transition-all flex items-start gap-3 bg-white/[0.02]"
                  >
                    {/* Stamp Circular Emblem */}
                    <div className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-xl bg-gradient-to-br from-amber-500/20 via-rose-500/10 to-transparent border border-amber-500/30 shadow-inner">
                      {stamp.badge_icon}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--vibe-accent)]">
                          {stamp.stamp_type} stamp
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {new Date(stamp.earned_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-white leading-snug">
                        {stamp.title}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                        <MapPin className="w-3 h-3 text-zinc-500" />
                        <span>{stamp.origin_region}</span>
                      </div>
                      {stamp.flavor_notes && (
                        <p className="text-[11px] text-zinc-300 italic pt-1 border-t border-white/5 line-clamp-2">
                          &quot;{stamp.flavor_notes}&quot;
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-zinc-500 text-xs">
                No stamps found for this filter category.
              </div>
            )}
          </div>

          {/* Footer CTA */}
          <div className="p-4 border-t border-white/10 bg-zinc-950/80 flex items-center justify-between">
            <span className="text-xs text-zinc-400">
              Explore more dishes & venues to unlock rare regional gastronomy seals.
            </span>
            <button
              onClick={() => {
                setPassportOpen(false);
                setFlowMode('solo');
              }}
              className="vibe-glow-button text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5"
            >
              <span>Explore More Dishes</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
