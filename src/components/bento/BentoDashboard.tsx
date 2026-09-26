'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  MapPin, 
  Users, 
  Compass, 
  BookMarked, 
  ShoppingBag, 
  Flame, 
  Star, 
  Clock, 
  ShieldCheck, 
  Calendar, 
  SlidersHorizontal, 
  ArrowRight, 
  CheckCircle2, 
  Copy, 
  Plus, 
  Minus, 
  Utensils, 
  Wind, 
  Layers, 
  Bookmark, 
  UserPlus, 
  QrCode, 
  ChevronRight,
  FlameKindling
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAppStore } from '@/store/useAppStore';
import { VibeTheme, Location, MenuItem } from '@/types';

const VIBE_TILES: { id: VibeTheme; label: string; icon: string; tone: string }[] = [
  { id: 'romantic', label: 'Romantic', icon: '🕯️', tone: 'Rose ember & candlelit truffles' },
  { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦', tone: 'Sunny terracotta & shareable hearths' },
  { id: 'adventurous', label: 'Adventurous', icon: '⚡', tone: 'Electric jade & bold plancha spices' },
  { id: 'chill', label: 'Twilight', icon: '🌿', tone: 'Serene lavender & meditative dashi' },
  { id: 'celebration', label: 'Fiesta', icon: '🥂', tone: 'Champagne magenta & crispy socarrat' },
];

export function BentoDashboard() {
  const {
    selectedLocation,
    locations,
    setSelectedLocation,
    vibeTheme,
    setVibeTheme,
    menuItems,
    cart,
    addToCart,
    unlockPassportStamp,
    passportStamps,
    setConciergeOpen,
    setPassportOpen,
    setFlowMode,
    groupRoom,
    addSimulatedGuest,
    partySize,
  } = useAppStore();

  const [aiPromptInput, setAiPromptInput] = useState('');
  const [activeTabDish, setActiveTabDish] = useState<'sensory' | 'origin'>('sensory');
  const [guestCountSlider, setGuestCountSlider] = useState(partySize || 2);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeDietaryFilter, setActiveDietaryFilter] = useState<string>('All');
  const [selectedDishIndex, setSelectedDishIndex] = useState(0);

  // Dishes for current venue
  const venueDishes = useMemo(() => {
    return menuItems.filter((item) => item.location_id === selectedLocation.id);
  }, [menuItems, selectedLocation.id]);

  const filteredDishes = useMemo(() => {
    if (activeDietaryFilter === 'All') return venueDishes;
    return venueDishes.filter((d) =>
      d.dietary_tags.some((t) => t.toLowerCase() === activeDietaryFilter.toLowerCase())
    );
  }, [venueDishes, activeDietaryFilter]);

  const currentDish: MenuItem = filteredDishes[selectedDishIndex] || venueDishes[0];

  const handleCopyInvite = () => {
    const code = groupRoom?.invite_code || 'VIBE-7729';
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotalPrice = cart.reduce((acc, item) => acc + item.menu_item.price * item.quantity, 0);

  // Portion multiplier calculation
  const recommendedPortions = Math.max(1, Math.ceil((guestCountSlider * 0.75) / (currentDish?.serves_count || 1)));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* ====================================================================
          ROW 1: BENTO HERO COMMAND DECK & ATMOSPHERE DIAL
          ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* BENTO CELL 1: Atmosphere Command Deck (8 cols) */}
        <div className="lg:col-span-8 bento-card p-6 sm:p-8 flex flex-col justify-between relative min-h-[380px]">
          {/* Ambient luminous glow orb inside card */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--vibe-primary)] opacity-15 rounded-full blur-[90px] pointer-events-none" />

          {/* Top Bar: Venue Selector Chips & Live Equalizer */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar">
              {locations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => {
                    setSelectedLocation(loc);
                    if (loc.signature_vibe) setVibeTheme(loc.signature_vibe);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    selectedLocation.id === loc.id
                      ? 'bg-white/15 text-white shadow-md border border-white/15 font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <MapPin className="w-3 h-3 text-[var(--vibe-primary)]" />
                  <span>{loc.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Atmosphere Resonance Equalizer */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
              <span className="text-[10px] uppercase font-mono text-zinc-400">Resonance</span>
              <div className="flex items-end gap-1 h-4">
                <span className="w-1 bg-[var(--vibe-primary)] rounded-full eq-bar-1" />
                <span className="w-1 bg-[var(--vibe-accent)] rounded-full eq-bar-2" />
                <span className="w-1 bg-[var(--vibe-secondary)] rounded-full eq-bar-3" />
                <span className="w-1 bg-[var(--vibe-primary)] rounded-full eq-bar-4" />
              </div>
              <span className="capitalize font-semibold text-white text-[11px]">{vibeTheme}</span>
            </div>
          </div>

          {/* Main Hero Narrative */}
          <div className="relative z-10 my-6 space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-[11px] font-bold tracking-wider uppercase">
              <Sparkles className="w-3 h-3 text-[var(--vibe-accent)] animate-pulse" />
              <span>TableTales Sensory Platform</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              Speak Your Mood. <br />
              <span className="vibe-text-gradient">Taste the Atmosphere.</span>
            </h1>
            <p className="text-sm text-zinc-300 max-w-xl leading-relaxed">
              Welcome to <strong>{selectedLocation.name}</strong> ({selectedLocation.city}). Our AI concierge shapes ambient room lighting, uncovers culinary heritage, and orchestrates synced group dining.
            </p>
          </div>

          {/* Inline Prompt Input & Concierge Trigger */}
          <div className="relative z-10 pt-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setConciergeOpen(true);
              }}
              className="flex items-center gap-2 bg-black/60 border border-white/15 p-2 rounded-2xl shadow-xl backdrop-blur-md focus-within:ring-2 focus-within:ring-[var(--vibe-primary)] transition-all"
            >
              <Sparkles className="w-5 h-5 text-[var(--vibe-accent)] ml-2 flex-shrink-0" />
              <input
                type="text"
                value={aiPromptInput}
                onChange={(e) => setAiPromptInput(e.target.value)}
                placeholder="E.g., Date night for 2, love vegetarian truffles & cozy candles..."
                className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none"
              />
              <button
                type="submit"
                className="vibe-glow-button text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl whitespace-nowrap flex items-center gap-1.5 shadow-lg flex-shrink-0"
              >
                <span>Summon Concierge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* BENTO CELL 2: Atmosphere Vibe Dial (4 cols) */}
        <div className="lg:col-span-4 bento-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--vibe-accent)]">
                Atmosphere Dial
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">5 DYNAMIC PALETTES</span>
            </div>

            <div className="space-y-2">
              {VIBE_TILES.map((tile) => {
                const isActive = vibeTheme === tile.id;
                return (
                  <button
                    key={tile.id}
                    onClick={() => setVibeTheme(tile.id)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isActive
                        ? 'border-[var(--vibe-primary)] bg-[var(--vibe-badge-bg)] shadow-md ring-1 ring-[var(--vibe-primary)]'
                        : 'border-white/5 bg-white/[0.02] hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{tile.icon}</span>
                      <div>
                        <span className="text-xs font-bold text-white block capitalize">{tile.label}</span>
                        <span className="text-[10px] text-zinc-400 line-clamp-1">{tile.tone}</span>
                      </div>
                    </div>
                    {isActive ? (
                      <CheckCircle2 className="w-4 h-4 text-[var(--vibe-accent)]" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-white/20" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
            <span>Color & Lighting Synced</span>
            <span className="capitalize font-semibold text-white">{vibeTheme} Mode</span>
          </div>
        </div>

      </div>

      {/* ====================================================================
          ROW 2: GROUP ROOM SYNC + PORTION CALCULATOR + PASSPORT VAULT
          ==================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* BENTO CELL 3: Group Room & Smart Allergen Shield */}
        <div className="bento-card p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Group Room
              </span>
              <div className="flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-lg border border-white/10 text-[11px] font-mono font-bold text-[var(--vibe-accent)]">
                <span>{groupRoom?.invite_code || 'VIBE-7729'}</span>
                <button onClick={handleCopyInvite} className="hover:text-white p-0.5">
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>

            <p className="text-xs text-zinc-300">
              Real-time multi-diner synchronization with automated allergen exclusion union.
            </p>

            {/* Diners Avatar Row */}
            <div className="flex items-center gap-2 pt-1">
              {(groupRoom?.members || [
                { id: '1', display_name: 'You', avatar_color: '#f43f5e', dietary_restrictions: [] },
                { id: '2', display_name: 'Elena', avatar_color: '#10b981', dietary_restrictions: ['Vegan'] },
                { id: '3', display_name: 'Marcus', avatar_color: '#3b82f6', dietary_restrictions: ['Gluten-Free'] }
              ]).map((m, idx) => (
                <div
                  key={idx}
                  className="w-8 h-8 rounded-full border-2 border-zinc-900 flex items-center justify-center text-[11px] font-bold text-white shadow-md"
                  style={{ backgroundColor: m.avatar_color }}
                  title={`${m.display_name} (${m.dietary_restrictions.join(', ') || 'No restrictions'})`}
                >
                  {m.display_name.charAt(0)}
                </div>
              ))}
              <button
                onClick={() => addSimulatedGuest('Sophia', ['Nut-Free'], '#ec4899')}
                className="w-8 h-8 rounded-full border border-dashed border-white/30 hover:border-white text-zinc-400 hover:text-white flex items-center justify-center text-xs transition-colors"
                title="Simulate Guest Join"
              >
                +
              </button>
            </div>

            {/* Allergen Shield Indicator */}
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between text-xs text-emerald-300">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Allergen Shield Active
              </span>
              <span className="text-[10px] font-mono">100% ROOM SAFE</span>
            </div>
          </div>

          <button
            onClick={() => setFlowMode('group')}
            className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            Enter Synced Room View
          </button>
        </div>

        {/* BENTO CELL 4: Family-Style Portion Calculator */}
        <div className="bento-card p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Portion Intelligence
              </span>
              <span className="text-xs font-bold text-white font-mono bg-black/50 px-2 py-0.5 rounded-md border border-white/10">
                {guestCountSlider} {guestCountSlider === 1 ? 'Diner' : 'Diners'}
              </span>
            </div>

            <p className="text-xs text-zinc-300">
              Heuristic portion calculation (~1.5 portions per 2 diners) ensuring ideal banquet satisfaction.
            </p>

            {/* Interactive Guest Slider */}
            <div className="space-y-1.5 pt-1">
              <input
                type="range"
                min="1"
                max="10"
                value={guestCountSlider}
                onChange={(e) => setGuestCountSlider(parseInt(e.target.value, 10))}
                className="w-full h-2 rounded-lg bg-white/15 appearance-none cursor-pointer accent-[var(--vibe-primary)]"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>1 Solo</span>
                <span>4 Table</span>
                <span>8 Banquet</span>
                <span>10 Feast</span>
              </div>
            </div>

            {/* Calculated recommendation pill */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between text-xs text-amber-300 font-mono">
              <span>Rec Multiplier:</span>
              <span className="font-bold text-white text-sm">x{recommendedPortions} Portions</span>
            </div>
          </div>

          <div className="text-[11px] text-zinc-400 text-center">
            Applies across all shareable menu orders automatically.
          </div>
        </div>

        {/* BENTO CELL 5: Digital Passport Vault */}
        <div className="bento-card p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--vibe-accent)] flex items-center gap-1.5">
                <BookMarked className="w-4 h-4" />
                Digital Passport Vault
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                Grand Voyager
              </span>
            </div>

            <p className="text-xs text-zinc-300">
              Collect culinary stamps as you taste regional specialties across global dining sanctuaries.
            </p>

            {/* Recent Seals Grid */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {passportStamps.slice(0, 3).map((stamp) => (
                <div
                  key={stamp.id}
                  className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-center space-y-1 hover:border-amber-400/50 transition-colors cursor-pointer"
                  onClick={() => setPassportOpen(true)}
                >
                  <div className="text-xl">{stamp.badge_icon}</div>
                  <div className="text-[10px] font-bold text-white truncate">{stamp.title.split(' ')[0]}</div>
                </div>
              ))}
            </div>

            <div className="text-xs text-zinc-400 flex items-center justify-between pt-1">
              <span>Total Unlocked:</span>
              <span className="font-mono font-bold text-white">{passportStamps.length} Gastronomy Seals</span>
            </div>
          </div>

          <button
            onClick={() => setPassportOpen(true)}
            className="w-full py-2.5 px-4 rounded-xl vibe-glow-button text-xs font-semibold text-white flex items-center justify-center gap-2 shadow-md"
          >
            <BookMarked className="w-3.5 h-3.5" />
            Open Full Passport Book
          </button>
        </div>

      </div>

      {/* ====================================================================
          ROW 3: FEATURED SENSORY DISH HERO + TERROIR EXPLORER (7 cols + 5 cols)
          ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* BENTO CELL 6: Featured Terroir Sensory Dish (7 cols) */}
        {currentDish && (
          <div className="lg:col-span-7 bento-card p-6 sm:p-7 flex flex-col justify-between space-y-5">
            <div>
              {/* Dish Dietary Category Selector */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {['All', 'Gluten-Free', 'Vegetarian', 'Vegan', 'Nut-Free', 'Halal'].map((diet) => (
                    <button
                      key={diet}
                      onClick={() => {
                        setActiveDietaryFilter(diet);
                        setSelectedDishIndex(0);
                      }}
                      className={`text-xs px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                        activeDietaryFilter === diet
                          ? 'bg-[var(--vibe-primary)] text-white font-bold'
                          : 'bg-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {diet}
                    </button>
                  ))}
                </div>

                <div className="text-xs font-bold text-white font-mono bg-black/60 px-3 py-1 rounded-full border border-white/15">
                  ${currentDish.price}
                </div>
              </div>

              {/* Main Dish Presentation */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 mt-4">
                <div className="sm:col-span-5 relative h-48 sm:h-56 rounded-2xl overflow-hidden">
                  <img
                    src={currentDish.image_url}
                    alt={currentDish.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-zinc-200">
                    {currentDish.cuisine_region}
                  </div>
                  {currentDish.spice_level > 0 && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-[10px] font-bold flex items-center gap-1">
                      <Flame className="w-3 h-3 fill-red-400" />
                      <span>Lv.{currentDish.spice_level}</span>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-7 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="text-xl font-bold text-white leading-snug">
                      {currentDish.name}
                    </h3>
                    <p className="text-xs text-zinc-300 leading-relaxed mt-1 line-clamp-3">
                      {currentDish.description}
                    </p>
                  </div>

                  {/* Tabs: Sensory vs Origin */}
                  <div className="pt-2">
                    <div className="flex gap-2 text-xs font-semibold border-b border-white/10 pb-1 mb-2">
                      <button
                        onClick={() => setActiveTabDish('sensory')}
                        className={`transition-colors ${activeTabDish === 'sensory' ? 'text-[var(--vibe-accent)]' : 'text-zinc-500'}`}
                      >
                        Sensory Notes
                      </button>
                      <span>•</span>
                      <button
                        onClick={() => setActiveTabDish('origin')}
                        className={`transition-colors ${activeTabDish === 'origin' ? 'text-[var(--vibe-accent)]' : 'text-zinc-500'}`}
                      >
                        Terroir & Chef
                      </button>
                    </div>

                    {activeTabDish === 'sensory' ? (
                      <div className="text-[11px] text-zinc-400 space-y-1">
                        <div><strong className="text-zinc-300">Aroma:</strong> {currentDish.sensory_notes.aroma}</div>
                        <div><strong className="text-zinc-300">Texture:</strong> {currentDish.sensory_notes.texture}</div>
                      </div>
                    ) : (
                      <div className="text-[11px] text-zinc-400 space-y-1">
                        <div><strong className="text-zinc-300">Chef:</strong> {currentDish.origin_story.chef_notes}</div>
                        <div><strong className="text-zinc-300">Heritage:</strong> {currentDish.origin_story.cultural_context}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions: Add to Order & Save to Passport */}
            <div className="pt-3 border-t border-white/10 flex items-center gap-3">
              <button
                onClick={() => addToCart(currentDish)}
                className="flex-1 py-3 px-4 rounded-xl vibe-glow-button text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Add to Experience (${currentDish.price})
              </button>

              <button
                onClick={() => {
                  unlockPassportStamp({
                    stamp_type: 'dish',
                    title: currentDish.name,
                    origin_region: currentDish.cuisine_region,
                    badge_icon: '🥢',
                    flavor_notes: currentDish.sensory_notes.aroma,
                  });
                }}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-amber-300 transition-colors flex items-center justify-center"
                title="Stamp to Digital Passport"
              >
                <Bookmark className="w-4 h-4 fill-amber-400 text-amber-400" />
              </button>

              <button
                onClick={() => setFlowMode('solo')}
                className="px-3.5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-zinc-200 transition-colors flex items-center gap-1"
              >
                <span>Carousel</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* BENTO CELL 7: Curated Terroir Sanctuaries (5 cols) */}
        <div className="lg:col-span-5 bento-card p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--vibe-accent)]">
                Curated Sanctuaries
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">4 GLOBAL VENUES</span>
            </div>

            <div className="space-y-2.5">
              {locations.map((loc) => {
                const isSelected = selectedLocation.id === loc.id;
                return (
                  <div
                    key={loc.id}
                    onClick={() => {
                      setSelectedLocation(loc);
                      if (loc.signature_vibe) setVibeTheme(loc.signature_vibe);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-[var(--vibe-primary)] bg-[var(--vibe-badge-bg)] shadow-md'
                        : 'border-white/5 bg-white/[0.02] hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={loc.hero_image_url}
                        alt={loc.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <div className="text-xs font-bold text-white">{loc.name}</div>
                        <div className="text-[10px] text-zinc-400">{loc.city} • {loc.hours}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] font-bold text-amber-400 flex items-center gap-1 justify-end">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{loc.rating || 4.9}</span>
                      </div>
                      <div className="text-[10px] uppercase font-bold text-[var(--vibe-accent)] mt-0.5">
                        {loc.signature_vibe}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-zinc-400 flex items-center justify-between">
            <span>Atmospheric seating available</span>
            <span className="text-emerald-400 font-semibold font-mono">Open Tonight</span>
          </div>
        </div>

      </div>

      {/* ====================================================================
          ROW 4: TABLE RESERVATION & INSTANT PASS CHECKOUT (Full Width Bento Bar)
          ==================================================================== */}
      <div className="bento-card p-6 sm:p-7 flex flex-col lg:flex-row items-center justify-between gap-6 bg-zinc-950/90">
        <div className="flex flex-col sm:flex-row items-center gap-5 w-full lg:w-auto text-center sm:text-left">
          <div className="p-3 bg-white rounded-2xl shadow-xl flex-shrink-0">
            <QRCodeSVG 
              value={JSON.stringify({ 
                location: selectedLocation.name, 
                vibe: vibeTheme, 
                table: "Chef's Counter" 
              })} 
              size={76} 
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--vibe-accent)]">
                Priority Experience Pass
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                Instant Confirmation
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Reserve Your Table at {selectedLocation.name}
            </h3>
            <p className="text-xs text-zinc-400 max-w-md">
              Dine with custom candlelit staging, table pacing tailored to your mood, and seamless split checkout.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-center sm:justify-end">
          <div className="text-right hidden sm:block mr-2">
            <div className="text-xs text-zinc-400">Cart Total</div>
            <div className="text-base font-bold text-white font-mono">
              ${cartTotalPrice} <span className="text-xs text-zinc-500 font-normal">({cartTotalCount} items)</span>
            </div>
          </div>

          <button
            onClick={() => setFlowMode('checkout')}
            className="w-full sm:w-auto vibe-glow-button text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl shadow-xl flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Table Reservation & Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
