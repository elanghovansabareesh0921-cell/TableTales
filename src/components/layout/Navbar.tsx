'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Users, 
  Compass, 
  BookMarked, 
  ShoppingBag, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function Navbar() {
  const { 
    selectedLocation, 
    locations, 
    setSelectedLocation, 
    flowMode, 
    setFlowMode, 
    setConciergeOpen, 
    setPassportOpen, 
    passportStamps, 
    cart,
    vibeTheme
  } = useAppStore();

  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 bg-zinc-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setFlowMode('landing')}
            className="flex items-center gap-2.5 group text-left"
          >
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg, var(--vibe-primary), var(--vibe-secondary))' }}
            >
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white block">
                TableTales
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--vibe-accent)] -mt-1 block">
                AI Vibe Concierge
              </span>
            </div>
          </button>

          {/* Location Selector Pill */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-200 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[var(--vibe-primary)]" />
              <span className="font-semibold">{selectedLocation.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {isLocationDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 glass-panel rounded-2xl p-2 border border-white/15 bg-zinc-950 shadow-2xl z-50 space-y-1">
                {locations.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setIsLocationDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-center justify-between ${
                      selectedLocation.id === loc.id
                        ? 'bg-[var(--vibe-badge-bg)] text-white font-semibold'
                        : 'text-zinc-300 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{loc.name}</div>
                      <div className="text-[10px] text-zinc-400">{loc.city}</div>
                    </div>
                    {loc.signature_vibe && (
                      <span className="text-[10px] uppercase font-bold text-[var(--vibe-accent)]">
                        {loc.signature_vibe}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => setFlowMode('landing')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              flowMode === 'landing' ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Venues
          </button>

          <button
            onClick={() => setFlowMode('solo')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              flowMode === 'solo' ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[var(--vibe-accent)]" />
            Solo Journey
          </button>

          <button
            onClick={() => setFlowMode('group')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              flowMode === 'group' ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-sky-400" />
            Group Room
          </button>

          <button
            onClick={() => setPassportOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <BookMarked className="w-3.5 h-3.5 text-amber-400" />
            <span>Passport</span>
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
              {passportStamps.length}
            </span>
          </button>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Cart Preview Button */}
          <button
            onClick={() => setFlowMode('checkout')}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white relative transition-all"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[var(--vibe-primary)] text-white text-[10px] font-bold flex items-center justify-center shadow-lg">
                {cartCount}
              </span>
            )}
          </button>

          {/* Interactive Prototype Launcher */}
          <a
            href="/interactive-prototype.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[var(--vibe-accent)] transition-all hover:scale-105"
            title="Open Creative Technologist 3D Interactive Canvas Prototype"
          >
            <span>✦</span>
            <span>Creative 3D Prototype</span>
          </a>

          {/* Launch AI Concierge Button */}
          <button
            onClick={() => setConciergeOpen(true)}
            className="vibe-glow-button text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask Concierge</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 text-zinc-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden p-4 border-t border-white/10 bg-zinc-950/95 space-y-2">
          <button
            onClick={() => {
              setFlowMode('landing');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left p-2.5 rounded-xl text-xs font-semibold text-zinc-200 hover:bg-white/10"
          >
            Venues & Locations
          </button>
          <button
            onClick={() => {
              setFlowMode('solo');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left p-2.5 rounded-xl text-xs font-semibold text-zinc-200 hover:bg-white/10 flex items-center gap-2"
          >
            <Compass className="w-3.5 h-3.5 text-[var(--vibe-accent)]" />
            Solo Sensory Exploration
          </button>
          <button
            onClick={() => {
              setFlowMode('group');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left p-2.5 rounded-xl text-xs font-semibold text-zinc-200 hover:bg-white/10 flex items-center gap-2"
          >
            <Users className="w-3.5 h-3.5 text-sky-400" />
            Group Room & Synced Orders
          </button>
          <button
            onClick={() => {
              setPassportOpen(true);
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left p-2.5 rounded-xl text-xs font-semibold text-zinc-200 hover:bg-white/10 flex items-center gap-2"
          >
            <BookMarked className="w-3.5 h-3.5 text-amber-400" />
            Digital Dining Passport ({passportStamps.length} Stamps)
          </button>
        </div>
      )}
    </header>
  );
}
