import React from 'react';
import { BookOpen, Heart, Sparkles, Users, CheckCircle2, Shield, Compass, Target } from 'lucide-react';
import aboutFaithImg from '../assets/images/about_ministry_faith_1794053134401.jpg';
import communityGatheringImg from '../assets/images/community_fellowship_gathering_1794053134732.jpg';

export const AboutSection: React.FC = () => {
  // All three cards now have the exact same amber border contour as "Notre Mission"
  const missionBorderColor = 'border-amber-300 dark:border-amber-500/40';

  const cards = [
    {
      id: 'mission',
      title: 'Notre Mission',
      badge: 'Partage & Courage',
      icon: Target,
      color: 'from-amber-500/15 to-amber-600/5 dark:from-amber-500/20 dark:to-amber-600/10',
      borderColor: missionBorderColor,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
      description: 'Partager la Parole de Dieu pour vous donner du courage et vous rappeler que Dieu est fidèle dans toutes ses promesses.',
      points: [
        'Proclamation quotidienne d’enseignements bibliques fortifiants.',
        'Soutien spirituel personnalisé et écoute pastorale bienveillante.',
        'Diffusion d’espérance et de versets médités chaque matin.',
      ],
    },
    {
      id: 'vision',
      title: 'Notre Vision',
      badge: 'Fidélité Divine',
      icon: Compass,
      color: 'from-amber-500/15 to-amber-600/5 dark:from-amber-500/20 dark:to-amber-600/10',
      borderColor: missionBorderColor,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
      description: 'Développer une communauté de foi inspirée, ancrée sur l’assurance suprême : « Il a promis, Il accomplira ».',
      points: [
        'Bâtir des familles épanouies par la foi vivante en Christ.',
        'Élever une génération affermie qui marche selon les promesses.',
        'Faire rayonner la lumière et l’amour divin sans frontière.',
      ],
    },
    {
      id: 'engagements',
      title: 'Nos Engagements',
      badge: 'Vérité & Prière',
      icon: Shield,
      color: 'from-amber-500/15 to-amber-600/5 dark:from-amber-500/20 dark:to-amber-600/10',
      borderColor: missionBorderColor,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
      description: 'Accueillir chaque âme avec amour, agir en vérité et soutenir la prière fervente pour tous ceux qui en ont besoin.',
      points: [
        'Confidentialité absolue pour toutes les requêtes de prières.',
        'Cultes et rencontres fraternelles ouverts à tous, sans condition.',
        'Fidélité constante à la sainte Parole et soutien fraternel.',
      ],
    },
  ];

  const pillars = [
    {
      title: "La Foi Vivante",
      desc: "Ancrée solidement dans la Parole indéfectible de Dieu, transformant les cœurs au quotidien.",
      icon: BookOpen,
    },
    {
      title: "L'Amour Inconditionnel",
      desc: "Accueillir chaque personne avec la bonté et la compassion ultime de Jésus-Christ.",
      icon: Heart,
    },
    {
      title: "L'Espérance Glorieuse",
      desc: "Savoir que Dieu accomplit toujours ce qu'il a promis et apporte la victoire.",
      icon: Sparkles,
    },
    {
      title: "La Communauté Fraternelle",
      desc: "Marcher ensemble dans la prière, le partage et la croissance spirituelle.",
      icon: Users,
    },
  ];

  return (
    <section id="apropos" className="py-16 sm:py-20 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 bg-amber-500/15 dark:bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
            Qui Sommes-Nous
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mt-3 tracking-tight">
            À Propos d'Espoir en Christ
          </h2>
          <p className="mt-4 text-base sm:text-lg text-amber-800 dark:text-amber-300 font-serif italic max-w-2xl mx-auto leading-relaxed">
            « On partage la parole de Dieu pour te donner du courage car Dieu est fidèle. Il a promis, Il accomplira. »
          </p>
        </div>

        {/* 3 DISTINCT CARDS FOR MISSION, VISION & ENGAGEMENTS - ALL UNIFIED WITH MISSION BORDER */}
        <div className="mb-16 sm:mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {cards.map((card) => {
              const IconComp = card.icon;
              return (
                <div
                  key={card.id}
                  className={`bg-slate-50 dark:bg-slate-900/90 border ${card.borderColor} rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-md dark:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden`}
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} rounded-bl-full pointer-events-none opacity-60`} />

                  <div>
                    {/* Header icon & badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                        <IconComp className={`w-6 h-6 ${card.iconColor}`} />
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${card.badgeColor}`}>
                        {card.badge}
                      </span>
                    </div>

                    {/* Card Title */}
                    <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-3 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                      {card.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6 font-sans">
                      {card.description}
                    </p>

                    {/* Checkpoints list */}
                    <ul className="space-y-2.5 border-t border-slate-200 dark:border-slate-800/80 pt-4 text-xs text-slate-600 dark:text-slate-300">
                      {card.points.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* 2 Showcase Photos with Meaningful Captions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center mb-16">
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg relative group">
            <img
              src={aboutFaithImg}
              onError={(e) => {
                e.currentTarget.src = '/images/about_ministry_faith_1794053134401.jpg';
              }}
              alt="Méditation de la Parole"
              className="w-full h-72 sm:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 p-4 bg-slate-900/90 border border-amber-500/30 rounded-xl backdrop-blur-md">
              <p className="text-xs font-bold text-amber-400 uppercase">Fidélité Inébranlable</p>
              <p className="text-xs sm:text-sm font-serif italic text-white mt-1">
                « Dieu n'est point un homme pour mentir, ni fils d'un homme pour se repentir. Ce qu'il a dit, ne le fera-t-il pas ? » — Nombres 23:19
              </p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg relative group">
            <img
              src={communityGatheringImg}
              onError={(e) => {
                e.currentTarget.src = '/images/community_fellowship_gathering_1794053134732.jpg';
              }}
              alt="Rassemblement Espoir en Christ"
              className="w-full h-72 sm:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 p-4 bg-slate-900/90 border border-amber-500/30 rounded-xl backdrop-blur-md">
              <p className="text-xs font-bold text-amber-400 uppercase">Courage & Fraternité</p>
              <p className="text-xs sm:text-sm font-serif italic text-white mt-1">
                « Fortifiez-vous et prenez courage ! Ne craignez point, car l'Éternel ton Dieu marche avec toi. »
              </p>
            </div>
          </div>
        </div>

        {/* 4 Pillars Card Grid */}
        <div>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
              Les 4 Piliers de Notre Foi
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {pillars.map((v, idx) => {
              const IconComp = v.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 p-5 sm:p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-xs group"
                >
                  <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-2">
                    {v.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
