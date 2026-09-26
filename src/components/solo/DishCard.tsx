'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Plus, 
  Bookmark, 
  Flame, 
  Users, 
  Wind, 
  Layers, 
  Thermometer, 
  UtensilsCrossed, 
  Globe2, 
  BookOpen, 
  Check 
} from 'lucide-react';
import { MenuItem } from '@/types';
import { useAppStore } from '@/store/useAppStore';

interface DishCardProps {
  dish: MenuItem;
  isActive: boolean;
}

export function DishCard({ dish, isActive }: DishCardProps) {
  const [activeTab, setActiveTab] = useState<'sensory' | 'origin'>('sensory');
  const [isAdded, setIsAdded] = useState(false);
  const [isSavedToPassport, setIsSavedToPassport] = useState(false);

  const { addToCart, unlockPassportStamp, passportStamps } = useAppStore();

  const isAlreadyStamped = passportStamps.some((s) => s.title === dish.name);

  const handleAddToCart = () => {
    addToCart(dish);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleSaveToPassport = () => {
    unlockPassportStamp({
      stamp_type: 'dish',
      title: dish.name,
      origin_region: dish.cuisine_region,
      badge_icon: '🥢',
      flavor_notes: dish.sensory_notes.aroma,
    });
    setIsSavedToPassport(true);
    setTimeout(() => setIsSavedToPassport(false), 2200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative w-full max-w-xl mx-auto rounded-3xl overflow-hidden glass-panel border border-white/15 bg-zinc-950/80 shadow-2xl flex flex-col"
    >
      {/* Dish Hero Image Header */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden">
        <img
          src={dish.image_url}
          alt={dish.name}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
          {dish.is_signature && (
            <span className="flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full vibe-glow-button text-white uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              Signature
            </span>
          )}
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-zinc-200">
            {dish.cuisine_region}
          </span>
        </div>

        {/* Price & Spice */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {dish.spice_level > 0 && (
            <div className="flex items-center gap-0.5 px-2.5 py-1 rounded-full bg-red-950/70 border border-red-500/40 text-red-400 text-xs font-semibold">
              <Flame className="w-3 h-3 fill-red-400" />
              <span>Lv.{dish.spice_level}</span>
            </div>
          )}
          <span className="text-sm font-bold px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white">
            ${dish.price}
          </span>
        </div>

        {/* Title & Tagline overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
            {dish.name}
          </h2>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-300">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-zinc-400" />
              Serves {dish.serves_count} {dish.serves_count === 1 ? 'person' : 'people (Shareable)'}
            </span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        {/* Short sensory description */}
        <p className="text-sm text-zinc-300 leading-relaxed font-normal">
          {dish.description}
        </p>

        {/* Dietary Tag Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {dish.dietary_tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Tabs: Sensory Notes vs Origin Story */}
        <div className="pt-2">
          <div className="flex rounded-xl bg-black/40 p-1 border border-white/10">
            <button
              onClick={() => setActiveTab('sensory')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'sensory'
                  ? 'bg-white/15 text-white shadow-sm border border-white/10'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Wind className="w-3.5 h-3.5 text-[var(--vibe-accent)]" />
              Sensory Profile
            </button>
            <button
              onClick={() => setActiveTab('origin')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'origin'
                  ? 'bg-white/15 text-white shadow-sm border border-white/10'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5 text-[var(--vibe-accent)]" />
              Heritage & Origin
            </button>
          </div>

          <div className="mt-3 min-h-[140px]">
            {activeTab === 'sensory' ? (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs"
              >
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-zinc-300">
                    <Wind className="w-3.5 h-3.5 text-amber-400" />
                    <span>Aroma</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    {dish.sensory_notes.aroma}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-zinc-300">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Texture</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    {dish.sensory_notes.texture}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-zinc-300">
                    <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                    <span>Temperature</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    {dish.sensory_notes.temperature}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-zinc-300">
                    <UtensilsCrossed className="w-3.5 h-3.5 text-sky-400" />
                    <span>Plating Artistry</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    {dish.sensory_notes.plating}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2.5 text-xs"
              >
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-1.5 font-semibold text-zinc-300 mb-1">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>Chef&apos;s Notes</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    {dish.origin_story.chef_notes}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-1.5 font-semibold text-zinc-300 mb-1">
                    <Globe2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>Cultural Context</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    {dish.origin_story.cultural_context}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              isAdded
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                : 'vibe-glow-button text-white shadow-lg'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                Added to Order
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add to Experience (${dish.price})
              </>
            )}
          </button>

          <button
            onClick={handleSaveToPassport}
            disabled={isAlreadyStamped}
            title={isAlreadyStamped ? 'Stamped in Passport' : 'Stamp Dish to Digital Passport'}
            className={`p-3 rounded-2xl border transition-all flex items-center justify-center ${
              isAlreadyStamped || isSavedToPassport
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-white/5 hover:bg-white/15 border-white/10 text-zinc-300 hover:text-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isAlreadyStamped || isSavedToPassport ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
