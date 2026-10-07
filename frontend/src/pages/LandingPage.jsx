import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Services from '../components/Services';
import Stats from '../components/Stats';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8F2F0] text-[#2B1B14] font-['Plus_Jakarta_Sans',system-ui,-apple-system,sans-serif] overflow-x-hidden relative">
      <Navbar />
      <main className="w-full">
        <Hero />
        <Features />
        <Services />
        <Stats />
      </main>
      <Footer />
    </div>
  );
}
