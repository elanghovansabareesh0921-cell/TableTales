'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BentoDashboard } from '@/components/bento/BentoDashboard';
import { DishCarousel } from '@/components/solo/DishCarousel';
import { GroupRoomView } from '@/components/group/GroupRoomView';
import { CheckoutModal } from '@/components/checkout/CheckoutModal';
import { ChatbotDrawer } from '@/components/concierge/ChatbotDrawer';
import { DigitalPassportModal } from '@/components/passport/DigitalPassportModal';
import { PostDiningReviewModal } from '@/components/review/PostDiningReviewModal';

export default function Home() {
  const { flowMode } = useAppStore();

  return (
    <main className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-[var(--vibe-primary)] selection:text-white">
      {/* Global Navigation Header */}
      <Navbar />

      {/* Main Flow Stage */}
      <div className="flex-1 w-full">
        {flowMode === 'landing' && <BentoDashboard />}

        {flowMode === 'solo' && <DishCarousel />}

        {flowMode === 'group' && <GroupRoomView />}

        {(flowMode === 'checkout' || flowMode === 'confirmation') && <CheckoutModal />}
      </div>

      {/* Global Modals & Drawers */}
      <ChatbotDrawer />
      <DigitalPassportModal />
      <PostDiningReviewModal />

      {/* Footer */}
      <Footer />
    </main>
  );
}
