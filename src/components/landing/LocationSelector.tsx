'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Star, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  Search,
  CheckCircle2
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Location } from '@/types';

export function LocationSelector() {
  const { locations, selectedLocation, setSelectedLocation, setConciergeOpen, setFlowMode, setVibeTheme } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location);
    if (location.signature_vibe) {
      setVibeTheme(location.signature_vibe);
    }
  };

  const handleStartExperience = (location: Location) => {
    handleSelectLocation(location);
    setConciergeOpen(true);
  };

  return (
    <div id="locations" className="w-full max-w-6xl mx-auto py-12 px-4 sm:px-8 space-y-8">
      {/* Section Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--vibe-accent)]">
            <Compass className="w-4 h-4" />
            <span>Curated Sanctuaries</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Choose Your Dining Destination
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            Each TableTales location features a dedicated culinary terroir, sensory storytelling repertoire, and immersive ambient lighting.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search venue or city..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[var(--vibe-primary)]"
          />
        </div>
      </div>

      {/* Location Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLocations.map((loc) => {
          const isSelected = selectedLocation.id === loc.id;

          return (
            <motion.div
              key={loc.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              onClick={() => handleSelectLocation(loc)}
              className={`rounded-3xl overflow-hidden glass-panel border cursor-pointer transition-all duration-300 flex flex-col justify-between group ${
                isSelected
                  ? 'border-[var(--vibe-primary)] ring-1 ring-[var(--vibe-primary)] shadow-2xl bg-zinc-950/90'
                  : 'border-white/10 hover:border-white/25 bg-zinc-950/70'
              }`}
            >
              {/* Hero Image */}
              <div className="relative h-56 sm:h-64 w-full overflow-hidden">
                <img
                  src={loc.hero_image_url}
                  alt={loc.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-white text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{loc.rating || 4.9}</span>
                </div>

                {/* Signature Vibe Badge */}
                {loc.signature_vibe && (
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full glass-pill text-xs font-semibold uppercase tracking-wider">
                    {loc.signature_vibe} vibe
                  </div>
                )}

                {/* Title on Image */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[var(--vibe-primary)]" />
                    <span>{loc.city}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {loc.name}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {loc.description}
                  </p>
                  <p className="text-xs text-[var(--vibe-accent)] italic font-serif">
                    &quot;{loc.tagline}&quot;
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {loc.hours}
                    </span>
                    <span className="text-zinc-500 font-mono text-[11px] truncate max-w-[180px]">
                      {loc.address}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartExperience(loc);
                      }}
                      className="flex-1 py-2.5 px-4 rounded-xl vibe-glow-button text-xs font-semibold text-white flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Launch AI Concierge</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectLocation(loc);
                        setFlowMode('solo');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-zinc-200 transition-colors flex items-center gap-1.5"
                    >
                      <span>Menu</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
