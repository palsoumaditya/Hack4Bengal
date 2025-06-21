"use client";
import { useState } from 'react';
import FloatingButton from '@/app/components/ui/ChatWidget/FloatingButton';
import ChatModal from '@/app/components/ui/ChatWidget/ChatModal';
import Image from "next/image";
import ServiceSelection from '@/app/components/Feature/Page';
import WaitingTime from "@/app/components/Waiting-Time/Page";
import FAQ from "@/app/components/FAQ/Page";
export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ServiceSelection />
      <FAQ />
      <WaitingTime />
      <FloatingButton onClick={() => setIsChatOpen(true)} />
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}