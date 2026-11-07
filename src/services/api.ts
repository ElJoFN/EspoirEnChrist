import { MinistryEvent } from '../data/events';
import { PrayerItem } from '../data/prayers';
import { BlogPost } from '../data/blogPosts';
import { ContactMessage } from '../data/contactMessages';

// ------------------------------------------------------------------
// REALTIME CROSS-DEVICE BACKEND API SERVICE
// ------------------------------------------------------------------

// 1. EVENTS API
export async function fetchServerEvents(): Promise<MinistryEvent[]> {
  try {
    const res = await fetch('/api/events');
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }
  } catch (e) {}
  return [];
}

export async function saveServerEvents(events: MinistryEvent[] | MinistryEvent): Promise<MinistryEvent[]> {
  try {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(events),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}
  return [];
}

export async function deleteServerEvent(id: string): Promise<MinistryEvent[]> {
  try {
    const res = await fetch(`/api/events/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}
  return [];
}

// 2. PRAYERS API
export async function fetchServerPrayers(): Promise<PrayerItem[]> {
  try {
    const res = await fetch('/api/prayers');
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }
  } catch (e) {}
  return [];
}

export async function saveServerPrayers(prayers: PrayerItem[] | PrayerItem): Promise<PrayerItem[]> {
  try {
    const res = await fetch('/api/prayers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prayers),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}
  return [];
}

export async function deleteServerPrayer(id: string): Promise<PrayerItem[]> {
  try {
    const res = await fetch(`/api/prayers/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}
  return [];
}

// 3. BLOG API
export async function fetchServerBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch('/api/blog');
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }
  } catch (e) {}
  return [];
}

export async function saveServerBlogPosts(posts: BlogPost[] | BlogPost): Promise<BlogPost[]> {
  try {
    const res = await fetch('/api/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(posts),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}
  return [];
}

export async function deleteServerBlogPost(id: string): Promise<BlogPost[]> {
  try {
    const res = await fetch(`/api/blog/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}
  return [];
}

// 4. MESSAGES API
export async function fetchServerMessages(): Promise<ContactMessage[]> {
  try {
    const res = await fetch('/api/messages');
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }
  } catch (e) {}
  return [];
}

export async function saveServerMessages(messages: ContactMessage[] | ContactMessage): Promise<ContactMessage[]> {
  try {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messages),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}
  return [];
}

export async function deleteServerMessage(id: string): Promise<ContactMessage[]> {
  try {
    const res = await fetch(`/api/messages/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}
  return [];
}
