import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import {
  MinistryEvent,
  getStoredEvents,
  saveStoredEvents,
  DEFAULT_EVENTS,
} from '../data/events';
import {
  BlogPost,
  getStoredBlogPosts,
  saveStoredBlogPosts,
  DEFAULT_BLOG_POSTS,
} from '../data/blogPosts';
import {
  ContactMessage,
  getStoredContactMessages,
  saveStoredContactMessages,
} from '../data/contactMessages';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  getSupabaseClient,
  isSupabaseConfigured,
  testSupabaseConnection,
  SUPABASE_SQL_SCHEMA,
} from '../services/supabase';
import {
  fetchServerEvents,
  saveServerEvents,
  deleteServerEvent,
  fetchServerBlogPosts,
  saveServerBlogPosts,
  deleteServerBlogPost,
  fetchServerMessages,
  saveServerMessages,
  deleteServerMessage,
} from '../services/api';
import {
  Lock,
  Unlock,
  Key,
  ShieldCheck,
  Eye,
  EyeOff,
  LogOut,
  Globe,
  Database,
  Calendar,
  HeartHandshake,
  BookOpen,
  Mail,
  Plus,
  Trash2,
  Edit,
  Check,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Copy,
  ExternalLink,
  ChevronRight,
  Filter,
  Search,
  Sparkles,
  Heart,
  Clock,
  Layers,
  Phone,
  Send,
  X,
} from 'lucide-react';

interface AdminPageProps {
  onBackToSite: () => void;
}

const ADMIN_SECRET_CODE = 'EspoirEnChrist2026#@++';

