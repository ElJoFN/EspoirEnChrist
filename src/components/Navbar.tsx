import React, { useState } from 'react';
import { Logo } from './Logo';
import { Sun, Moon, Menu, X, HeartHandshake } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'blog';
  setActiveTab: (tab: 'home' | 'blog') => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onOpenPrayerWall: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeSection,
  setActiveSection,
  isDarkMode,
  toggleDarkMode,
  onOpenPrayerWall,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // "Blog & Partage" positioned exactly between "Événements" and "Contact"
  const navLinks = [
    { id: 'verset', label: 'Verset du Jour' },
    { id: 'apropos', label: 'À Propos' },
    { id: 'prieres', label: 'Mur de Prières' },
    { id: 'evenements', label: 'Événements' },
    { id: 'blog', label: 'Blog & Partage' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);

    if (id === 'blog') {
      setActiveTab('blog');
      setActiveSection('blog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setActiveTab('home');
    setActiveSection(id);

    // If currently on blog, give brief tick for home DOM to mount
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 transition-colors duration-200 shadow-xs dark:shadow-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          
          {/* Logo on the left */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => handleNavClick('verset')}
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-full transition-transform active:scale-95"
              aria-label="Espoir en Christ - Accueil"
              title="Espoir en Christ"
            >
              <Logo size="md" showText={false} />
            </button>
          </div>

          {/* Clean Top Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-3.5 lg:gap-6 text-sm font-medium shrink-0">
            {navLinks.map((link) => {
              const isActive = (link.id === 'blog' && activeTab === 'blog') || (activeTab === 'home' && activeSection === link.id);
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`transition-colors whitespace-nowrap text-xs lg:text-sm font-semibold ${
                    isActive
                      ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-500 pb-0.5'
                      : 'text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-300'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* CTA & Theme Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Theme Switcher */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors"
              title={isDarkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
              aria-label="Changer le thème"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Prayer CTA Button */}
            <button
              onClick={onOpenPrayerWall}
              className="hidden sm:flex items-center gap-2 px-3.5 lg:px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-sm hover:shadow transition-all transform active:scale-95 whitespace-nowrap shrink-0"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Demande de Prière</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors"
              aria-label="Menu principal"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-2 transition-colors shadow-lg">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = (link.id === 'blog' && activeTab === 'blog') || (activeTab === 'home' && activeSection === link.id);
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left px-3.5 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                onOpenPrayerWall();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl shadow"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Demander une Prière</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
