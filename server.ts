import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const DB_FILE = path.join(__dirname, 'data_store.json');

// Default initial data if database file does not exist yet
const INITIAL_DATA = {
  events: [
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
  ],
  prayers: [
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
    }
  ],
  blogPosts: [
    {
      id: "post-1",
      title: "Comment garder courage quand tout semble s'effondrer : Dieu reste fidèle",
      category: "Méditation",
      author: "Pasteur David",
      date: "7 Novembre 2026",
      readTime: "5 min",
      biblicalReference: "Lamentations 3:22-23",
      likesCount: 64,
      featured: true,
      snippet: "Les bontés de l'Éternel ne sont pas épuisées, ses compassions ne sont pas à leur terme; elles se renouvellent chaque matin. Découvrez comment puiser une force nouvelle.",
      content: `Dans les saisons de tempête, nos yeux ont naturellement tendance à se focaliser sur la hauteur des vagues plutôt que sur la puissance de Celui qui commande au vent.\n\nPourtant, l'Écriture nous rappelle avec force dans Lamentations 3:22-23 : « Les bontés de l'Éternel ne sont point épuisées, ses compassions ne sont pas à leur terme; elles se renouvellent chaque matin. Grande est ta fidélité ! »\n\n1. Reconnaître que votre épreuve n'est pas la fin de l'histoire\n2. Choisir la louange au milieu du combat\n3. Déclarer la fidélité de Dieu chaque matin`
    }
  ],
  messages: [
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
    }
  ]
};

function readDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading DB_FILE:', e);
  }
  writeDb(INITIAL_DATA);
  return INITIAL_DATA;
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing DB_FILE:', e);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // -------------------------------------------------------------
  // REAL-TIME CROSS-DEVICE API ENDPOINTS
  // -------------------------------------------------------------

  // 1. EVENTS API
  app.get('/api/events', (_req, res) => {
    const db = readDb();
    res.json(db.events || []);
  });

  app.post('/api/events', (req, res) => {
    const db = readDb();
    const payload = req.body;

    if (Array.isArray(payload)) {
      db.events = payload;
    } else if (payload && payload.id) {
      const idx = (db.events || []).findIndex((e: any) => e.id === payload.id);
      if (idx >= 0) {
        db.events[idx] = payload;
      } else {
        db.events = [payload, ...(db.events || [])];
      }
    }
    writeDb(db);
    res.json(db.events);
  });

  app.delete('/api/events/:id', (req, res) => {
    const db = readDb();
    const { id } = req.params;
    db.events = (db.events || []).filter((e: any) => e.id !== id);
    writeDb(db);
    res.json(db.events);
  });

  // 2. PRAYERS API
  app.get('/api/prayers', (_req, res) => {
    const db = readDb();
    res.json(db.prayers || []);
  });

  app.post('/api/prayers', (req, res) => {
    const db = readDb();
    const payload = req.body;

    if (Array.isArray(payload)) {
      db.prayers = payload;
    } else if (payload && payload.id) {
      const idx = (db.prayers || []).findIndex((p: any) => p.id === payload.id);
      if (idx >= 0) {
        db.prayers[idx] = payload;
      } else {
        db.prayers = [payload, ...(db.prayers || [])];
      }
    }
    writeDb(db);
    res.json(db.prayers);
  });

  app.delete('/api/prayers/:id', (req, res) => {
    const db = readDb();
    const { id } = req.params;
    db.prayers = (db.prayers || []).filter((p: any) => p.id !== id);
    writeDb(db);
    res.json(db.prayers);
  });

  // 3. BLOG POSTS API
  app.get('/api/blog', (_req, res) => {
    const db = readDb();
    res.json(db.blogPosts || []);
  });

  app.post('/api/blog', (req, res) => {
    const db = readDb();
    const payload = req.body;

    if (Array.isArray(payload)) {
      db.blogPosts = payload;
    } else if (payload && payload.id) {
      const idx = (db.blogPosts || []).findIndex((b: any) => b.id === payload.id);
      if (idx >= 0) {
        db.blogPosts[idx] = payload;
      } else {
        db.blogPosts = [payload, ...(db.blogPosts || [])];
      }
    }
    writeDb(db);
    res.json(db.blogPosts);
  });

  app.delete('/api/blog/:id', (req, res) => {
    const db = readDb();
    const { id } = req.params;
    db.blogPosts = (db.blogPosts || []).filter((b: any) => b.id !== id);
    writeDb(db);
    res.json(db.blogPosts);
  });

  // 4. CONTACT MESSAGES API
  app.get('/api/messages', (_req, res) => {
    const db = readDb();
    res.json(db.messages || []);
  });

  app.post('/api/messages', (req, res) => {
    const db = readDb();
    const payload = req.body;

    if (Array.isArray(payload)) {
      db.messages = payload;
    } else if (payload && payload.id) {
      const idx = (db.messages || []).findIndex((m: any) => m.id === payload.id);
      if (idx >= 0) {
        db.messages[idx] = payload;
      } else {
        db.messages = [payload, ...(db.messages || [])];
      }
    }
    writeDb(db);
    res.json(db.messages);
  });

  app.delete('/api/messages/:id', (req, res) => {
    const db = readDb();
    const { id } = req.params;
    db.messages = (db.messages || []).filter((m: any) => m.id !== id);
    writeDb(db);
    res.json(db.messages);
  });

  // Serve static assets or mount Vite dev middleware
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Espoir en Christ server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