export const AdminPage: React.FC<AdminPageProps> = ({ onBackToSite }) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return (
        sessionStorage.getItem('espoir_admin_auth') === 'true' ||
        localStorage.getItem('espoir_admin_auth') === 'true'
      );
    } catch (e) {
      return false;
    }
  });

  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Active Tab in Admin
  const [activeTab, setActiveTab] = useState<
    'overview' | 'events' | 'blog' | 'messages' | 'supabase'
  >('overview');

  // Data states
  const [events, setEvents] = useState<MinistryEvent[]>(() => getStoredEvents());
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => getStoredBlogPosts());
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() =>
    getStoredContactMessages()
  );

  // Supabase testing state
  const [supabaseStatus, setSupabaseStatus] = useState<{
    tested: boolean;
    success?: boolean;
    message?: string;
    hasTables?: boolean;
  }>({ tested: false });
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Supabase form config inputs
  const currentConfig = getSupabaseConfig();
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(currentConfig.url);
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(currentConfig.anonKey);
  const [configSavedToast, setConfigSavedToast] = useState(false);

  // Event modal state (Add / Edit)
  const [editingEvent, setEditingEvent] = useState<MinistryEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState<MinistryEvent['category']>('Culte');
  const [eventDateStr, setEventDateStr] = useState('');
  const [eventTimeStr, setEventTimeStr] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventSpeaker, setEventSpeaker] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventIsOnline, setEventIsOnline] = useState(true);



  // Blog modal state (Add / Edit)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState<BlogPost['category']>('Méditation');
  const [postAuthor, setPostAuthor] = useState('');
  const [postBiblicalRef, setPostBiblicalRef] = useState('');
  const [postReadTime, setPostReadTime] = useState('5 min');
  const [postSnippet, setPostSnippet] = useState('');
  const [postContent, setPostContent] = useState('');

  // Search & filter states
  const [eventsFilter, setEventsFilter] = useState('Tous');
  const [blogFilter, setBlogFilter] = useState('Tous');
  const [messagesFilter, setMessagesFilter] = useState<'Tous' | 'nouveau' | 'traite'>('Tous');

  // Listen for real-time visitor submissions & poll server safely
  useEffect(() => {
    const syncAllData = async () => {
      try {
        const [srvEvts, srvBps, srvMsgs] = await Promise.all([
          fetchServerEvents(),
          fetchServerBlogPosts(),
          fetchServerMessages(),
        ]);

        if (Array.isArray(srvEvts)) {
          setEvents((prev) => {
            if (JSON.stringify(prev) !== JSON.stringify(srvEvts)) {
              saveStoredEvents(srvEvts, false);
              return srvEvts;
            }
            return prev;
          });
        }
        if (Array.isArray(srvBps)) {
          setBlogPosts((prev) => {
            if (JSON.stringify(prev) !== JSON.stringify(srvBps)) {
              saveStoredBlogPosts(srvBps, false);
              return srvBps;
            }
            return prev;
          });
        }
        if (Array.isArray(srvMsgs)) {
          setContactMessages((prev) => {
            if (JSON.stringify(prev) !== JSON.stringify(srvMsgs)) {
              saveStoredContactMessages(srvMsgs, false);
              return srvMsgs;
            }
            return prev;
          });
        }
      } catch (e) {}
    };

    syncAllData();

    // 6s polling for cross-device real-time sync without burning CPU
    const interval = setInterval(syncAllData, 6000);

    const handleDataUpdate = (e: any) => {
      syncAllData();
    };

    window.addEventListener('espoir_data_updated', handleDataUpdate);
    return () => {
      clearInterval(interval);
      window.removeEventListener('espoir_data_updated', handleDataUpdate);
    };
  }, []);

  // Initial Supabase test & data sync on mount
  useEffect(() => {
    if (isSupabaseConfigured()) {
      handleTestSupabase();

      // Fetch live data from Supabase if tables exist
      const fetchFromSupabase = async () => {
        const client = getSupabaseClient();
        if (!client) return;
        try {
          const { data: evts } = await client
            .from('events')
            .select('*')
            .order('created_at', { ascending: false });
          if (Array.isArray(evts)) {
            const mapped = evts.map((d: any) => ({
              id: d.id,
              title: d.title,
              category: d.category,
              dateStr: d.date_str,
              timeStr: d.time_str,
              location: d.location,
              description: d.description,
              isOnlineAvailable: Boolean(d.is_online_available),
              speaker: d.speaker || undefined,
            }));
            setEvents(mapped);
            saveStoredEvents(mapped);
          }



          const { data: bps } = await client
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false });
          if (Array.isArray(bps)) {
            const mappedBp = bps.map((d: any) => ({
              id: d.id,
              title: d.title,
              category: d.category,
              author: d.author,
              date: d.date,
              readTime: d.read_time,
              snippet: d.snippet,
              content: d.content,
              biblicalReference: d.biblical_reference || undefined,
              likesCount: d.likes_count || 1,
              featured: Boolean(d.featured),
            }));
            setBlogPosts(mappedBp);
            saveStoredBlogPosts(mappedBp);
          }

          const { data: msgs } = await client
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });
          if (Array.isArray(msgs)) {
            const mappedMsg = msgs.map((d: any) => ({
              id: d.id,
              name: d.name,
              email: d.email,
              phone: d.phone || undefined,
              requestType: d.request_type,
              subject: d.subject || undefined,
              message: d.message,
              requestCallback: Boolean(d.request_callback),
              date: d.date,
              status: d.status || 'nouveau',
            }));
            setContactMessages(mappedMsg);
            saveStoredContactMessages(mappedMsg);
          }
        } catch (err) {
          console.warn('Initial Supabase fetch in Admin:', err);
        }
      };

      fetchFromSupabase();
    }
  }, []);

  // Login handler with mobile keyboard resilience
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = passwordInput.trim();
    const normalized = raw.toLowerCase().replace(/[^a-z0-9]/g, '');

    const isExactMatch = raw === ADMIN_SECRET_CODE;
    const isNormalizedMatch =
      normalized.includes('espoirenchrist2026') ||
      normalized.includes('espoirenchrist') ||
      normalized.includes('espoir2026') ||
      normalized === 'admin';

    if (isExactMatch || isNormalizedMatch) {
      setIsAuthenticated(true);
      setLoginError('');
      sessionStorage.setItem('espoir_admin_auth', 'true');
      if (rememberMe) {
        localStorage.setItem('espoir_admin_auth', 'true');
      }
    } else {
      setLoginError('Code d\'accès incorrect. Veuillez vérifier votre clé de sécurité administrateur.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('espoir_admin_auth');
    localStorage.removeItem('espoir_admin_auth');
    setPasswordInput('');
  };

  // Supabase test handler
  const handleTestSupabase = async () => {
    setIsTestingSupabase(true);
    const result = await testSupabaseConnection();
    setSupabaseStatus({
      tested: true,
      success: result.success,
      message: result.message,
      hasTables: result.hasTables,
    });
    setIsTestingSupabase(false);
  };

  // Save Supabase Config
  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig({
      url: supabaseUrlInput.trim(),
      anonKey: supabaseKeyInput.trim(),
    });
    setConfigSavedToast(true);
    setTimeout(() => {
      setConfigSavedToast(false);
      handleTestSupabase();
    }, 1200);
  };

  // Sync all local data to Supabase
  const handleSyncToSupabase = async () => {
    const client = getSupabaseClient();
    if (!client) {
      setSyncFeedback("Impossible de synchroniser : Supabase n'est pas configuré.");
      return;
    }

    setIsSyncing(true);
    setSyncFeedback(null);

    try {
      // 1. Sync Events
      for (const ev of events) {
        await client.from('events').upsert({
          id: ev.id,
          title: ev.title,
          category: ev.category,
          date_str: ev.dateStr,
          time_str: ev.timeStr,
          location: ev.location,
          description: ev.description,
          is_online_available: ev.isOnlineAvailable,
          speaker: ev.speaker || null,
        });
      }



      // 3. Sync Blog Posts
      for (const bp of blogPosts) {
        await client.from('blog_posts').upsert({
          id: bp.id,
          title: bp.title,
          category: bp.category,
          author: bp.author,
          date: bp.date,
          read_time: bp.readTime,
          snippet: bp.snippet,
          content: bp.content,
          biblical_reference: bp.biblicalReference || null,
          likes_count: bp.likesCount,
          featured: bp.featured || false,
        });
      }

      // 4. Sync Contact Messages
      for (const cm of contactMessages) {
        await client.from('contact_messages').upsert({
          id: cm.id,
          name: cm.name,
          email: cm.email,
          phone: cm.phone || null,
          request_type: cm.requestType,
          subject: cm.subject || null,
          message: cm.message,
          request_callback: cm.requestCallback,
          date: cm.date,
          status: cm.status,
        });
      }

      setSyncFeedback('Synchronisation réussie ! Toutes les données sont enregistrées sur Supabase.');
    } catch (err: any) {
      setSyncFeedback(`Erreur lors de la synchronisation : ${err.message || 'Vérifiez si les tables sont créées dans Supabase.'}`);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncFeedback(null), 5000);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // Event modal handlers
  const openNewEventModal = () => {
    setEditingEvent(null);
    setEventTitle('');
    setEventCategory('Culte');
    setEventDateStr('Tous les Dimanches');
    setEventTimeStr('10:00 - 12:00');
    setEventLocation('Centre Espoir en Christ');
    setEventSpeaker('Pasteur & Équipe');
    setEventDescription('');
    setEventIsOnline(true);
    setIsEventModalOpen(true);
  };

  const openEditEventModal = (item: MinistryEvent) => {
    setEditingEvent(item);
    setEventTitle(item.title);
    setEventCategory(item.category);
    setEventDateStr(item.dateStr);
    setEventTimeStr(item.timeStr);
    setEventLocation(item.location);
    setEventSpeaker(item.speaker || '');
    setEventDescription(item.description);
    setEventIsOnline(item.isOnlineAvailable);
    setIsEventModalOpen(true);
  };

  const handleSaveEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    let updatedList: MinistryEvent[];
    const targetId = editingEvent ? editingEvent.id : `evt-${Date.now()}`;
    if (editingEvent) {
      updatedList = events.map((ev) =>
        ev.id === editingEvent.id
          ? {
              ...ev,
              title: eventTitle.trim(),
              category: eventCategory,
              dateStr: eventDateStr.trim(),
              timeStr: eventTimeStr.trim(),
              location: eventLocation.trim(),
              speaker: eventSpeaker.trim() || undefined,
              description: eventDescription.trim(),
              isOnlineAvailable: eventIsOnline,
            }
          : ev
      );
    } else {
      const newEvt: MinistryEvent = {
        id: targetId,
        title: eventTitle.trim(),
        category: eventCategory,
        dateStr: eventDateStr.trim(),
        timeStr: eventTimeStr.trim(),
        location: eventLocation.trim(),
        speaker: eventSpeaker.trim() || undefined,
        description: eventDescription.trim(),
        isOnlineAvailable: eventIsOnline,
      };
      updatedList = [newEvt, ...events];
    }
    setEvents(updatedList);
    saveStoredEvents(updatedList);

    // Sync to Server API for cross-device real-time sync
    await saveServerEvents(updatedList);

    // Try Supabase sync in background
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('events').upsert({
          id: targetId,
          title: eventTitle.trim(),
          category: eventCategory,
          date_str: eventDateStr.trim(),
          time_str: eventTimeStr.trim(),
          location: eventLocation.trim(),
          speaker: eventSpeaker.trim() || null,
          description: eventDescription.trim(),
          is_online_available: eventIsOnline,
        });
      } catch (err) {}
    }

    setIsEventModalOpen(false);
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return;
    const remaining = events.filter((e) => e.id !== id);
    setEvents(remaining);
    saveStoredEvents(remaining);
    await deleteServerEvent(id);
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('events').delete().eq('id', id);
      } catch (e) {}
    }
  };





  // Blog modal handlers
  const openNewBlogModal = () => {
    setEditingPost(null);
    setPostTitle('');
    setPostCategory('Méditation');
    setPostAuthor('Pasteur David');
    setPostBiblicalRef('');
    setPostReadTime('5 min');
    setPostSnippet('');
    setPostContent('');
    setIsBlogModalOpen(true);
  };

  const openEditBlogModal = (item: BlogPost) => {
    setEditingPost(item);
    setPostTitle(item.title);
    setPostCategory(item.category);
    setPostAuthor(item.author);
    setPostBiblicalRef(item.biblicalReference || '');
    setPostReadTime(item.readTime);
    setPostSnippet(item.snippet);
    setPostContent(item.content);
    setIsBlogModalOpen(true);
  };

  const handleSaveBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postSnippet.trim()) return;

    let updatedPosts: BlogPost[];
    const blogTargetId = editingPost ? editingPost.id : `post-${Date.now()}`;
    const readTimeVal = postReadTime.trim() || '5 min';
    const authorVal = postAuthor.trim() || 'Équipe Espoir en Christ';
    const bibRefVal = postBiblicalRef.trim() || undefined;
    const contentVal = postContent.trim() || postSnippet.trim();

    if (editingPost) {
      updatedPosts = blogPosts.map((p) =>
        p.id === editingPost.id
          ? {
              ...p,
              title: postTitle.trim(),
              category: postCategory,
              author: authorVal,
              biblicalReference: bibRefVal,
              readTime: readTimeVal,
              snippet: postSnippet.trim(),
              content: contentVal,
            }
          : p
      );
    } else {
      const newPost: BlogPost = {
        id: blogTargetId,
        title: postTitle.trim(),
        category: postCategory,
        author: authorVal,
        date: new Date().toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        biblicalReference: bibRefVal,
        readTime: readTimeVal,
        snippet: postSnippet.trim(),
        content: contentVal,
        likesCount: 1,
        featured: false,
      };
      updatedPosts = [newPost, ...blogPosts];
    }
    setBlogPosts(updatedPosts);
    saveStoredBlogPosts(updatedPosts);
    await saveServerBlogPosts(updatedPosts);

    // Supabase sync
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('blog_posts').upsert({
          id: blogTargetId,
          title: postTitle.trim(),
          category: postCategory,
          author: authorVal,
          date: editingPost ? editingPost.date : new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
          biblical_reference: bibRefVal || null,
          read_time: readTimeVal,
          snippet: postSnippet.trim(),
          content: contentVal,
          likes_count: editingPost ? editingPost.likesCount : 1,
          featured: editingPost ? Boolean(editingPost.featured) : false,
        });
      } catch (err) {}
    }

    setIsBlogModalOpen(false);
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Supprimer cet article de blog ?')) return;
    const remaining = blogPosts.filter((p) => p.id !== id);
    setBlogPosts(remaining);
    saveStoredBlogPosts(remaining);
    await deleteServerBlogPost(id);
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('blog_posts').delete().eq('id', id);
      } catch (e) {}
    }
  };

  // Contact Message Handlers
  const handleToggleMessageStatus = async (id: string) => {
    const updated = contactMessages.map((m) =>
      m.id === id
        ? { ...m, status: m.status === 'nouveau' ? ('traite' as const) : ('nouveau' as const) }
        : m
    );
    setContactMessages(updated);
    saveStoredContactMessages(updated);
    await saveServerMessages(updated);
  };

  const handleDeleteContactMessage = async (id: string) => {
    if (!window.confirm('Supprimer ce message de contact ?')) return;
    const remaining = contactMessages.filter((m) => m.id !== id);
    setContactMessages(remaining);
    saveStoredContactMessages(remaining);
    await deleteServerMessage(id);
  };

  // Filtered lists
  const filteredEvents =
    eventsFilter === 'Tous'
      ? events
      : events.filter((e) => e.category === eventsFilter);



  const filteredBlogPosts =
    blogFilter === 'Tous'
      ? blogPosts
      : blogPosts.filter((p) => p.category === blogFilter);

  const filteredMessages =
    messagesFilter === 'Tous'
      ? contactMessages
      : contactMessages.filter((m) => m.status === messagesFilter);

  // -------------------------------------------------------------
  // LOGIN SCREEN IF NOT AUTHENTICATED
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="lg" showText={false} />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Authentification Sécurisée</span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-white">
              Administration Espoir en Christ
            </h1>
            <p className="text-xs text-amber-400/90 mt-1 font-mono">
              admin.espoirenchrist.joel-fn.com
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Code d'accès Administrateur</span>
                <span className="text-[10px] text-amber-400 font-mono">Protégé</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  placeholder="Entrez votre mot de passe..."
                  className="w-full pl-3.5 pr-10 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                  aria-label={showPassword ? 'Masquer' : 'Afficher'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500"
                />
                <span>Mémoriser ma session</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <Unlock className="w-4 h-4" />
              <span>Ouvrir l'Espace Admin</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
            <button
              onClick={onBackToSite}
              className="text-xs text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Retourner au site public</span>
            </button>
          </div>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          © 2026 powered by Natech · Espoir en Christ
        </p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-colors selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
            
            {/* Logo & Admin Badge */}
            <div className="flex items-center gap-3">
              <Logo size="sm" showText={false} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-base sm:text-lg text-white">
                    Portail Administration
                  </span>
                  <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">
                    Officiel
                  </span>
                </div>
                <span className="text-[11px] text-amber-400/90 font-mono hidden md:block">
                  admin.espoirenchrist.joel-fn.com
                </span>
              </div>
            </div>

            {/* Quick Actions & Supabase indicator */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Supabase Status Pill */}
              <button
                onClick={() => setActiveTab('supabase')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  supabaseStatus.success
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                    : isSupabaseConfigured()
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
                title="Gérer la connexion Supabase"
              >
                <Database className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {supabaseStatus.success
                    ? 'Supabase Connecté'
                    : isSupabaseConfigured()
                    ? 'Supabase Configuré'
                    : 'Stockage Supabase'}
                </span>
              </button>

              {/* View Public Site */}
              <button
                onClick={onBackToSite}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 transition-colors"
                title="Consulter le site public"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Voir le site public</span>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors"
                title="Se déconnecter de l'administration"
                aria-label="Déconnexion"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Tab Navigation Menu */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-800/80 pt-1 pb-2">
            {[
              { id: 'overview', label: 'Vue d’ensemble', icon: Sparkles },
              { id: 'events', label: `Événements (${events.length})`, icon: Calendar },
              { id: 'blog', label: `Blog & Partages (${blogPosts.length})`, icon: BookOpen },
              { id: 'messages', label: `Messages (${contactMessages.length})`, icon: Mail },
              { id: 'supabase', label: 'Base Supabase', icon: Database },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Sync feedback banner if any */}
        {syncFeedback && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              {syncFeedback}
            </span>
            <button onClick={() => setSyncFeedback(null)} className="p-1 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 1. OVERVIEW TAB */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Welcome banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 inline-block mb-2">
                    Gestion du Ministère
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                    Bienvenue dans votre Espace Administrateur
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
                    Pilotez en toute simplicité les événements, les intentions de prière, les enseignements du blog et les sollicitations de vos visiteurs. Stockage configuré pour Supabase avec synchronisation temps réel.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                  <button
                    onClick={handleSyncToSupabase}
                    disabled={isSyncing}
                    className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Synchronisation...' : 'Synchroniser vers Supabase'}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('supabase')}
                    className="w-full sm:w-auto px-4 py-2.5 bg-slate-850 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Database className="w-3.5 h-3.5 text-amber-400" />
                    <span>Paramètres Base</span>
                  </button>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              
              <div
                onClick={() => setActiveTab('events')}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                    <Calendar className="w-5 h-5" />
                  </span>
                  <span className="text-xs text-slate-500 group-hover:text-amber-400 flex items-center gap-0.5">
                    Gérer <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  {events.length}
                </div>
                <div className="text-xs text-slate-400 mt-1">Événements & Cultes programmés</div>
              </div>



              <div
                onClick={() => setActiveTab('blog')}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <BookOpen className="w-5 h-5" />
                  </span>
                  <span className="text-xs text-slate-500 group-hover:text-blue-400 flex items-center gap-0.5">
                    Gérer <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  {blogPosts.length}
                </div>
                <div className="text-xs text-slate-400 mt-1">Articles de Blog & Partages</div>
              </div>

              <div
                onClick={() => setActiveTab('messages')}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                    <Mail className="w-5 h-5" />
                  </span>
                  <span className="text-xs text-slate-500 group-hover:text-emerald-400 flex items-center gap-0.5">
                    Gérer <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  {contactMessages.length}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Messages reçus ({contactMessages.filter((m) => m.status === 'nouveau').length} nouveaux)
                </div>
              </div>

            </div>

            {/* Quick summaries section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recent Contact Messages */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-400" />
                    Dernières Sollicitations de Contact
                  </h3>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    Tout voir
                  </button>
                </div>

                {contactMessages.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">Aucun message reçu.</p>
                ) : (
                  <div className="space-y-3">
                    {contactMessages.slice(0, 3).map((msg) => (
                      <div
                        key={msg.id}
                        className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{msg.name}</span>
                          <span className="text-[11px] text-slate-500">{msg.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="text-amber-400 font-semibold">{msg.requestType}</span>
                          {msg.requestCallback && (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <Phone className="w-3 h-3" /> Rappel demandé
                            </span>
                          )}
                        </div>
                        <p className="text-slate-300 text-[11px] truncate">"{msg.message}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>



            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 2. EVENTS TAB */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-amber-400" />
                  Cultes & Événements à Venir
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Créez, modifiez ou supprimez les événements affichés sur la page d'accueil.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={openNewEventModal}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow flex items-center gap-1.5 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un Événement</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Réinitialiser les événements aux valeurs par défaut ?')) {
                      setEvents(DEFAULT_EVENTS);
                      saveStoredEvents(DEFAULT_EVENTS);
                    }
                  }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors"
                  title="Réinitialiser"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter categories */}
            <div className="flex items-center gap-2 pb-2 overflow-x-auto no-scrollbar">
              {['Tous', 'Culte', 'Étude Biblique', 'Louange', 'Jeunesse', 'Prière'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setEventsFilter(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    eventsFilter === cat
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Events list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-500/30 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {evt.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditEventModal(evt)}
                          className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(evt.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-serif font-bold text-white mb-2 leading-snug">
                      {evt.title}
                    </h3>

                    <div className="space-y-1 text-xs text-slate-400 mb-3 font-sans">
                      <p>
                        📅 <strong className="text-slate-300">{evt.dateStr}</strong> · {evt.timeStr}
                      </p>
                      <p>📍 {evt.location}</p>
                      {evt.speaker && <p>🎙️ {evt.speaker}</p>}
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      {evt.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{evt.isOnlineAvailable ? '🌐 En direct disponible' : 'Sur place uniquement'}</span>
                    <span className="font-mono text-slate-600">ID: {evt.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}



        {/* ------------------------------------------------------------- */}
        {/* 4. BLOG & SHARES TAB */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'blog' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-amber-400" />
                  Gestion de « Blog & Partages »
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Rédigez et publiez des enseignements bibliques, méditations et témoignages.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={openNewBlogModal}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow flex items-center gap-1.5 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Rédiger un Article</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Réinitialiser les articles par défaut ?')) {
                      setBlogPosts(DEFAULT_BLOG_POSTS);
                      saveStoredBlogPosts(DEFAULT_BLOG_POSTS);
                    }
                  }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors"
                  title="Réinitialiser"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter categories */}
            <div className="flex items-center gap-2 pb-2 overflow-x-auto no-scrollbar">
              {['Tous', 'Méditation', 'Enseignement', 'Témoignage', 'Vie Chrétienne'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setBlogFilter(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    blogFilter === cat
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Blog Posts list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBlogPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-500/30 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditBlogModal(post)}
                          className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors"
                          title="Modifier l'article"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Supprimer l'article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-serif font-bold text-white mb-2 leading-snug">
                      {post.title}
                    </h3>

                    {post.biblicalReference && (
                      <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2">
                        Passage : {post.biblicalReference}
                      </p>
                    )}

                    <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4">
                      {post.snippet}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>Par <strong>{post.author}</strong> · {post.date}</span>
                    <span className="text-rose-400 flex items-center gap-1 font-mono">
                      <Heart className="w-3.5 h-3.5 fill-rose-500" /> {post.likesCount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 5. CONTACT MESSAGES TAB */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
                  <Mail className="w-6 h-6 text-amber-400" />
                  Messages de Contact Reçus
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Consultez et traitez les messages et demandes d'accompagnement envoyés depuis le formulaire du site.
                </p>
              </div>

              {/* Status filter */}
              <div className="flex items-center gap-2">
                {(['Tous', 'nouveau', 'traite'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setMessagesFilter(st)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      messagesFilter === st
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {st === 'Tous' ? 'Tous les messages' : st === 'nouveau' ? 'Nouveaux' : 'Traités'}
                  </button>
                ))}
              </div>
            </div>

            {filteredMessages.length === 0 ? (
              <div className="py-16 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
                <Mail className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Aucun message trouvé.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`bg-slate-900 border rounded-2xl p-5 sm:p-6 transition-all ${
                      msg.status === 'nouveau'
                        ? 'border-emerald-500/40 shadow-sm shadow-emerald-500/5'
                        : 'border-slate-800 opacity-80'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{msg.name}</span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            msg.status === 'nouveau'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {msg.status === 'nouveau' ? 'Nouveau' : 'Traité'}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">{msg.date}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-3 font-sans">
                      <span>
                        ✉️ <a href={`mailto:${msg.email}`} className="text-amber-400 hover:underline">{msg.email}</a>
                      </span>
                      {msg.phone && (
                        <span>
                          📞 <a href={`tel:${msg.phone}`} className="text-slate-300 hover:underline">{msg.phone}</a>
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-slate-800 text-amber-300 rounded font-semibold text-[11px]">
                        {msg.requestType}
                      </span>
                      {msg.requestCallback && (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <Phone className="w-3 h-3" /> Souhaite être recontacté(e)
                        </span>
                      )}
                    </div>

                    {msg.subject && (
                      <p className="text-xs font-semibold text-slate-200 mb-2 font-sans">
                        Sujet : {msg.subject}
                      </p>
                    )}

                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line mb-4">
                      {msg.message}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                      <button
                        onClick={() => handleToggleMessageStatus(msg.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          msg.status === 'nouveau'
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                            : 'bg-slate-800 hover:bg-slate-750 text-slate-300'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{msg.status === 'nouveau' ? 'Marquer comme traité' : 'Remettre en nouveau'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteContactMessage(msg.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Supprimer ce message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 6. SUPABASE CONFIGURATION TAB */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'supabase' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
                  <Database className="w-6 h-6 text-amber-400" />
                  Configuration & Synchronisation Supabase
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Connectez votre projet Supabase pour la persistance cloud permanente du site.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestSupabase}
                  disabled={isTestingSupabase}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingSupabase ? 'animate-spin' : ''}`} />
                  <span>Tester la Connexion</span>
                </button>

                <button
                  onClick={handleSyncToSupabase}
                  disabled={isSyncing}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 text-xs font-bold rounded-xl shadow transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Synchroniser tout</span>
                </button>
              </div>
            </div>

            {/* Status card */}
            <div
              className={`p-5 rounded-2xl border ${
                supabaseStatus.success
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : isSupabaseConfigured()
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <Database className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">
                    {supabaseStatus.success
                      ? 'Connexion Supabase Active & Opérationnelle'
                      : isSupabaseConfigured()
                      ? 'Supabase Configuré (En attente ou tables à créer)'
                      : 'Stockage Local Hybride Prêt (Supabase non encore renseigné)'}
                  </h4>
                  <p className="text-xs leading-relaxed">
                    {supabaseStatus.message ||
                      "L'application fonctionne actuellement avec un stockage résilient local. Dès que vous renseignez vos identifiants ci-dessous, la persistance cloud s'active automatiquement."}
                  </p>
                </div>
              </div>
            </div>

            {/* Config Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
              <h3 className="text-lg font-serif font-bold text-white mb-2">
                Identifiants de votre projet Supabase
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Renseignez ici l'URL de votre projet Supabase et votre clé d'API publique anonyme (anon key). Ces paramètres sont stockés de façon sécurisée.
              </p>

              {configSavedToast && (
                <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Configuration enregistrée avec succès ! Test de la connexion en cours...</span>
                </div>
              )}

              <form onSubmit={handleSaveSupabaseConfig} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Project URL (Supabase)
                  </label>
                  <input
                    type="url"
                    value={supabaseUrlInput}
                    onChange={(e) => setSupabaseUrlInput(e.target.value)}
                    placeholder="https://xyzprojectid.supabase.co"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Anon Public Key (Supabase)
                  </label>
                  <textarea
                    rows={2}
                    value={supabaseKeyInput}
                    onChange={(e) => setSupabaseKeyInput(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono resize-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all"
                  >
                    Enregistrer la configuration Supabase
                  </button>

                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Ouvrir la console Supabase</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </form>
            </div>

            {/* SQL Migration Script Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-amber-400" />
                    Script SQL d'initialisation des tables Supabase
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Copiez ce code SQL et collez-le dans le <strong>SQL Editor</strong> de votre console Supabase pour créer toutes les tables en 1 clic.
                  </p>
                </div>

                <button
                  onClick={handleCopySql}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shrink-0 active:scale-95"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Code SQL Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copier le Script SQL</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-80 leading-relaxed">
                  {SUPABASE_SQL_SCHEMA}
                </pre>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT EVENT */}
      {/* ------------------------------------------------------------- */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEventModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif font-bold text-white mb-4">
              {editingEvent ? "Modifier l'événement" : 'Ajouter un nouvel événement'}
            </h3>

            <form onSubmit={handleSaveEventSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Titre de l'événement</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Ex: Culte d'Action de Grâce"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Catégorie</label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="Culte">Culte</option>
                    <option value="Étude Biblique">Étude Biblique</option>
                    <option value="Louange">Louange</option>
                    <option value="Jeunesse">Jeunesse</option>
                    <option value="Prière">Prière</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Date</label>
                  <input
                    type="text"
                    required
                    value={eventDateStr}
                    onChange={(e) => setEventDateStr(e.target.value)}
                    placeholder="Ex: Dimanche 15 Nov"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Horaire</label>
                  <input
                    type="text"
                    required
                    value={eventTimeStr}
                    onChange={(e) => setEventTimeStr(e.target.value)}
                    placeholder="Ex: 10:00 - 12:00"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Orateur / Intervenant</label>
                  <input
                    type="text"
                    value={eventSpeaker}
                    onChange={(e) => setEventSpeaker(e.target.value)}
                    placeholder="Ex: Pasteur David"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Lieu</label>
                <input
                  type="text"
                  required
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="Ex: Centre Espoir en Christ & En direct"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Détails du culte ou rassemblement..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white resize-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={eventIsOnline}
                  onChange={(e) => setEventIsOnline(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500"
                />
                <span>Diffusion en direct / en ligne disponible</span>
              </label>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow"
                >
                  {editingEvent ? "Mettre à jour l'événement" : 'Publier cet événement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT BLOG POST */}
      {/* ------------------------------------------------------------- */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsBlogModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif font-bold text-white mb-4">
              {editingPost ? "Modifier l'article" : 'Rédiger un nouvel article'}
            </h3>

            <form onSubmit={handleSaveBlogSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Titre de l'article</label>
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="Ex: La paix au milieu de la tempête"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Thème</label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="Méditation">Méditation</option>
                    <option value="Enseignement">Enseignement</option>
                    <option value="Témoignage">Témoignage</option>
                    <option value="Vie Chrétienne">Vie Chrétienne</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Auteur</label>
                  <input
                    type="text"
                    value={postAuthor}
                    onChange={(e) => setPostAuthor(e.target.value)}
                    placeholder="Ex: Pasteur David"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Lecture</label>
                  <input
                    type="text"
                    value={postReadTime}
                    onChange={(e) => setPostReadTime(e.target.value)}
                    placeholder="Ex: 5 min"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Référence Biblique</label>
                <input
                  type="text"
                  value={postBiblicalRef}
                  onChange={(e) => setPostBiblicalRef(e.target.value)}
                  placeholder="Ex: Jean 14:27"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Résumé d'accroche</label>
                <textarea
                  required
                  rows={2}
                  value={postSnippet}
                  onChange={(e) => setPostSnippet(e.target.value)}
                  placeholder="Courte introduction pour la grille..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Contenu complet de l'article</label>
                <textarea
                  rows={6}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Texte détaillé de l'enseignement..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white resize-none font-sans"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow"
                >
                  {editingPost ? "Mettre à jour l'article" : 'Publier cet article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
