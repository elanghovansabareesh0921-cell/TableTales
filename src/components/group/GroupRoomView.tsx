'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Copy, 
  Check, 
  Lock, 
  Unlock, 
  ShieldAlert, 
  Calculator, 
  Plus, 
  Minus, 
  Trash2, 
  UserPlus, 
  ArrowRight, 
  ShoppingBag, 
  Sparkles, 
  Share2, 
  CheckCircle,
  AlertTriangle,
  Compass
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { MenuItem } from '@/types';

export function GroupRoomView() {
  const {
    groupRoom,
    selectedLocation,
    menuItems,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    applyFamilyPortions,
    lockGroupRoom,
    addSimulatedGuest,
    setFlowMode,
    currentUserName,
    vibeTheme,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'safe_menu' | 'shared_cart' | 'members'>('safe_menu');
  const [copiedCode, setCopiedCode] = useState(false);
  const [strictSafeMode, setStrictSafeMode] = useState(true);

  // If no room is active yet, initialize or invite creation
  const room = groupRoom || {
    id: 'room-demo',
    host_user_id: 'host-1',
    location_id: selectedLocation.id,
    invite_code: 'VIBE-7729',
    status: 'active' as const,
    members: [
      {
        id: 'member-1',
        room_id: 'room-demo',
        display_name: 'You (Host)',
        dietary_restrictions: ['Gluten-Free'],
        is_host: true,
        avatar_color: '#f43f5e',
        joined_at: new Date().toISOString(),
      },
    ],
    cart: cart,
    created_at: new Date().toISOString(),
  };

  const isHost = room.members.find((m) => m.display_name.includes('Host') || m.is_host)?.display_name === currentUserName || true;

  // Auto-merge dietary exclusions across ALL room members
  const mergedExclusionFilters = useMemo(() => {
    const allFilters = new Set<string>();
    room.members.forEach((member) => {
      member.dietary_restrictions.forEach((restriction) => {
        allFilters.add(restriction);
      });
    });
    return Array.from(allFilters);
  }, [room.members]);

  // Filter location dishes
  const locationDishes = useMemo(() => {
    return menuItems.filter((item) => item.location_id === selectedLocation.id);
  }, [menuItems, selectedLocation.id]);

  // Check if dish is safe for everyone in the room
  const checkDishSafety = (dish: MenuItem) => {
    const dishTags = dish.dietary_tags.map((t) => t.toLowerCase());
    const conflicts: string[] = [];

    mergedExclusionFilters.forEach((filter) => {
      // E.g., if room member requires 'Nut-Free', dish must have 'Nut-Free'
      // If room member requires 'Vegan', dish must have 'Vegan'
      if (!dishTags.includes(filter.toLowerCase())) {
        conflicts.push(filter);
      }
    });

    return {
      isSafe: conflicts.length === 0,
      conflicts,
    };
  };

  const safeDishes = useMemo(() => {
    if (!strictSafeMode) return locationDishes;
    return locationDishes.filter((dish) => checkDishSafety(dish).isSafe);
  }, [locationDishes, strictSafeMode, mergedExclusionFilters]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(room.invite_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartPrice = cart.reduce((acc, item) => acc + item.menu_item.price * item.quantity, 0);

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full flex flex-col justify-between py-6 px-4 sm:px-8 max-w-6xl mx-auto">
      {/* Group Room Header & Code Banner */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-3xl glass-panel border border-white/15 bg-zinc-950/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-400 font-bold">Live Synced Room</span>
              <span>•</span>
              <span>{selectedLocation.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Group Dining Room
            </h1>
            <p className="text-xs text-zinc-400">
              Real-time shared menu & allergen-filtered cart for {room.members.length} {room.members.length === 1 ? 'diner' : 'diners'}.
            </p>
          </div>

          {/* Room Code & Invite Controls */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/60 border border-white/10">
              <span className="text-xs text-zinc-400">Invite Code:</span>
              <span className="text-sm font-mono font-bold tracking-widest text-[var(--vibe-accent)]">
                {room.invite_code}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-1 rounded-md hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                title="Copy code"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Quick Demo: Simulate Guest Join */}
            <button
              onClick={() => {
                const guests = [
                  { name: 'Elena', dietary: ['Vegan', 'Nut-Free'] },
                  { name: 'Marcus', dietary: ['Gluten-Free'] },
                  { name: 'Sophia', dietary: ['Halal'] },
                  { name: 'Kenji', dietary: ['Nut-Free'] },
                ];
                const nextGuest = guests[room.members.length % guests.length];
                addSimulatedGuest(nextGuest.name, nextGuest.dietary);
              }}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-colors"
              title="Add simulated friend to test real-time merged allergies and cart"
            >
              <UserPlus className="w-3.5 h-3.5 text-sky-400" />
              + Simulate Guest Join
            </button>
          </div>
        </div>

        {/* Room Members & Merged Allergy Bar */}
        <div className="p-4 rounded-2xl glass-panel border border-white/10 bg-zinc-950/60 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Diners Avatar Row */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-xs text-zinc-400 font-medium whitespace-nowrap mr-1">Diners:</span>
              {room.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white whitespace-nowrap"
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                    style={{ backgroundColor: member.avatar_color }}
                  >
                    {member.display_name.charAt(0)}
                  </div>
                  <span className="font-medium">{member.display_name}</span>
                  {member.dietary_restrictions.length > 0 && (
                    <span className="text-[10px] text-zinc-400">
                      ({member.dietary_restrictions.join(', ')})
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Smart Merged Allergy Indicator */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-400">Room Allergen Filter:</span>
              {mergedExclusionFilters.length > 0 ? (
                <div className="flex items-center gap-1">
                  {mergedExclusionFilters.map((filter) => (
                    <span
                      key={filter}
                      className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 text-[11px]"
                    >
                      Safe for {filter}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-zinc-400">Open Palette (No allergies)</span>
              )}
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex rounded-2xl bg-black/40 p-1.5 border border-white/10 max-w-md">
          <button
            onClick={() => setActiveTab('safe_menu')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'safe_menu'
                ? 'vibe-glow-button text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Room-Safe Menu ({safeDishes.length})
          </button>
          <button
            onClick={() => setActiveTab('shared_cart')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'shared_cart'
                ? 'vibe-glow-button text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Live Cart ({totalCartCount})
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1">
        {activeTab === 'safe_menu' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-400">
                Dishes dynamically filtered to guarantee safety for all {room.members.length} diners.
              </p>
              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={strictSafeMode}
                  onChange={(e) => setStrictSafeMode(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-800 text-[var(--vibe-primary)] focus:ring-[var(--vibe-primary)]"
                />
                <span>Strict Room-Safe Only</span>
              </label>
            </div>

            {/* Dish Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {safeDishes.map((dish) => {
                const { isSafe, conflicts } = checkDishSafety(dish);
                const inCart = cart.find((c) => c.menu_item.id === dish.id);

                return (
                  <motion.div
                    key={dish.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl glass-panel p-4 border flex flex-col justify-between space-y-3 transition-all ${
                      isSafe ? 'border-white/10 hover:border-white/25' : 'border-amber-500/30 opacity-70'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="relative h-40 w-full rounded-xl overflow-hidden">
                        <img
                          src={dish.image_url}
                          alt={dish.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-bold border border-white/10">
                          ${dish.price}
                        </div>
                        {isSafe ? (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-500/80 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            100% Room Safe
                          </div>
                        ) : (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-500/80 backdrop-blur-md text-black text-[10px] font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Conflict: {conflicts.join(', ')}
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="font-bold text-base text-white">{dish.name}</h3>
                        <p className="text-xs text-zinc-400 line-clamp-2 mt-0.5">
                          {dish.description}
                        </p>
                      </div>

                      {/* Sensory note highlight */}
                      <div className="p-2 rounded-lg bg-white/[0.03] text-[11px] text-zinc-300 italic border border-white/5">
                        &quot;{dish.sensory_notes.aroma}&quot;
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {dish.dietary_tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-zinc-400"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      {inCart ? (
                        <div className="flex-1 flex items-center justify-between p-1 rounded-xl bg-white/10 border border-white/15">
                          <button
                            onClick={() => updateCartQuantity(dish.id, -1)}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-white"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-white px-2">
                            {inCart.quantity} in cart
                          </span>
                          <button
                            onClick={() => updateCartQuantity(dish.id, 1)}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-white"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(dish, currentUserName)}
                          className="w-full py-2.5 px-4 rounded-xl vibe-glow-button text-xs font-semibold text-white flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add for Room (${dish.price})
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'shared_cart' && (
          <div className="space-y-6">
            {/* Family-Style Portion Calculator Bar */}
            <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-white/15 bg-zinc-950/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                  <Calculator className="w-4 h-4 text-amber-400" />
                  <span>Family-Style Portion Intelligence</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Calculates optimal dish quantity based on {room.members.length} diners (~1.5 portions per 2 diners).
                </p>
              </div>

              <button
                onClick={() => applyFamilyPortions(room.members.length)}
                disabled={cart.length === 0}
                className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-40"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Apply Recommended Portions ({room.members.length} Diners)
              </button>
            </div>

            {/* Cart Items List */}
            {cart.length > 0 ? (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-950/60"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.menu_item.image_url}
                        alt={item.menu_item.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-white">{item.menu_item.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                          <span>${item.menu_item.price} each</span>
                          <span>•</span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
                            Added by {item.added_by}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl p-1">
                        <button
                          onClick={() => updateCartQuantity(item.menu_item.id, -1)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-white"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-white px-2">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.menu_item.id, 1)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-white"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-sm font-bold text-white min-w-[70px] text-right">
                        ${item.menu_item.price * item.quantity}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.menu_item.id)}
                        className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-white/5 transition-colors"
                        title="Remove dish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center glass-panel rounded-3xl border border-white/10 space-y-3">
                <ShoppingBag className="w-10 h-10 mx-auto text-zinc-600" />
                <h3 className="text-lg font-bold text-white">Group cart is empty</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Browse the room-safe menu tab to add shared starters, signature mains, and artisanal desserts.
                </p>
                <button
                  onClick={() => setActiveTab('safe_menu')}
                  className="vibe-glow-button text-white text-xs font-semibold px-4 py-2.5 rounded-xl"
                >
                  Explore Safe Dishes
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Bottom Bar: Order Lock & Proceed to Checkout */}
      <div className="sticky bottom-4 z-30 mt-6">
        <div className="glass-panel rounded-2xl p-4 border border-white/15 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-950/90">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs text-zinc-400">
                Shared Total ({totalCartCount} items for {room.members.length} diners)
              </div>
              <div className="text-base font-bold text-white">
                ${totalCartPrice} <span className="text-xs font-normal text-zinc-400">(${room.members.length > 0 ? (totalCartPrice / room.members.length).toFixed(2) : totalCartPrice} / person)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {isHost && (
              <button
                onClick={lockGroupRoom}
                className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-zinc-200 transition-colors flex items-center justify-center gap-1.5"
              >
                {room.status === 'locked' ? (
                  <>
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    Order Locked
                  </>
                ) : (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-zinc-400" />
                    Lock Order
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => setFlowMode('solo')}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-zinc-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5" />
              Solo View
            </button>

            <button
              onClick={() => setFlowMode('checkout')}
              disabled={cart.length === 0}
              className="flex-1 sm:flex-none vibe-glow-button text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Split & Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
