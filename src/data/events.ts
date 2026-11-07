export interface MinistryEvent {
  id: string;
  title: string;
  category: 'Culte' | 'Étude Biblique' | 'Louange' | 'Jeunesse' | 'Prière';
  dateStr: string;
  timeStr: string;
  location: string;
  description: string;
  isOnlineAvailable: boolean;
  speaker?: string;
}

export const DEFAULT_EVENTS: MinistryEvent[] = [
  {
    id: "evt-1",
    title: "Culte Dominical d'Espérance & de Louange",
    category: "Culte",
    dateStr: "Tous les Dimanches",
    timeStr: "10:00 - 12:00",
    location: "Centre Espoir en Christ & En direct sur la plateforme",
    description: "Moment de célébration et d'édification. Dieu a promis sa présence et sa grâce renouvelée pour chaque famille.",
    isOnlineAvailable: true,
    speaker: "Pasteur & Équipe de Louange"
  },
  {
    id: "evt-2",
    title: "Soirée d'Intercession & De Prière",
    category: "Prière",
    dateStr: "Chaque Mercredi",
    timeStr: "19:00 - 20:30",
    location: "Salle d'Intercession & En ligne",
    description: "Temps fort pour proclamer la fidélité de Dieu et confier toutes les promesses de Dieu qui s'accompliront dans vos vies.",
    isOnlineAvailable: true,
    speaker: "Équipe d'Intercession"
  },
  {
    id: "evt-3",
    title: "Étude Biblique : Les Promesses Inébranlables",
    category: "Étude Biblique",
    dateStr: "Chaque Vendredi",
    timeStr: "18:30 - 20:00",
    location: "Espace Multimédia & Zoom",
    description: "Méditation approfondie sur la fidélité de Dieu à travers les Écritures : 'Il a promis, Il accomplira'.",
    isOnlineAvailable: true,
    speaker: "Équipe Enseignement"
  },
  {
    id: "evt-4",
    title: "Rassemblement Jeunesse : Courage & Vision",
    category: "Jeunesse",
    dateStr: "Samedi 15 Novembre 2026",
    timeStr: "16:00 - 18:30",
    location: "Grande Salle Espoir",
    description: "Un rassemblement dynamique pour fortifier la foi des jeunes, partager la parole et célébrer l'espérance en Christ.",
    isOnlineAvailable: true,
    speaker: "Groupe Jeunesse Espoir"
  }
];

// Helper functions for dynamic event management (prepared for admin page)
export const getStoredEvents = (): MinistryEvent[] => {
  try {
    const saved = localStorage.getItem('espoir_dynamic_events');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return DEFAULT_EVENTS;
  } catch (e) {
    return DEFAULT_EVENTS;
  }
};

export const saveStoredEvents = (events: MinistryEvent[], notify: boolean = false): void => {
  try {
    const current = localStorage.getItem('espoir_dynamic_events');
    const newStr = JSON.stringify(events);
    if (current !== newStr) {
      localStorage.setItem('espoir_dynamic_events', newStr);
    }
    if (notify && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('espoir_data_updated', { detail: { type: 'events' } }));
    }
  } catch (e) {
    console.error('Error saving dynamic events:', e);
  }
};
