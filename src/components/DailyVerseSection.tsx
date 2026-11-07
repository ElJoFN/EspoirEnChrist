import React, { useState, useEffect } from 'react';
import { getVerseOfTheDay, BibleVerse } from '../data/dailyVerses';
import { BookOpen, Volume2, VolumeX, Share2, Copy, Check, Sparkles, ChevronLeft, ChevronRight, Quote, HeartHandshake } from 'lucide-react';

interface DailyVerseSectionProps {
  onOpenPrayer?: () => void;
}

export const DailyVerseSection: React.FC<DailyVerseSectionProps> = ({ onOpenPrayer }) => {
  const [dayOffset, setDayOffset] = useState<number>(0);
  const [currentVerse, setCurrentVerse] = useState<BibleVerse>(getVerseOfTheDay(0));
  const [translation, setTranslation] = useState<'segond' | 'semeur' | 'courant'>('segond');
  const [copied, setCopied] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'text' | 'meditation' | 'priere'>('text');

  // Update verse when day offset changes
  useEffect(() => {
    setCurrentVerse(getVerseOfTheDay(dayOffset));
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  }, [dayOffset]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const getDisplayText = (): string => {
    if (translation === 'semeur' && currentVerse.textSemeur) return currentVerse.textSemeur;
    if (translation === 'courant' && currentVerse.textCourant) return currentVerse.textCourant;
    return currentVerse.text;
  };

  const handleCopyVerse = () => {
    const textToCopy = `"${getDisplayText()}" — ${currentVerse.reference} (${translation.toUpperCase()}) | Espoir en Christ`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = () => {
    const shareData = {
      title: `Verset du jour : ${currentVerse.reference}`,
      text: `"${getDisplayText()}" — ${currentVerse.reference}`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      handleCopyVerse();
    }
  };

  const handleAudioSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('La lecture vocale n’est pas disponible sur votre navigateur.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const textToRead = `${currentVerse.reference}. ${getDisplayText()}. Méditation : ${currentVerse.meditation}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  return (
    <section
      id="verset"
      className="relative pt-10 pb-16 sm:pt-14 sm:pb-20 bg-gradient-to-b from-amber-50/60 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800/80 transition-colors duration-200 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-amber-400/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Core Promise Header as Top Welcome */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 dark:bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-bold tracking-wide mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>La Parole de Dieu Quotidienne</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Verset du <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 dark:from-amber-200 dark:via-amber-400 dark:to-amber-500 bg-clip-text text-transparent">Jour</span>
          </h1>

          {/* User's Core Conviction Message */}
          <div className="mt-4 sm:mt-5 max-w-2xl mx-auto p-4 sm:p-5 bg-white/80 dark:bg-slate-900/80 border border-amber-500/30 rounded-2xl shadow-sm dark:shadow-md backdrop-blur-sm">
            <p className="text-sm sm:text-lg font-serif italic text-amber-800 dark:text-amber-300 font-medium leading-relaxed">
              « On partage la parole de Dieu pour te donner du courage car Dieu est fidèle. Il a promis, Il accomplira. »
            </p>
          </div>
        </div>

        {/* Main Verset Card */}
        <div className="bg-white dark:bg-slate-950/90 border border-amber-400/40 dark:border-amber-500/30 rounded-2xl sm:rounded-3xl shadow-xl dark:shadow-2xl p-5 sm:p-8 backdrop-blur-xl transition-colors">
          
          {/* Top Bar Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
            
            {/* Reference Badge & Theme */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-serif font-bold text-sm rounded-lg shadow-sm">
                {currentVerse.reference}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Thème : <strong className="text-amber-700 dark:text-amber-300 font-semibold">{currentVerse.theme}</strong>
              </span>
            </div>

            {/* Translation & Day Navigation */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              {/* Translation switcher */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 text-xs font-semibold">
                <button
                  onClick={() => setTranslation('segond')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    translation === 'segond'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Louis Segond 1910"
                >
                  LSG
                </button>
                <button
                  onClick={() => setTranslation('semeur')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    translation === 'semeur'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Bible du Semeur"
                >
                  BDS
                </button>
                <button
                  onClick={() => setTranslation('courant')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    translation === 'courant'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Français Courant"
                >
                  BFC
                </button>
              </div>

              {/* Day offset navigator */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5">
                <button
                  onClick={() => setDayOffset((prev) => prev - 1)}
                  className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  title="Verset précédent"
                  aria-label="Verset précédent"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDayOffset(0)}
                  disabled={dayOffset === 0}
                  className={`px-2.5 text-xs font-bold ${
                    dayOffset === 0
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Aujourd'hui"
                >
                  Auj.
                </button>
                <button
                  onClick={() => setDayOffset((prev) => prev + 1)}
                  className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  title="Verset suivant"
                  aria-label="Verset suivant"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 sm:gap-2 mt-5 mb-5 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('text')}
              className={`px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === 'text'
                  ? 'bg-amber-500/15 dark:bg-slate-800 text-amber-700 dark:text-amber-400 border border-amber-500/40'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Écriture Biblique
            </button>
            <button
              onClick={() => setActiveTab('meditation')}
              className={`px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === 'meditation'
                  ? 'bg-amber-500/15 dark:bg-slate-800 text-amber-700 dark:text-amber-400 border border-amber-500/40'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Méditation & Courage
            </button>
            <button
              onClick={() => setActiveTab('priere')}
              className={`px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === 'priere'
                  ? 'bg-amber-500/15 dark:bg-slate-800 text-amber-700 dark:text-amber-400 border border-amber-500/40'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Prière du Jour
            </button>
          </div>

          {/* Content Area */}
          <div className="min-h-[140px] sm:min-h-[170px] flex items-center justify-center p-2 sm:p-4">
            {activeTab === 'text' && (
              <div className="relative text-center w-full max-w-3xl">
                <Quote className="w-8 sm:w-10 h-8 sm:h-10 text-amber-500/20 absolute -top-3 -left-1 sm:-top-4 sm:-left-3 rotate-180 pointer-events-none" />
                <p className="text-lg sm:text-2xl md:text-3xl font-serif text-slate-900 dark:text-slate-100 italic leading-relaxed px-4 sm:px-8">
                  "{getDisplayText()}"
                </p>
                <div className="mt-4 text-xs font-bold tracking-widest text-amber-600 dark:text-amber-400 uppercase">
                  — {currentVerse.reference} ({translation.toUpperCase()})
                </div>
              </div>
            )}

            {activeTab === 'meditation' && (
              <div className="text-left w-full space-y-3 bg-slate-50 dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
                <div className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  Méditation pour aujourd'hui
                </div>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  {currentVerse.meditation}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 italic pt-2 border-t border-slate-200 dark:border-slate-800">
                  Contexte : {currentVerse.context}
                </p>
              </div>
            )}

            {activeTab === 'priere' && (
              <div className="text-left w-full space-y-3 bg-slate-50 dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
                <div className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  Prière d'Accompagnement
                </div>
                <p className="text-sm sm:text-base font-serif italic text-amber-900 dark:text-amber-200 leading-relaxed">
                  "{currentVerse.prayer}"
                </p>
              </div>
            )}
          </div>

          {/* Action Bar Footer */}
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
            
            {/* Audio Voice Recitation Button */}
            <button
              onClick={handleAudioSpeech}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isPlayingAudio
                  ? 'bg-amber-500 text-slate-950 animate-pulse shadow'
                  : 'bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {isPlayingAudio ? (
                <VolumeX className="w-4 h-4 text-slate-950" />
              ) : (
                <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              )}
              <span>{isPlayingAudio ? 'Arrêter la lecture' : 'Écouter le verset'}</span>
            </button>

            {/* Quick Actions (Copy, Share, Prayer Wall) */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyVerse}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 transition-colors"
                title="Copier le verset"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                <span>{copied ? 'Copié !' : 'Copier'}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 transition-colors"
                title="Partager"
              >
                <Share2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Partager</span>
              </button>

              {onOpenPrayer && (
                <button
                  onClick={onOpenPrayer}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-all ml-1"
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span className="hidden sm:inline">Prier ensemble</span>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
