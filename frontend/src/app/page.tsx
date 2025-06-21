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
      {/* New Section: Car Struck Banner */}
      <div className="w-full flex flex-col items-center justify-center pt-8 pb-8 px-2 sm:px-4 max-w-4xl mx-auto">
        <div className="w-full p-2 sm:p-6 bg-yellow-400 rounded-2xl border border-black">
          <span className="text-white text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight mb-6 block">
            you car struck in the<br className="hidden sm:block" />
            middle of road like this
          </span>
          <button className="mt-6 px-6 py-3 bg-black rounded-lg text-white font-semibold text-base sm:text-lg shadow-md hover:bg-gray-900 transition-colors duration-200">
            <span className="tracking-wider">Get help now</span>
          </button>
        </div>
      </div>
      <FAQ />
      <WaitingTime />
      <FloatingButton onClick={() => setIsChatOpen(true)} />
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}



