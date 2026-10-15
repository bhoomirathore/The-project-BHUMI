import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Services from '../components/Services';
import Stats from '../components/Stats';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
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
