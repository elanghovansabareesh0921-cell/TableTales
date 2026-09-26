'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Compass, 
  Filter, 
  Sparkles, 
  Users, 
  ShoppingBag, 
  ArrowRight,
  BookOpenCheck,
  X,
  MapPin
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { DishCard } from './DishCard';

const DIETARY_OPTIONS = ['Nut-Free', 'Gluten-Free', 'Vegetarian', 'Vegan', 'Dairy-Free', 'Halal'];

export function DishCarousel() {
  const { 
    selectedLocation, 
    menuItems, 
    activeDietaryFilters, 
    toggleDietaryFilter, 
    clearDietaryFilters,
    cart, 
    setFlowMode, 
    setConciergeOpen,
    passportStamps,
    vibeTheme
  } = useAppStore();

  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter items for current location and dietary preferences
  const filteredDishes = useMemo(() => {
    let items = menuItems.filter((item) => item.location_id === selectedLocation.id);

    if (activeDietaryFilters.length > 0) {
      items = items.filter((dish) => {
        // Must contain all active filters or match
        return activeDietaryFilters.every((filter) =>
          dish.dietary_tags.some((tag) => tag.toLowerCase() === filter.toLowerCase())
        );
      });
    }

    return items;
  }, [menuItems, selectedLocation.id, activeDietaryFilters]);

  const totalDishes = filteredDishes.length;
  const currentDish = filteredDishes[currentIndex] || filteredDishes[0];

  // Calculate Exploration Depth (stamps earned from this location's cuisine)
  const exploredCount = useMemo(() => {
    const dishNames = new Set(filteredDishes.map((d) => d.name));
    return passportStamps.filter((s) => dishNames.has(s.title)).length;
  }, [passportStamps, filteredDishes]);

  const explorationPercent = totalDishes > 0 ? Math.round((exploredCount / totalDishes) * 100) : 0;

  const handleNext = () => {
    if (totalDishes === 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalDishes);
  };

  const handlePrev = () => {
    if (totalDishes === 0) return;
    setCurrentIndex((prev) => (prev - 1 + totalDishes) % totalDishes);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartPrice = cart.reduce((acc, item) => acc + item.menu_item.price * item.quantity, 0);

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full flex flex-col justify-between py-6 px-4 sm:px-8 max-w-6xl mx-auto">
      {/* Top Bar: Location Title, Exploration Progress, Dietary Filters */}
      <div className="w-full space-y-4 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
              <MapPin className="w-3.5 h-3.5 text-[var(--vibe-primary)]" />
              <span>{selectedLocation.city}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-[var(--vibe-accent)] capitalize">{vibeTheme} Vibe</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
              Solo Sensory Journey: {selectedLocation.name}
            </h1>
          </div>

          {/* Exploration Depth Meter */}
          <div className="flex items-center gap-3 p-3 rounded-2xl glass-panel border border-white/10 w-full sm:w-auto">
            <div className="p-2 rounded-xl bg-white/5 text-[var(--vibe-accent)]">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div className="flex-1 sm:w-48">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-300 font-medium">Exploration Depth</span>
                <span className="font-bold text-[var(--vibe-accent)]">
                  {exploredCount} of {totalDishes} Stamped
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${explorationPercent}%`,
                    background: 'linear-gradient(90deg, var(--vibe-primary), var(--vibe-secondary))',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dietary Filters Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium whitespace-nowrap pl-1 pr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {DIETARY_OPTIONS.map((opt) => {
            const isSelected = activeDietaryFilters.includes(opt);
            return (
              <button
                key={opt}
                onClick={() => {
                  toggleDietaryFilter(opt);
                  setCurrentIndex(0);
                }}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'vibe-glow-button text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300'
                }`}
              >
                {opt}
                {isSelected && <X className="w-3 h-3" />}
              </button>
            );
          })}

          {activeDietaryFilters.length > 0 && (
            <button
              onClick={() => {
                clearDietaryFilters();
                setCurrentIndex(0);
              }}
              className="text-xs text-zinc-400 hover:text-white underline underline-offset-4 whitespace-nowrap ml-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Card Carousel Stage */}
      <div className="relative flex-1 flex items-center justify-center py-4">
        {totalDishes > 0 && currentDish ? (
          <div className="relative w-full flex items-center justify-center">
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              disabled={totalDishes <= 1}
              className="hidden sm:flex absolute -left-4 md:-left-8 z-10 w-12 h-12 rounded-full glass-panel border border-white/15 items-center justify-center text-white hover:bg-white/15 transition-all shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous dish"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Active Card */}
            <AnimatePresence mode="wait">
              <DishCard
                key={currentDish.id}
                dish={currentDish}
                isActive={true}
              />
            </AnimatePresence>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={totalDishes <= 1}
              className="hidden sm:flex absolute -right-4 md:-right-8 z-10 w-12 h-12 rounded-full glass-panel border border-white/15 items-center justify-center text-white hover:bg-white/15 transition-all shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next dish"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        ) : (
          <div className="p-10 text-center glass-panel rounded-3xl max-w-md mx-auto space-y-4 border border-white/10">
            <Sparkles className="w-10 h-10 mx-auto text-zinc-500" />
            <h3 className="text-lg font-bold text-white">No dishes match these filters</h3>
            <p className="text-xs text-zinc-400">
              Try adjusting your dietary filter selections to explore other sensory delicacies.
            </p>
            <button
              onClick={clearDietaryFilters}
              className="vibe-glow-button text-white text-xs font-semibold px-4 py-2.5 rounded-xl"
            >
              Show All Dishes
            </button>
          </div>
        )}
      </div>

      {/* Mobile Nav Indicators & Buttons */}
      {totalDishes > 1 && (
        <div className="flex sm:hidden items-center justify-between py-3 px-2">
          <button
            onClick={handlePrev}
            className="p-3 rounded-full bg-white/10 text-white border border-white/10"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5">
            {filteredDishes.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentIndex
                    ? 'w-6 bg-[var(--vibe-primary)]'
                    : 'w-1.5 bg-white/20'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="p-3 rounded-full bg-white/10 text-white border border-white/10"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Persistent Floating Bottom Bar: Cart & Branching Options */}
      <div className="sticky bottom-4 z-30 mt-6">
        <div className="glass-panel rounded-2xl p-3 sm:p-4 border border-white/15 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-950/90">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white relative">
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[var(--vibe-primary)] text-white text-[11px] font-bold flex items-center justify-center shadow-lg">
                  {totalCartCount}
                </span>
              )}
            </div>
            <div>
              <div className="text-xs text-zinc-400">Current Experience Order</div>
              <div className="text-sm font-bold text-white">
                {totalCartCount === 0 ? 'No dishes added yet' : `${totalCartCount} items • $${totalCartPrice}`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => setConciergeOpen(true)}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-zinc-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--vibe-accent)]" />
              Ask Concierge
            </button>

            <button
              onClick={() => setFlowMode('group')}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-zinc-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-sky-400" />
              Create Group Room
            </button>

            <button
              onClick={() => setFlowMode('checkout')}
              className="flex-1 sm:flex-none vibe-glow-button text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <span>Table & Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
