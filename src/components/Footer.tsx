import React from 'react';
import { Logo } from './Logo';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: 'home' | 'blog' | 'admin') => void;
  setActiveSection: (sec: string) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, setActiveSection, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (secId: string) => {
    if (secId === 'admin') {
      if (onOpenAdmin) {
        onOpenAdmin();
      } else {
        setActiveTab('admin');
        window.history.pushState({}, '', '/admin');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (secId === 'blog') {
      setActiveTab('blog');
      setActiveSection('blog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setActiveTab('home');
    setActiveSection(secId);
    setTimeout(() => {
      const el = document.getElementById(secId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 text-slate-600 dark:text-slate-400 py-12 transition-colors duration-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Clean Layout without right column */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-10 items-start">
          
          {/* Column 1: Brand & Core Promise (7 cols) */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <Logo size="md" showText={false} />
              <div>
                <span className="font-serif font-bold text-lg text-slate-900 dark:text-white block leading-tight">
                  Espoir en Christ
                </span>
                <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  Foi · Amour · Lumière
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans max-w-xl">
              Plateforme chrétienne d'édification, de méditation quotidienne et d'intercession fraternelle pour fortifier chaque croyant dans la foi.
            </p>

            <div className="p-3.5 bg-white dark:bg-slate-900 border border-amber-300/80 dark:border-amber-500/30 rounded-xl shadow-2xs max-w-xl">
              <p className="text-xs font-serif italic text-amber-800 dark:text-amber-300 leading-relaxed">
                « On partage la parole de Dieu pour te donner du courage car Dieu est fidèle. Il a promis, Il accomplira. »
              </p>
            </div>
          </div>

          {/* Column 2: Navigation Links (5 cols) */}
          <div className="md:col-span-5 md:pl-8">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Navigation Rapide
            </h4>
            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs font-medium">
              <button
                onClick={() => handleNav('verset')}
                className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-left"
              >
                Verset du Jour
              </button>

              <button
                onClick={() => handleNav('evenements')}
                className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-left"
              >
                Cultes & Événements
              </button>

              <button
                onClick={() => handleNav('apropos')}
                className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-left"
              >
                À Propos
              </button>

              <button
                onClick={() => handleNav('blog')}
                className="text-amber-700 dark:text-amber-400 font-bold hover:underline text-left flex items-center gap-1"
              >
                <span>Blog & Partage</span>
              </button>

              <button
                onClick={() => handleNav('prieres')}
                className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-left"
              >
                Mur de Prières
              </button>

              <button
                onClick={() => handleNav('contact')}
                className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-left"
              >
                Contact
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Scroll to Top */}
        <div className="pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-center sm:text-left">
            <p>© 2026 powered by Natech. Tous droits réservés.</p>
          </div>

          <button
            onClick={scrollToTop}
            className="p-2 bg-white dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-amber-700 dark:text-amber-400 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            aria-label="Retourner en haut de la page"
          >
            <span>Haut de page</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
