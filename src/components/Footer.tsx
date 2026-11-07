import React from 'react';
import { Logo } from './Logo';
import { ArrowUp, Calendar, HeartHandshake, Mail, Clock, Lock } from 'lucide-react';

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
        
        {/* Main 3-Column Balanced Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-10">
          
          {/* Column 1: Brand & Core Promise (5 cols) */}
          <div className="md:col-span-5 space-y-4">
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

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Plateforme chrétienne d'édification, de méditation quotidienne et d'intercession fraternelle pour fortifier chaque croyant dans la foi.
            </p>

            <div className="p-3.5 bg-white dark:bg-slate-900 border border-amber-300/80 dark:border-amber-500/30 rounded-xl shadow-2xs">
              <p className="text-xs font-serif italic text-amber-800 dark:text-amber-300 leading-relaxed">
                « On partage la parole de Dieu pour te donner du courage car Dieu est fidèle. Il a promis, Il accomplira. »
              </p>
            </div>
          </div>

          {/* Column 2: Navigation Links (3 cols) */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button
                  onClick={() => handleNav('verset')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-left"
                >
                  Verset du Jour
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('apropos')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-left"
                >
                  À Propos
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('prieres')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-left"
                >
                  Mur de Prières
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('evenements')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-left"
                >
                  Événements
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('blog')}
                  className="text-amber-700 dark:text-amber-400 font-bold hover:underline text-left flex items-center gap-1"
                >
                  <span>Blog & Partage</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-left"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Rencontres & Soutien (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Rassemblements & Écoute
            </h4>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 dark:text-slate-200 block">Culte Dominical :</strong>
                  <span>Tous les Dimanches à 10h00 (Présentiel & En direct)</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 dark:text-slate-200 block">Soirée d'Intercession :</strong>
                  <span>Chaque Mercredi à 19h00 (Prière communautaire)</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <HeartHandshake className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 dark:text-slate-200 block">Accompagnement Fraternel :</strong>
                  <span>À votre écoute en toute discrétion et bienveillance.</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleNav('prieres')}
                className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-300 dark:border-slate-800 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-xl shadow-2xs transition-colors"
              >
                Déposer une intention de prière
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Admin Link & Scroll to Top */}
        <div className="pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-center sm:text-left">
            <p>© 2026 powered by Natech. Tous droits réservés.</p>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">·</span>
            <button
              onClick={() => handleNav('admin')}
              className="text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1 text-[11px]"
              title="Portail Administrateur (admin.espoirenchrist.joel-fn.com)"
            >
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Espace Admin</span>
            </button>
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
