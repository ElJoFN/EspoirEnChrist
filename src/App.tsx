import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DailyVerseSection } from './components/DailyVerseSection';
import { AboutSection } from './components/AboutSection';
import { PrayerWallSection } from './components/PrayerWallSection';
import { BibleGuidanceSection } from './components/BibleGuidanceSection';
import { EventsSection } from './components/EventsSection';
import { ContactSection } from './components/ContactSection';
import { BlogPage } from './components/BlogPage';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'blog'>('home');
  const [activeSection, setActiveSection] = useState<string>('verset');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check saved preference or system preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('espoir_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  // Sync dark class on documentElement
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('espoir_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('espoir_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleOpenPrayerWall = () => {
    setActiveTab('home');
    setActiveSection('prieres');
    const el = document.getElementById('prieres');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Navigation Bar with Logo and clean nav links */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onOpenPrayerWall={handleOpenPrayerWall}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' ? (
          <>
            {/* 1. Verset du Jour (Grand Accueil) */}
            <DailyVerseSection onOpenPrayer={handleOpenPrayerWall} />

            {/* 2. À Propos (Cartes: Mission, Vision, Engagements) */}
            <AboutSection />

            {/* 3. Mur de Prières Interactif & Dynamique */}
            <PrayerWallSection />

            {/* 4. Guide Biblique par Thèmes */}
            <BibleGuidanceSection />

            {/* 5. Agenda & Cultes (Dynamique) */}
            <EventsSection />

            {/* 6. Section Contact (Formulaire + FAQ) */}
            <ContactSection />
          </>
        ) : (
          /* Espace Blog & Partage (Dynamique & Prêt pour Administration) */
          <BlogPage onBackToHome={() => setActiveTab('home')} />
        )}
      </main>

      {/* Site Footer with powered by Natech copyright */}
      <Footer setActiveTab={setActiveTab} setActiveSection={setActiveSection} />

    </div>
  );
}
