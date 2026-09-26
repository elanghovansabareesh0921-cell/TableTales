'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Users, 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  QrCode, 
  Share2, 
  Download, 
  UtensilsCrossed, 
  Receipt,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAppStore } from '@/store/useAppStore';

export function CheckoutModal() {
  const { 
    selectedLocation, 
    cart, 
    groupRoom, 
    partySize, 
    setFlowMode, 
    createReservation, 
    createOrder,
    lastReservation,
    lastOrder,
    vibeTheme
  } = useAppStore();

  const [checkoutType, setCheckoutType] = useState<'reservation' | 'order'>('reservation');

  // Reservation Form State
  const [guestName, setGuestName] = useState('Alex Rivers');
  const [guestEmail, setGuestEmail] = useState('alex@example.com');
  const [guestPhone, setGuestPhone] = useState('+1 (415) 555-0192');
  const [resDate, setResDate] = useState('2026-10-04');
  const [resTime, setResTime] = useState('19:30');
  const [seatingArea, setSeatingArea] = useState('Chef’s Counter (Candlelit View)');
  const [specialRequests, setSpecialRequests] = useState('Celebrating anniversary; vegetarian tasting preferences.');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');

  // Payment / Split State
  const [splitType, setSplitType] = useState<'single' | 'equal' | 'itemized'>('equal');
  const [tipPercentage, setTipPercentage] = useState(18);

  const subtotal = cart.reduce((acc, item) => acc + item.menu_item.price * item.quantity, 0);
  const tax = +(subtotal * 0.09).toFixed(2);
  const tip = +(subtotal * (tipPercentage / 100)).toFixed(2);
  const total = +(subtotal + tax + tip).toFixed(2);

  const roomMembers = groupRoom?.members || [];
  const dinerCount = roomMembers.length > 0 ? roomMembers.length : partySize || 2;
  const perPersonAmount = +(total / dinerCount).toFixed(2);

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const code = `TT-RES-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmationCode(code);
      createReservation({
        id: `res-${Date.now()}`,
        location_id: selectedLocation.id,
        customer_name: guestName,
        customer_email: guestEmail,
        customer_phone: guestPhone,
        party_size: dinerCount,
        reservation_date: resDate,
        reservation_time: resTime,
        seating_preference: seatingArea,
        special_requests: specialRequests,
        status: 'confirmed',
        created_at: new Date().toISOString(),
      });
      setIsProcessing(false);
      setIsConfirmed(true);
    }, 1200);
  };

  const handleConfirmOrderPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const code = `TT-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmationCode(code);
      createOrder({
        id: `ord-${Date.now()}`,
        location_id: selectedLocation.id,
        items: cart,
        subtotal,
        tax_amount: tax,
        tip_amount: tip,
        total_amount: total,
        payment_status: 'paid',
        split_type: splitType,
        created_at: new Date().toISOString(),
      });
      setIsProcessing(false);
      setIsConfirmed(true);
    }, 1400);
  };

  // If order/reservation is confirmed, display the Confirmation Voucher
  if (isConfirmed) {
    const confirmationData = JSON.stringify({
      code: confirmationCode,
      location: selectedLocation.name,
      party_size: dinerCount,
      vibe: vibeTheme,
      total: checkoutType === 'order' ? `$${total}` : 'Table Reservation',
    });

    return (
      <div className="min-h-[calc(100vh-80px)] py-10 px-4 sm:px-8 max-w-3xl mx-auto flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full glass-panel rounded-3xl p-6 sm:p-8 border border-white/20 bg-zinc-950/90 shadow-2xl text-center space-y-6 relative overflow-hidden"
        >
          {/* Confirmed Badge */}
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-[var(--vibe-accent)]">
              Confirmed Experience Pass
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              You are all set for {selectedLocation.name}
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Present this digital pass upon arrival for priority host greeting.
            </p>
          </div>

          {/* QR Code and Pass Details */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 max-w-sm mx-auto flex flex-col items-center space-y-4">
            <div className="p-3 bg-white rounded-xl shadow-lg">
              <QRCodeSVG value={confirmationData} size={150} level="M" />
            </div>

            <div className="space-y-1 text-center">
              <span className="text-[11px] text-zinc-400 font-mono">Confirmation Code</span>
              <div className="text-lg font-mono font-bold tracking-widest text-white">
                {confirmationCode}
              </div>
            </div>

            <div className="w-full pt-3 border-t border-white/10 text-xs text-zinc-300 space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-zinc-400">Venue:</span>
                <span className="font-semibold">{selectedLocation.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Diners:</span>
                <span className="font-semibold">{dinerCount} Guests</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Atmosphere:</span>
                <span className="font-semibold capitalize text-[var(--vibe-accent)]">{vibeTheme} Vibe</span>
              </div>
              {checkoutType === 'order' && (
                <div className="flex justify-between font-bold text-white pt-1 border-t border-white/10">
                  <span>Paid Total:</span>
                  <span>${total}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => setFlowMode('review')}
              className="vibe-glow-button text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Complete Dining & Unlock Review Stamp
            </button>

            <button
              onClick={() => setFlowMode('passport')}
              className="bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span>View Digital Passport</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] py-8 px-4 sm:px-8 max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => setFlowMode('solo')}
        className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Menu Exploration
      </button>

      {/* Main Container */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 bg-zinc-950/80 shadow-2xl space-y-6">
        {/* Header & Flow Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
              <MapPin className="w-3.5 h-3.5 text-[var(--vibe-primary)]" />
              <span>{selectedLocation.name} • {selectedLocation.city}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Table Reservation & Order Checkout
            </h1>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex rounded-xl bg-black/50 p-1 border border-white/10">
            <button
              onClick={() => setCheckoutType('reservation')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                checkoutType === 'reservation'
                  ? 'vibe-glow-button text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Reserve Table
            </button>
            <button
              onClick={() => setCheckoutType('order')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                checkoutType === 'order'
                  ? 'vibe-glow-button text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              Pre-Order & Pay ({cart.length})
            </button>
          </div>
        </div>

        {/* Form 1: Table Reservation */}
        {checkoutType === 'reservation' && (
          <form onSubmit={handleConfirmReservation} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Guest Name
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--vibe-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Email Address (for Digital Voucher)
                </label>
                <input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--vibe-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Reservation Date
                </label>
                <input
                  type="date"
                  required
                  value={resDate}
                  onChange={(e) => setResDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--vibe-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Preferred Time Slot
                </label>
                <select
                  value={resTime}
                  onChange={(e) => setResTime(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--vibe-primary)]"
                >
                  <option value="18:00">6:00 PM (Early Twilight)</option>
                  <option value="18:30">6:30 PM (Sunset Amber)</option>
                  <option value="19:30">7:30 PM (Peak Vibe Dining)</option>
                  <option value="20:00">8:00 PM (Candlelit Prime)</option>
                  <option value="21:00">9:00 PM (Late Night Mood)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Atmospheric Seating Zone
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    "Chef's Counter (Embers & Storytelling)",
                    'Garden Veranda (Tranquil Greenery)',
                    'Candlelit Nook (Intimate Shadows)',
                  ].map((area) => (
                    <button
                      type="button"
                      key={area}
                      onClick={() => setSeatingArea(area)}
                      className={`p-3 rounded-xl border text-xs text-left transition-all ${
                        seatingArea === area
                          ? 'border-[var(--vibe-primary)] bg-[var(--vibe-badge-bg)] text-white font-semibold'
                          : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Dietary Wishes or Special Occasion Notes
                </label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--vibe-primary)]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-6 rounded-2xl vibe-glow-button text-sm font-bold text-white shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Securing Table & Preparing Experience...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  Confirm Table Reservation for {dinerCount} Diners
                </>
              )}
            </button>
          </form>
        )}

        {/* Form 2: Order-Ahead Checkout with Group Split */}
        {checkoutType === 'order' && (
          <form onSubmit={handleConfirmOrderPayment} className="space-y-6">
            {/* Split Option Selector (for group rooms) */}
            {groupRoom && groupRoom.members.length > 1 && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-400" />
                    Group Bill Splitting Option
                  </span>
                  <span className="text-xs text-zinc-400">{dinerCount} Diners in Room</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSplitType('equal')}
                    className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                      splitType === 'equal'
                        ? 'border-emerald-500 bg-emerald-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-zinc-400'
                    }`}
                  >
                    Equal Split (${perPersonAmount} each)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSplitType('itemized')}
                    className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                      splitType === 'itemized'
                        ? 'border-emerald-500 bg-emerald-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-zinc-400'
                    }`}
                  >
                    Itemized (Pay What You Added)
                  </button>
                </div>
              </div>
            )}

            {/* Cart Summary */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Order Summary ({cart.length} Dishes)
              </h3>
              <div className="divide-y divide-white/5 rounded-2xl bg-white/5 border border-white/10 p-4 space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{item.quantity}x</span>
                      <span className="text-zinc-200">{item.menu_item.name}</span>
                    </div>
                    <span className="font-mono text-zinc-300">
                      ${item.menu_item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tip & Bill Calculations */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Gratuity (Celebrates culinary staff)</span>
                <div className="flex items-center gap-1.5">
                  {[15, 18, 20, 25].map((pct) => (
                    <button
                      type="button"
                      key={pct}
                      onClick={() => setTipPercentage(pct)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        tipPercentage === pct
                          ? 'bg-[var(--vibe-primary)] text-white'
                          : 'bg-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">${subtotal}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Estimated Tax (9%)</span>
                  <span className="font-mono text-white">${tax}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Tip ({tipPercentage}%)</span>
                  <span className="font-mono text-white">${tip}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                  <span>Total Order</span>
                  <span className="font-mono text-[var(--vibe-accent)]">${total}</span>
                </div>
              </div>
            </div>

            {/* Simulated Payment Form */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-sky-400" />
                  Instant Payment via Stripe (Simulated)
                </span>
                <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" /> 256-bit Encrypted
                </span>
              </div>
              <div className="bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-zinc-300">
                •••• •••• •••• 4242 &nbsp;&nbsp;|&nbsp;&nbsp; 12/28 &nbsp;&nbsp;|&nbsp;&nbsp; CVC 888
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing || cart.length === 0}
              className="w-full py-3.5 px-6 rounded-2xl vibe-glow-button text-sm font-bold text-white shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Authorizing Payment Intent...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Pay ${total} ({splitType === 'equal' && groupRoom ? `$${perPersonAmount}/diner` : 'Full Order'})
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
