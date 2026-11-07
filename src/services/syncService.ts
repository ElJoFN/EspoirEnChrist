import { MinistryEvent } from '../data/events';
import { PrayerItem } from '../data/prayers';
import { BlogPost } from '../data/blogPosts';
import { ContactMessage } from '../data/contactMessages';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';

// BroadcastChannel for instant cross-tab synchronization
const bc = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('espoir_sync_channel') : null;

export type SyncDataType = 'events' | 'prayers' | 'blog' | 'messages';

export interface SyncStatus {
  lastSyncedAt: string;
  isOnline: boolean;
  supabaseConnected: boolean;
  serverConnected: boolean;
}

// Global listener registrar for components
export function registerDataSyncListener(type: SyncDataType, callback: () => void): () => void {
  const handleUpdate = (e: any) => {
    if (!e.detail || e.detail.type === type || e.detail.type === 'all') {
      callback();
    }
  };

  const handleStorage = (e: StorageEvent) => {
    if (
      (type === 'events' && e.key === 'espoir_dynamic_events') ||
      (type === 'prayers' && e.key === 'espoir_dynamic_prayers') ||
      (type === 'blog' && e.key === 'espoir_dynamic_blog') ||
      (type === 'messages' && e.key === 'espoir_dynamic_messages')
    ) {
      callback();
    }
  };

  const handleBroadcast = (msg: MessageEvent) => {
    if (msg.data && (msg.data.type === type || msg.data.type === 'all')) {
      callback();
    }
  };

  window.addEventListener('espoir_data_updated', handleUpdate);
  window.addEventListener('storage', handleStorage);
  if (bc) bc.onmessage = handleBroadcast;

  return () => {
    window.removeEventListener('espoir_data_updated', handleUpdate);
    window.removeEventListener('storage', handleStorage);
    if (bc) bc.onmessage = null;
  };
}

export function notifyDataUpdated(type: SyncDataType | 'all') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('espoir_data_updated', { detail: { type } }));
    if (bc) {
      try {
        bc.postMessage({ type });
      } catch (e) {}
    }
  }
}

// Robust fetch with retry logic
async function fetchWithRetry(url: string, options?: RequestInit, retries = 3, delay = 1000): Promise<Response> {
  try {
    const res = await fetch(url, options);
    if (!res.ok && res.status >= 500 && retries > 0) {
      await new Promise((r) => setTimeout(r, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    return res;
  } catch (err) {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw err;
  }
}

// Unified Sync Manager
export const syncManager = {
  async fetchEvents(): Promise<MinistryEvent[]> {
    try {
      const res = await fetchWithRetry('/api/events');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          localStorage.setItem('espoir_dynamic_events', JSON.stringify(data));
          return data;
        }
      }
    } catch (e) {}
    // Fallback to local storage
    try {
      const saved = localStorage.getItem('espoir_dynamic_events');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  },

  async saveEvents(events: MinistryEvent[] | MinistryEvent): Promise<MinistryEvent[]> {
    try {
      const res = await fetchWithRetry('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(events),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('espoir_dynamic_events', JSON.stringify(data));
        notifyDataUpdated('events');
        return data;
      }
    } catch (e) {}
    // Fallback save locally
    const current = localStorage.getItem('espoir_dynamic_events');
    const parsed = current ? JSON.parse(current) : [];
    const updated = Array.isArray(events) ? events : [events, ...parsed.filter((x: any) => x.id !== events.id)];
    localStorage.setItem('espoir_dynamic_events', JSON.stringify(updated));
    notifyDataUpdated('events');
    return updated;
  },

  async fetchPrayers(): Promise<PrayerItem[]> {
    try {
      const res = await fetchWithRetry('/api/prayers');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          localStorage.setItem('espoir_dynamic_prayers', JSON.stringify(data));
          return data;
        }
      }
    } catch (e) {}
    try {
      const saved = localStorage.getItem('espoir_dynamic_prayers');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  },

  async savePrayers(prayers: PrayerItem[] | PrayerItem): Promise<PrayerItem[]> {
    try {
      const res = await fetchWithRetry('/api/prayers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prayers),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('espoir_dynamic_prayers', JSON.stringify(data));
        notifyDataUpdated('prayers');
        return data;
      }
    } catch (e) {}
    const current = localStorage.getItem('espoir_dynamic_prayers');
    const parsed = current ? JSON.parse(current) : [];
    const updated = Array.isArray(prayers) ? prayers : [prayers, ...parsed.filter((x: any) => x.id !== prayers.id)];
    localStorage.setItem('espoir_dynamic_prayers', JSON.stringify(updated));
    notifyDataUpdated('prayers');
    return updated;
  },

  async fetchBlogPosts(): Promise<BlogPost[]> {
    try {
      const res = await fetchWithRetry('/api/blog');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          localStorage.setItem('espoir_dynamic_blog', JSON.stringify(data));
          return data;
        }
      }
    } catch (e) {}
    try {
      const saved = localStorage.getItem('espoir_dynamic_blog');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  },

  async saveBlogPosts(posts: BlogPost[] | BlogPost): Promise<BlogPost[]> {
    try {
      const res = await fetchWithRetry('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(posts),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('espoir_dynamic_blog', JSON.stringify(data));
        notifyDataUpdated('blog');
        return data;
      }
    } catch (e) {}
    const current = localStorage.getItem('espoir_dynamic_blog');
    const parsed = current ? JSON.parse(current) : [];
    const updated = Array.isArray(posts) ? posts : [posts, ...parsed.filter((x: any) => x.id !== posts.id)];
    localStorage.setItem('espoir_dynamic_blog', JSON.stringify(updated));
    notifyDataUpdated('blog');
    return updated;
  },

  async fetchMessages(): Promise<ContactMessage[]> {
    try {
      const res = await fetchWithRetry('/api/messages');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          localStorage.setItem('espoir_dynamic_messages', JSON.stringify(data));
          return data;
        }
      }
    } catch (e) {}
    try {
      const saved = localStorage.getItem('espoir_dynamic_messages');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  },

  async saveMessages(messages: ContactMessage[] | ContactMessage): Promise<ContactMessage[]> {
    try {
      const res = await fetchWithRetry('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messages),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('espoir_dynamic_messages', JSON.stringify(data));
        notifyDataUpdated('messages');
        return data;
      }
    } catch (e) {}
    const current = localStorage.getItem('espoir_dynamic_messages');
    const parsed = current ? JSON.parse(current) : [];
    const updated = Array.isArray(messages) ? messages : [messages, ...parsed.filter((x: any) => x.id !== messages.id)];
    localStorage.setItem('espoir_dynamic_messages', JSON.stringify(updated));
    notifyDataUpdated('messages');
    return updated;
  },

  async getSyncStatus(): Promise<SyncStatus> {
    let serverConnected = false;
    try {
      const res = await fetch('/api/events', { method: 'HEAD' });
      serverConnected = res.ok;
    } catch (e) {}

    return {
      lastSyncedAt: new Date().toLocaleTimeString('fr-FR'),
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      supabaseConnected: isSupabaseConfigured(),
      serverConnected,
    };
  }
};
