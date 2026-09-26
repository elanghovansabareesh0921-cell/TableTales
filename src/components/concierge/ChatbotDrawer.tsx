'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  X, 
  Send, 
  Users, 
  Compass, 
  Heart, 
  Flame, 
  Coffee, 
  PartyPopper,
  CheckCircle2,
  SlidersHorizontal,
  Bot
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { ExtractedVibeContext } from '@/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  extractedContext?: ExtractedVibeContext;
}

const QUICK_PROMPTS = [
  { label: '🕯️ Romantic Date for 2 (Vegetarian)', text: 'I want an intimate, candlelit date night for 2. We are vegetarian and love delicate truffles and cozy ambiance.' },
  { label: '⚡ Adventurous Foodie Tour (Bold & Spicy)', text: 'Looking for a daring, adventurous dinner for 3 explorers! We love spicy seafood, plancha sear, and exotic notes.' },
  { label: '🌿 Relaxed Solo Umami Retreat', text: 'Just me tonight. I want a quiet, soothing, chill dinner with deep umami broth and calming tea.' },
  { label: '👨‍👩‍👧‍👦 Family Sunday Gathering', text: 'Planning a warm family dinner for 4 with comforting shareable wood-fired dishes and zero nut allergens.' },
];

export function ChatbotDrawer() {
  const { 
    isConciergeOpen, 
    setConciergeOpen, 
    selectedLocation, 
    setVibeContext, 
    setFlowMode, 
    createGroupRoom,
    vibeTheme
  } = useAppStore();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `Greetings. I am your **TableTales AI Concierge** for **${selectedLocation.name}** in ${selectedLocation.city}.\n\nTell me: *What is your mood, who is dining with you, and are there any dietary wishes or allergies tonight?*`,
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          locationName: selectedLocation.name,
        }),
      });

      if (!response.body) {
        throw new Error('No response body received');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';
      const assistantMessageId = `msg-ai-${Date.now()}`;

      setMessages((prev) => [
        ...prev,
        { id: assistantMessageId, role: 'assistant', content: '' }
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantText += chunk;

        // Check if function call marker is present
        let displayContent = assistantText;
        let extractedContext: ExtractedVibeContext | undefined;

        if (assistantText.includes('__FUNCTION_CALL__:')) {
          const parts = assistantText.split('__FUNCTION_CALL__:');
          displayContent = parts[0].trim();
          try {
            extractedContext = JSON.parse(parts[1].trim());
          } catch (e) {
            console.error('Failed to parse function call JSON:', e);
          }
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: displayContent, extractedContext }
              : msg
          )
        );

        if (extractedContext) {
          // Immediately apply context to app store!
          setVibeContext(extractedContext);
        }
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'My sensory intuition encountered a brief flicker. Please allow me to assist you again!',
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartSolo = () => {
    setFlowMode('solo');
    setConciergeOpen(false);
  };

  const handleStartGroup = (partySize: number) => {
    createGroupRoom(selectedLocation.id, 'Host Diner');
    setFlowMode('group');
    setConciergeOpen(false);
  };

  if (!isConciergeOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setConciergeOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Drawer (Slide in from bottom on mobile, from right on desktop) */}
        <motion.div
          initial={{ x: '100%', y: 0 }}
          animate={{ x: 0, y: 0 }}
          exit={{ x: '100%', y: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative z-10 w-full sm:max-w-xl h-full flex flex-col glass-panel border-l border-white/10 shadow-2xl bg-zinc-950/95 text-zinc-100 overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-zinc-900/60 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg"
                style={{ background: 'linear-gradient(135deg, var(--vibe-primary), var(--vibe-secondary))' }}
              >
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base sm:text-lg tracking-tight">AI Vibe Concierge</h3>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border glass-pill">
                    {vibeTheme}
                  </span>
                </div>
                <p className="text-xs text-zinc-400">Curating for {selectedLocation.name}</p>
              </div>
            </div>

            <button
              onClick={() => setConciergeOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
              aria-label="Close concierge"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2 bg-black/40 border-b border-white/5 overflow-x-auto flex gap-2 no-scrollbar">
            {QUICK_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.text)}
                disabled={isLoading}
                className="whitespace-nowrap text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-zinc-300 transition-all hover:scale-[1.02] flex items-center gap-1.5"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-zinc-800 to-zinc-700 text-white rounded-tr-none shadow-md border border-white/10'
                      : 'glass-panel rounded-tl-none border border-white/10 text-zinc-200'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-zinc-400">
                      <Bot className="w-3.5 h-3.5 text-[var(--vibe-primary)]" />
                      <span>TableTales Intelligence</span>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap">
                    {msg.content.replace(/\*\*(.*?)\*\*/g, '$1')}
                  </div>

                  {/* Function-Calling Structured Results Card */}
                  {msg.extractedContext && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 pt-3 border-t border-white/15 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs font-medium text-emerald-400">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          Vibe & Profile Synthesized
                        </span>
                        <span className="text-zinc-400 capitalize">{msg.extractedContext.vibe_theme} Theme</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-lg bg-black/40 border border-white/10">
                          <span className="text-zinc-400 block text-[10px]">Party Size</span>
                          <span className="font-semibold text-white">
                            {msg.extractedContext.party_size} {msg.extractedContext.party_size === 1 ? 'Diner (Solo)' : 'Diners (Group)'}
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-black/40 border border-white/10">
                          <span className="text-zinc-400 block text-[10px]">Dietary Filters</span>
                          <span className="font-semibold text-white">
                            {msg.extractedContext.dietary_restrictions.length > 0 
                              ? msg.extractedContext.dietary_restrictions.join(', ')
                              : 'All Palates'}
                          </span>
                        </div>
                      </div>

                      {/* Branch Actions */}
                      <div className="pt-2 flex flex-col sm:flex-row gap-2">
                        {msg.extractedContext.party_size > 1 ? (
                          <>
                            <button
                              onClick={() => handleStartGroup(msg.extractedContext!.party_size)}
                              className="flex-1 vibe-glow-button text-white font-medium text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2"
                            >
                              <Users className="w-4 h-4" />
                              Start Group Room & Sync
                            </button>
                            <button
                              onClick={handleStartSolo}
                              className="flex-1 bg-white/10 hover:bg-white/20 border border-white/15 text-white font-medium text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                            >
                              <Compass className="w-4 h-4" />
                              Browse Solo First
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={handleStartSolo}
                            className="w-full vibe-glow-button text-white font-medium text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2"
                          >
                            <Compass className="w-4 h-4" />
                            Begin Solo Sensory Exploration
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-zinc-400 text-xs pl-2">
                <Sparkles className="w-4 h-4 animate-spin text-[var(--vibe-primary)]" />
                <span>Brewing sensory recommendations and tuning ambiance...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Footer */}
          <div className="p-4 border-t border-white/10 bg-zinc-950/80 backdrop-blur-md">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="E.g., Date night for 2, vegetarian, candlelit mood..."
                disabled={isLoading}
                className="flex-1 bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[var(--vibe-primary)] transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-12 h-11 rounded-xl vibe-glow-button flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
