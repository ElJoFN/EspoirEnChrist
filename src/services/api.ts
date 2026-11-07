import { MinistryEvent } from '../data/events';
import { PrayerItem } from '../data/prayers';
import { BlogPost } from '../data/blogPosts';
import { ContactMessage } from '../data/contactMessages';
import { syncManager, registerDataSyncListener, notifyDataUpdated } from './syncService';

// Re-export robust sync manager methods and listeners
export { registerDataSyncListener, notifyDataUpdated, syncManager };

// 1. EVENTS API
export async function fetchServerEvents(): Promise<MinistryEvent[]> {
  return await syncManager.fetchEvents();
}

export async function saveServerEvents(events: MinistryEvent[] | MinistryEvent): Promise<MinistryEvent[]> {
  return await syncManager.saveEvents(events);
}

export async function deleteServerEvent(id: string): Promise<MinistryEvent[]> {
  const current = await syncManager.fetchEvents();
  const filtered = current.filter((e) => e.id !== id);
  return await syncManager.saveEvents(filtered);
}

// 2. PRAYERS API
export async function fetchServerPrayers(): Promise<PrayerItem[]> {
  return await syncManager.fetchPrayers();
}

export async function saveServerPrayers(prayers: PrayerItem[] | PrayerItem): Promise<PrayerItem[]> {
  return await syncManager.savePrayers(prayers);
}

export async function deleteServerPrayer(id: string): Promise<PrayerItem[]> {
  const current = await syncManager.fetchPrayers();
  const filtered = current.filter((p) => p.id !== id);
  return await syncManager.savePrayers(filtered);
}

// 3. BLOG API
export async function fetchServerBlogPosts(): Promise<BlogPost[]> {
  return await syncManager.fetchBlogPosts();
}

export async function saveServerBlogPosts(posts: BlogPost[] | BlogPost): Promise<BlogPost[]> {
  return await syncManager.saveBlogPosts(posts);
}

export async function deleteServerBlogPost(id: string): Promise<BlogPost[]> {
  const current = await syncManager.fetchBlogPosts();
  const filtered = current.filter((b) => b.id !== id);
  return await syncManager.saveBlogPosts(filtered);
}

// 4. MESSAGES API
export async function fetchServerMessages(): Promise<ContactMessage[]> {
  return await syncManager.fetchMessages();
}

export async function saveServerMessages(messages: ContactMessage[] | ContactMessage): Promise<ContactMessage[]> {
  return await syncManager.saveMessages(messages);
}

export async function deleteServerMessage(id: string): Promise<ContactMessage[]> {
  const current = await syncManager.fetchMessages();
  const filtered = current.filter((m) => m.id !== id);
  return await syncManager.saveMessages(filtered);
}
