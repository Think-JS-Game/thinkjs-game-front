import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { WhatIsThinkJS } from '@/components/sections/WhatIsThinkJS';
import { PersonaSection } from '@/components/sections/PersonaSection';
import { Features } from '@/components/sections/Features';
import { Plans } from '@/components/sections/Plans';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { Footer } from '@/components/layout/Footer';

export const LandingPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <WhatIsThinkJS />
        <PersonaSection />
        <Features />
        <Plans />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
};
