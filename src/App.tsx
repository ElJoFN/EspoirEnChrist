import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DailyVerseSection } from './components/DailyVerseSection';
import { AboutSection } from './components/AboutSection';
import { PrayerWallSection } from './components/PrayerWallSection';
import { BibleGuidanceSection } from './components/BibleGuidanceSection';
import { EventsSection } from './components/EventsSection';
import { ContactSection } from './components/ContactSection';
import { BlogPage } from './components/BlogPage';
import { AdminPage } from './components/AdminPage';
import { Footer } from './components/Footer';

export default function App() {
  // Check if current URL matches admin subdomain (admin.espoirenchrist.joel-fn.com) or /admin path
  const checkIsAdminRoute = (): boolean => {
    if (typeof window === 'undefined') return false;
    const hostname = window.location.hostname.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();

    // Direct access via subdomain admin.espoirenchrist.joel-fn.com or admin.*
    const isSubdomain =
      hostname === 'admin.espoirenchrist.joel-fn.com' ||
      hostname.startsWith('admin.');

    return (
      isSubdomain ||
      path.startsWith('/admin') ||
      hash === '#admin' ||
      hash === '#/admin' ||
      search.includes('admin=true')
    );
  };

  const [activeTab, setActiveTab] = useState<'home' | 'blog' | 'admin'>(() => {
    return checkIsAdminRoute() ? 'admin' : 'home';
  });

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

  // Listen to browser popstate (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      if (checkIsAdminRoute()) {
        setActiveTab('admin');
      } else {
        setActiveTab('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
    if (window.location.pathname.startsWith('/admin')) {
      window.history.pushState({}, '', '/');
    }
    const el = document.getElementById('prieres');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGoToAdmin = () => {
    setActiveTab('admin');
    if (!window.location.hostname.startsWith('admin.')) {
      window.history.pushState({}, '', '/admin');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToPublicSite = () => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname.toLowerCase();
      // If user came via admin subdomain, navigate back to public domain
      if (hostname === 'admin.espoirenchrist.joel-fn.com' || hostname.startsWith('admin.')) {
        const mainDomain = hostname.replace(/^admin\./, '');
        window.location.href = `${window.location.protocol}//${mainDomain}`;
        return;
      }
    }
    setActiveTab('home');
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user requested Admin view (/admin or clicked admin entrance)
  if (activeTab === 'admin') {
    return <AdminPage onBackToSite={handleBackToPublicSite} />;
  }

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

      {/* Site Footer with powered by Natech copyright & admin entrance */}
      <Footer
        setActiveTab={setActiveTab}
        setActiveSection={setActiveSection}
        onOpenAdmin={handleGoToAdmin}
      />

    </div>
  );
}
