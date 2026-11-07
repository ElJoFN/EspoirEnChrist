import React, { useState } from 'react';
import { BIBLE_GUIDANCE_TOPICS, GuidanceTopic } from '../data/bibleGuidance';
import { Shield, HeartHandshake, Sparkles, Compass, Sun, BookOpen, Quote } from 'lucide-react';

const iconMap: Record<string, any> = {
  Shield,
  HeartHandshake,
  Sparkles,
  Compass,
  Sun,
};

export const BibleGuidanceSection: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<GuidanceTopic>(BIBLE_GUIDANCE_TOPICS[0]);

  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-t border-slate-200 dark:border-slate-900 transition-colors duration-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 bg-amber-500/15 dark:bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
            Guide Biblique selon vos Besoins
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mt-3 tracking-tight">
            Que cherchez-vous aujourd'hui ?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Quelle que soit votre situation émotionnelle ou spirituelle, découvrez les promesses bibliques adaptées pour fortifier votre marche.
          </p>
        </div>

        {/* Topic Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-10 sm:mb-12">
          {BIBLE_GUIDANCE_TOPICS.map((topic) => {
            const IconComponent = iconMap[topic.iconName] || BookOpen;
            const isSelected = activeTopic.id === topic.id;

            return (
              <button
                key={topic.id}
                onClick={() => setActiveTopic(topic)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold scale-105'
                    : 'bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <IconComponent className="w-4 h-4 shrink-0" />
                <span>{topic.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Topic Display Banner */}
        <div className="max-w-4xl mx-auto bg-slate-50 dark:bg-slate-900/90 border border-amber-400/40 dark:border-amber-500/30 rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-lg dark:shadow-2xl relative transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Left Column */}
            <div className="md:col-span-5 space-y-3 sm:space-y-4">
              <span className="text-xs font-bold tracking-widest text-amber-800 dark:text-amber-400 uppercase bg-amber-100 dark:bg-amber-500/10 px-3 py-1 rounded-md border border-amber-300 dark:border-amber-500/20 inline-block">
                {activeTopic.passage}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white">
                {activeTopic.title}
              </h3>
              <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-300 font-medium">
                {activeTopic.subtitle}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-2 border-t border-slate-200 dark:border-slate-800 font-sans">
                {activeTopic.explanation}
              </p>
            </div>

            {/* Right Scripture Column */}
            <div className="md:col-span-7 bg-white dark:bg-slate-950 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 relative shadow-xs">
              <Quote className="w-8 h-8 text-amber-500/20 absolute top-4 right-4 pointer-events-none" />
              
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-amber-600 dark:text-amber-400">
                  Passage Clé
                </span>
                <p className="text-base sm:text-lg font-serif italic text-slate-900 dark:text-slate-100 mt-1 leading-relaxed">
                  "{activeTopic.verseText}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-900">
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                  Prière Proposée
                </span>
                <p className="text-xs sm:text-sm font-serif italic text-amber-800 dark:text-amber-200 mt-1">
                  "{activeTopic.prayer}"
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
