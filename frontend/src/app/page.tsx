'use client';
import { useState } from 'react';
import FloatingButton from '@/app/components/ui/ChatWidget/FloatingButton';
import ChatModal from '@/app/components/ui/ChatWidget/ChatModal';
import WaitingTime from '@/app/components/Waiting-Time/Page';
import FAQ from './components/FAQ/Page';
import Feature from './components/Feature/Page';

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  return (  
    <>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 pt-8 sm:pt-12 md:pt-16 pb-8">
        <div className="w-full flex items-center justify-center">
          <Feature />
        </div>
        <div className="w-full flex items-center justify-center">
          <FAQ/>
        </div>
        <div className="w-full flex items-center justify-center">
          <WaitingTime/>
        </div>
      </div>
      <FloatingButton onClick={() => setIsChatOpen(true)} />
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
