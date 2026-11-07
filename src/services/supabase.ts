import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { MinistryEvent, DEFAULT_EVENTS } from '../data/events';
import { PrayerItem, DEFAULT_PRAYERS } from '../data/prayers';
import { BlogPost, DEFAULT_BLOG_POSTS } from '../data/blogPosts';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

// Get config from env variables or user-saved custom config in localStorage
export const getSupabaseConfig = (): SupabaseConfig => {
  let url = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  let anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  try {
    const saved = localStorage.getItem('espoir_supabase_custom_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url) url = parsed.url.trim();
      if (parsed.anonKey) anonKey = parsed.anonKey.trim();
    }
  } catch (e) {
    console.error('Error reading saved Supabase config:', e);
  }

  return { url, anonKey };
};

export const saveSupabaseConfig = (config: SupabaseConfig): void => {
  try {
    localStorage.setItem('espoir_supabase_custom_config', JSON.stringify(config));
    // Reset client instance
    supabaseInstance = null;
  } catch (e) {
    console.error('Error saving Supabase config:', e);
  }
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, anonKey } = getSupabaseConfig();

  // Validate format
  if (!url || !anonKey || !url.startsWith('https://')) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: false,
        },
      });
    } catch (err) {
      console.warn('Failed to create Supabase client:', err);
      return null;
    }
  }

  return supabaseInstance;
};

export const isSupabaseConfigured = (): boolean => {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey && url.startsWith('https://') && anonKey.length > 20);
};

// Test connection to Supabase
export const testSupabaseConnection = async (): Promise<{
  success: boolean;
  message: string;
  hasTables?: boolean;
}> => {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: "URL ou clé d'API Supabase manquante ou invalide.",
    };
  }

  try {
    // Try pinging the events or prayers table
    const { data, error } = await client.from('events').select('id').limit(1);

    if (error) {
      // Check if table does not exist yet (code 42P01 in postgres)
      if (error.code === '42P01' || error.message.toLowerCase().includes('relation') || error.message.toLowerCase().includes('not exist')) {
        return {
          success: true,
          message: 'Connecté à Supabase avec succès ! Les tables doivent être créées via le script SQL fourni.',
          hasTables: false,
        };
      }
      return {
        success: false,
        message: `Erreur Supabase : ${error.message} (${error.code || 'Inconnu'})`,
      };
    }

    return {
      success: true,
      message: 'Connexion à Supabase établie avec succès ! Tables prêtes et opérationnelles.',
      hasTables: true,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Erreur réseau lors du test : ${err.message || String(err)}`,
    };
  }
};

// SQL Schema for the user to paste into Supabase SQL Editor in 1 click
export const SUPABASE_SQL_SCHEMA = `-- ============================================================
-- SCRIPT DE CRÉATION DE LA BASE DE DONNÉES SUPABASE
-- MINISTÈRE « ESPOIR EN CHRIST » (espoirenchrist.joel-fn.com)
-- ============================================================

-- 1. Table des Événements & Cultes
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  date_str TEXT NOT NULL,
  time_str TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  is_online_available BOOLEAN DEFAULT true,
  speaker TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table du Mur de Prières
CREATE TABLE IF NOT EXISTS public.prayers (
  id TEXT PRIMARY KEY,
  author TEXT NOT NULL,
  location TEXT,
  category TEXT NOT NULL,
  request TEXT NOT NULL,
  date TEXT NOT NULL,
  prayers_count INTEGER DEFAULT 1,
  is_urgent BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Table des Articles de Blog & Partages
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  date TEXT NOT NULL,
  read_time TEXT NOT NULL,
  snippet TEXT NOT NULL,
  content TEXT NOT NULL,
  biblical_reference TEXT,
  likes_count INTEGER DEFAULT 1,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Table des Messages de Contact reçus
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  request_type TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  request_callback BOOLEAN DEFAULT false,
  date TEXT NOT NULL,
  status TEXT DEFAULT 'nouveau',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Activation de la sécurité au niveau des lignes (RLS) et politiques d'accès public
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture et écriture pour l'application
DO $$
BEGIN
  -- Events
  DROP POLICY IF EXISTS "Lecture publique events" ON public.events;
  CREATE POLICY "Lecture publique events" ON public.events FOR SELECT USING (true);
  DROP POLICY IF EXISTS "Ecriture events" ON public.events;
  CREATE POLICY "Ecriture events" ON public.events FOR ALL USING (true);

  -- Prayers
  DROP POLICY IF EXISTS "Lecture publique prayers" ON public.prayers;
  CREATE POLICY "Lecture publique prayers" ON public.prayers FOR SELECT USING (true);
  DROP POLICY IF EXISTS "Ecriture prayers" ON public.prayers;
  CREATE POLICY "Ecriture prayers" ON public.prayers FOR ALL USING (true);

  -- Blog Posts
  DROP POLICY IF EXISTS "Lecture publique blog" ON public.blog_posts;
  CREATE POLICY "Lecture publique blog" ON public.blog_posts FOR SELECT USING (true);
  DROP POLICY IF EXISTS "Ecriture blog" ON public.blog_posts;
  CREATE POLICY "Ecriture blog" ON public.blog_posts FOR ALL USING (true);

  -- Contact Messages
  DROP POLICY IF EXISTS "Lecture publique contact" ON public.contact_messages;
  CREATE POLICY "Lecture publique contact" ON public.contact_messages FOR SELECT USING (true);
  DROP POLICY IF EXISTS "Ecriture contact" ON public.contact_messages;
  CREATE POLICY "Ecriture contact" ON public.contact_messages FOR ALL USING (true);
END $$;
`;
