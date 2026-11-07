export interface PrayerItem {
  id: string;
  author: string;
  location?: string;
  category: 'Santé' | 'Paix & Famille' | 'Emploi & Projets' | 'Foi & Orientation' | 'Action de Grâce';
  request: string;
  date: string;
  prayersCount: number;
  isUrgent?: boolean;
}

export const INITIAL_PRAYERS: PrayerItem[] = [
  {
    id: "p-101",
    author: "Marie-Claire K.",
    location: "Lyon, France",
    category: "Santé",
    request: "Je demande la prière pour la guérison complète de mon père hospitalisé. Que le Seigneur étende sa main restauratrice et donne du courage à toute l'équipe médicale.",
    date: "Aujourd'hui, 08:30",
    prayersCount: 42,
    isUrgent: true
  },
  {
    id: "p-102",
    author: "Samuel & Esther",
    location: "Genève, Suisse",
    category: "Paix & Famille",
    request: "Priez pour la réconciliation et la paix au sein de notre foyer. Que l'amour du Christ triomphe des tensions et restaure l'harmonie.",
    date: "Hier, 19:15",
    prayersCount: 28
  },
  {
    id: "p-103",
    author: "Jean-David B.",
    location: "Abidjan, Côte d'Ivoire",
    category: "Emploi & Projets",
    request: "En recherche d'emploi depuis plusieurs mois, je m'attends au Seigneur pour une porte ouverte professionnelle. Que sa volonté s'accomplisse.",
    date: "Il y a 2 jours",
    prayersCount: 56
  },
  {
    id: "p-104",
    author: "Bénévole Anonyme",
    category: "Foi & Orientation",
    request: "Demande de prière pour discerner la direction divine dans mes études et mon engagement spirituel auprès des jeunes.",
    date: "Il y a 3 jours",
    prayersCount: 19
  },
  {
    id: "p-105",
    author: "Nathalie P.",
    location: "Montréal, Canada",
    category: "Action de Grâce",
    request: "Louange à Dieu ! Après des semaines d'angoisse, le Seigneur a pourvu miraculeusement et les examens de ma fille sont excellents !",
    date: "Il y a 4 jours",
    prayersCount: 89
  },
  {
    id: "p-106",
    author: "Frère Joseph",
    location: "Dakar, Sénégal",
    category: "Foi & Orientation",
    request: "Prions pour l'implantation d'un groupe d'étude biblique auprès des étudiants et pour que des cœurs soient réceptifs à l'Évangile.",
    date: "Il y a 5 jours",
    prayersCount: 34
  },
  {
    id: "p-107",
    author: "Famille Mercier",
    location: "Bruxelles, Belgique",
    category: "Paix & Famille",
    request: "Demande de soutien dans la prière pour notre fils aîné en quête de sens. Que Dieu éclaire ses pas et le ramène à la bergerie.",
    date: "Il y a 6 jours",
    prayersCount: 61
  },
  {
    id: "p-108",
    author: "Sœur Christine",
    location: "Kinshasa, RDC",
    category: "Santé",
    request: "Prière d'action de grâce pour la rémission et demande de persévérance pour la suite des soins médicaux sous la garde divine.",
    date: "Il y a 1 semaine",
    prayersCount: 75
  }
];

export const DEFAULT_PRAYERS = INITIAL_PRAYERS;

// Helper functions for dynamic prayer wall management (prepared for database / admin panel)
export const getStoredPrayers = (): PrayerItem[] => {
  try {
    const saved = localStorage.getItem('espoir_dynamic_prayers');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return DEFAULT_PRAYERS;
  } catch (e) {
    return DEFAULT_PRAYERS;
  }
};

export const saveStoredPrayers = (prayers: PrayerItem[]): void => {
  try {
    localStorage.setItem('espoir_dynamic_prayers', JSON.stringify(prayers));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('espoir_data_updated', { detail: { type: 'prayers' } }));
    }
  } catch (e) {
    console.error('Error saving dynamic prayers:', e);
  }
};

export const getStoredPrayedIds = (): Record<string, boolean> => {
  try {
    const saved = localStorage.getItem('espoir_prayed_ids');
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    return {};
  }
};

export const saveStoredPrayedIds = (ids: Record<string, boolean>): void => {
  try {
    localStorage.setItem('espoir_prayed_ids', JSON.stringify(ids));
  } catch (e) {
    console.error('Error saving prayed ids:', e);
  }
};
