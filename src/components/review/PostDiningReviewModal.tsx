'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Sparkles, 
  CheckCircle, 
  X, 
  Heart, 
  Award, 
  Send,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppStore } from '@/store/useAppStore';

const VIBE_TAGS = [
  'Candlelight Magic',
  'Spot-on Ambiance',
  'Rich Umami',
  'Attentive Pacing',
  'Exquisite Plating',
  'Sublime Music',
  'Romantic & Intimate',
  'Generous Portions',
];

export function PostDiningReviewModal() {
  const { 
    isReviewModalOpen, 
    setReviewModalOpen, 
    selectedLocation, 
    vibeTheme, 
    submitReview, 
    currentUserName,
    setFlowMode 
  } = useAppStore();

  const [foodRating, setFoodRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [vibeRating, setVibeRating] = useState(5);
  const [comment, setComment] = useState('The white oak binchotan wagyu and golden chawanmushi were sublime. The ambient candlelit lighting matched the AI concierge prediction perfectly!');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Candlelight Magic', 'Spot-on Ambiance', 'Rich Umami']);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger celebratory confetti burst!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'],
    });

    submitReview({
      id: `rev-${Date.now()}`,
      location_id: selectedLocation.id,
      customer_name: currentUserName,
      food_rating: foodRating,
      service_rating: serviceRating,
      vibe_rating: vibeRating,
      comment: `${comment} [Tags: ${selectedTags.join(', ')}]`,
      vibe_theme_matched: vibeTheme,
      created_at: new Date().toISOString(),
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setReviewModalOpen(false);
      setFlowMode('passport');
    }, 2200);
  };

  if (!isReviewModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setReviewModalOpen(false)}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="relative z-10 w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-7 border border-white/20 bg-zinc-950/95 shadow-2xl space-y-5"
        >
          {/* Close button */}
          <button
            onClick={() => setReviewModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {isSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Review & Vibe Stamp Earned!</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
                  Your feedback has calibrated our sensory concierge model, and the exclusive <strong>Vibe Connoisseur</strong> passport stamp is now unlocked.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--vibe-accent)]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Post-Dining Vibe Calibration</span>
                </div>
                <h2 className="text-xl font-extrabold text-white">
                  How was your experience at {selectedLocation.name}?
                </h2>
                <p className="text-xs text-zinc-400">
                  Rate the sensory accuracy and gastronomy to train the AI dining concierge.
                </p>
              </div>

              {/* Star Rating Categories */}
              <div className="space-y-3 pt-1">
                {/* 1. Vibe Accuracy Rating */}
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span>Vibe Accuracy</span>
                      <span className="text-[10px] font-normal text-[var(--vibe-accent)] capitalize">
                        ({vibeTheme} mood match)
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400">Did the atmosphere match the AI promise?</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setVibeRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= vibeRating
                              ? 'fill-[var(--vibe-primary)] text-[var(--vibe-primary)]'
                              : 'text-zinc-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Food Quality */}
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Gastronomy & Flavor</div>
                    <span className="text-[10px] text-zinc-400">Sensory taste, aroma, texture</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFoodRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= foodRating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Service Hospitality */}
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Hospitality & Pace</div>
                    <span className="text-[10px] text-zinc-400">Table pacing, storytelling & care</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setServiceRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= serviceRating ? 'fill-emerald-400 text-emerald-400' : 'text-zinc-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Vibe Tags */}
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-semibold text-zinc-300 block">Atmosphere Impressions</span>
                <div className="flex flex-wrap gap-1.5">
                  {VIBE_TAGS.map((tag) => {
                    const active = selectedTags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                          active
                            ? 'vibe-glow-button text-white border-transparent'
                            : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Free-text comment */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Sensory Notes & Feedback
                </label>
                <textarea
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details on dish textures, aroma, and whether the vibe met expectations..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[var(--vibe-primary)]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-5 rounded-2xl vibe-glow-button text-xs sm:text-sm font-bold text-white shadow-xl flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Feedback & Claim Passport Stamp
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
