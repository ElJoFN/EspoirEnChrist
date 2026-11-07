import React, { useState, useEffect } from 'react';
import { BlogPost, getStoredBlogPosts, saveStoredBlogPosts } from '../data/blogPosts';
import { getSupabaseClient } from '../services/supabase';
import { fetchServerBlogPosts, registerDataSyncListener } from '../services/api';
import { BookOpen, Heart, ArrowLeft, Send, Check, Search, Filter, Clock, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface BlogPageProps {
  onBackToHome: () => void;
}

const POSTS_PER_PAGE = 6;

export const BlogPage: React.FC<BlogPageProps> = ({ onBackToHome }) => {
  const [posts, setPosts] = useState<BlogPost[]>(() => getStoredBlogPosts());
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('espoir_liked_posts');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Load and sync blog posts with Server API, Supabase and localStorage
  useEffect(() => {
    const loadBlogPosts = async () => {
      // 1. Fetch from server API
      const serverBps = await fetchServerBlogPosts();
      if (Array.isArray(serverBps)) {
        setPosts((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(serverBps)) {
            saveStoredBlogPosts(serverBps, false);
            return serverBps;
          }
          return prev;
        });
      }

      // 2. If Supabase is connected, fetch live posts
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && Array.isArray(data)) {
            const mapped: BlogPost[] = data.map((d: any) => ({
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
            setPosts((prev) => {
              if (JSON.stringify(prev) !== JSON.stringify(mapped)) {
                saveStoredBlogPosts(mapped, false);
                return mapped;
              }
              return prev;
            });
          }
        } catch (e) {
          console.warn('Supabase fetch blog posts error:', e);
        }
      }
    };

    loadBlogPosts();

    // Poll server API every 4s for instant cross-device real-time sync
    const interval = setInterval(loadBlogPosts, 4000);

    // Register robust cross-tab & cross-component listener
    const unregister = registerDataSyncListener('blog', loadBlogPosts);

    return () => {
      clearInterval(interval);
      unregister();
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('espoir_liked_posts', JSON.stringify(likedPosts));
    } catch (e) {}
  }, [likedPosts]);

  const handleLikeClick = async (id: string) => {
    if (likedPosts[id]) return;

    const targetPost = posts.find((p) => p.id === id);
    const newCount = targetPost ? targetPost.likesCount + 1 : 1;

    const updated = posts.map((p) =>
      p.id === id ? { ...p, likesCount: newCount } : p
    );
    setPosts(updated);
    saveStoredBlogPosts(updated);
    setLikedPosts((prev) => ({ ...prev, [id]: true }));

    // Sync to Supabase in background
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase
          .from('blog_posts')
          .update({ likes_count: newCount })
          .eq('id', id);
      } catch (err) {}
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 2000);
  };

  const categories = ['Tous', 'Méditation', 'Enseignement', 'Témoignage', 'Vie Chrétienne'];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === 'Tous' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.biblicalReference && post.biblicalReference.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Pagination logic: max 6 articles per page
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-12 sm:py-16 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-[85vh] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Back Navigation (Clean) */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-400 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'Accueil</span>
          </button>
        </div>

        {/* Hero Header */}
        <div className="bg-gradient-to-br from-amber-50 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/40 border border-amber-300 dark:border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-md dark:shadow-xl relative overflow-hidden mb-12 transition-colors">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 bg-amber-500/15 dark:bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 inline-block mb-3">
            Blog & Partages
          </span>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            Enseignements, Méditations & Témoignages
          </h1>

          <p className="mt-4 text-sm sm:text-lg font-serif italic text-amber-800 dark:text-amber-300 max-w-2xl leading-relaxed">
            « On partage la parole de Dieu pour te donner du courage car Dieu est fidèle. Il a promis, Il accomplira. »
          </p>

          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl font-sans">
            Découvrez nos articles spirituels inspirants pour nourrir votre foi, méditer la sainte Écriture et entendre comment le Seigneur agit concrètement dans nos vies.
          </p>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
          
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5 text-amber-500" />
              Thème :
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Rechercher un article..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>

        </div>

        {/* Articles Grid (Clean Visitor Interface) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {paginatedPosts.map((post) => {
            const hasLiked = likedPosts[post.id];
            return (
              <div
                key={post.id}
                className="bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/40 rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
              >
                <div>
                  {/* Category, Date & Read Time */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-300 dark:border-amber-500/20">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Biblical Reference Badge if any */}
                  {post.biblicalReference && (
                    <div className="mb-2">
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                        Passage : {post.biblicalReference}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-3 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors leading-snug">
                    {post.title}
                  </h3>

                  {/* Snippet */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans mb-6">
                    {post.snippet}
                  </p>
                </div>

                {/* Card Footer: Author, Like & Read Button */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    <span>Par <strong className="text-slate-700 dark:text-slate-300">{post.author}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLikeClick(post.id)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        hasLiked
                          ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30'
                          : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-rose-600 border border-slate-200 dark:border-slate-800'
                      }`}
                      title="Béni(e) par ce message"
                    >
                      <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                      <span>{post.likesCount}</span>
                    </button>

                    <button
                      onClick={() => setReadingPost(post)}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg shadow-2xs transition-colors flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Lire</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Empty state when search or filter returns no posts */}
        {filteredPosts.length === 0 && (
          <div className="py-12 text-center bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 mb-12">
            <p className="text-sm text-slate-500">Aucun article ne correspond à votre recherche.</p>
            <button
              onClick={() => {
                setSelectedCategory('Tous');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="mt-3 text-xs font-bold text-amber-700 dark:text-amber-400 underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Pagination Controls when articles exceed 6 */}
        {totalPosts > POSTS_PER_PAGE && (
          <div className="mt-4 mb-16 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Affichage de <span className="font-bold text-slate-900 dark:text-white">{startIndex + 1}</span> à{' '}
              <span className="font-bold text-slate-900 dark:text-white">{Math.min(startIndex + POSTS_PER_PAGE, totalPosts)}</span> sur{' '}
              <span className="font-bold text-amber-700 dark:text-amber-400">{totalPosts}</span> articles
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(safeCurrentPage - 1)}
                disabled={safeCurrentPage === 1}
                className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl transition-all border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs active:scale-95"
                aria-label="Page précédente"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Précédent</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 flex items-center justify-center text-xs font-bold rounded-xl transition-all ${
                    safeCurrentPage === pageNum
                      ? 'bg-amber-500 text-slate-950 shadow-xs ring-2 ring-amber-400/50'
                      : 'bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                  }`}
                  aria-current={safeCurrentPage === pageNum ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(safeCurrentPage + 1)}
                disabled={safeCurrentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl transition-all border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs active:scale-95"
                aria-label="Page suivante"
              >
                <span className="hidden sm:inline">Suivant</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Newsletter Subscription Card */}
        <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-center shadow-sm">
          <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-2">
            Recevez nos prochains partages par email
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
            Inscrivez votre adresse pour être notifié de chaque nouvelle méditation biblique et témoignage publié.
          </p>

          {subscribed ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 rounded-xl text-center flex items-center justify-center gap-2 text-emerald-800 dark:text-emerald-400 text-xs font-bold">
              <Check className="w-4 h-4" />
              <span>Merci ! Vous recevrez nos nouveaux partages d'édification.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Votre adresse email..."
                className="w-full sm:flex-1 px-4 py-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>S'inscrire</span>
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Full Article Reader Modal */}
      {readingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-amber-500/40 rounded-2xl sm:rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setReadingPost(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg"
              aria-label="Fermer la lecture"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-300 dark:border-amber-500/20">
                {readingPost.category}
              </span>
              <span className="text-xs text-slate-500">· {readingPost.readTime} de lecture</span>
              {readingPost.biblicalReference && (
                <span className="text-xs text-amber-700 dark:text-amber-300 font-bold ml-1">
                  · {readingPost.biblicalReference}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white mb-4 leading-snug">
              {readingPost.title}
            </h2>

            <div className="flex items-center gap-4 text-xs text-slate-500 pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
              <span>Par <strong className="text-slate-700 dark:text-slate-300">{readingPost.author}</strong></span>
              <span>Publié le {readingPost.date}</span>
            </div>

            <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans space-y-4 whitespace-pre-line">
              {readingPost.content}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleLikeClick(readingPost.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  likedPosts[readingPost.id]
                    ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-rose-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${likedPosts[readingPost.id] ? 'fill-rose-600 text-rose-600' : ''}`} />
                <span>Béni(e) par ce message ({readingPost.likesCount})</span>
              </button>

              <button
                onClick={() => setReadingPost(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors"
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
