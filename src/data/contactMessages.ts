export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  requestType: string;
  subject?: string;
  message: string;
  requestCallback: boolean;
  date: string;
  status: 'nouveau' | 'traite' | 'archive';
  createdAt?: string;
}

export const INITIAL_CONTACT_MESSAGES: ContactMessage[] = [
  {
    id: "msg-101",
    name: "Marc-Antoine D.",
    email: "marc.antoine@gmail.com",
    phone: "+33 6 45 89 12 30",
    requestType: "Demande de prière personnelle",
    subject: "Prière pour un temps d'épreuve familiale",
    message: "Bonjour, je traverse une période de doute intense dans mon travail et au sein de ma famille. J'aimerais beaucoup être soutenu dans la prière par les responsables.",
    requestCallback: true,
    date: "Aujourd'hui, 09:15",
    status: "nouveau"
  },
  {
    id: "msg-102",
    name: "Céline B.",
    email: "celine.b@outlook.fr",
    requestType: "Inscription aux études bibliques",
    subject: "Rejoindre le groupe du vendredi soir",
    message: "Que la paix du Christ soit avec vous. J'ai vu l'étude biblique du vendredi soir 'Les Promesses Inébranlables' et j'aimerais recevoir le lien de connexion en ligne.",
    requestCallback: false,
    date: "Hier, 16:40",
    status: "traite"
  }
];

export const getStoredContactMessages = (): ContactMessage[] => {
  try {
    const saved = localStorage.getItem('espoir_contact_history');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure IDs are strings and have status
      return parsed.map((m: any) => ({
        ...m,
        id: String(m.id || Date.now()),
        status: m.status || 'nouveau'
      }));
    }
    return INITIAL_CONTACT_MESSAGES;
  } catch (e) {
    return INITIAL_CONTACT_MESSAGES;
  }
};

export const saveStoredContactMessages = (messages: ContactMessage[]): void => {
  try {
    localStorage.setItem('espoir_contact_history', JSON.stringify(messages));
  } catch (e) {
    console.error('Error saving contact messages:', e);
  }
};
