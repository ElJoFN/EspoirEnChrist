import React, { useState, useEffect } from 'react';
import { BlogPost, getStoredBlogPosts, saveStoredBlogPosts, DEFAULT_BLOG_POSTS } from '../data/blogPosts';
import { Newspaper, Sparkles, BookOpen, Heart, ArrowLeft, Send, Check, Search, Filter, Plus, Trash2, RefreshCw, Layers, Clock, User, X, Share2, Quote } from 'lucide-react';

interface BlogPageProps {
  onBackToHome: () => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onBackToHome }) => {
  const [posts, setPosts] = useState<BlogPost[]>(() => getStoredBlogPosts());
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('espoir_liked_posts');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Admin testing drawer state
  const [showAdminAdd, setShowAdminAdd] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<BlogPost['category']>('Méditation');
  const [newAuthor, setNewAuthor] = useState('');
  const [newBiblicalRef, setNewBiblicalRef] = useState('');
  const [newReadTime, setNewReadTime] = useState('5 min');
  const [newSnippet, setNewSnippet] = useState('');
  const [newContent, setNewContent] = useState('');

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Sync with local storage
  useEffect(() => {
    saveStoredBlogPosts(posts);
  }, [posts]);

  useEffect(() => {
    try {
      localStorage.setItem('espoir_liked_posts', JSON.stringify(likedPosts));
    } catch (e) {}
  }, [likedPosts]);

  // Reactive listener for future Admin page updates or multi-tab sync
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'espoir_dynamic_blog_posts') {
        setPosts(getStoredBlogPosts());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLikeClick = (id: string) => {
    if (likedPosts[id]) return;

    const updated = posts.map((p) =>
      p.id === id ? { ...p, likesCount: p.likesCount + 1 } : p
    );
    setPosts(updated);
    saveStoredBlogPosts(updated);
    setLikedPosts((prev) => ({ ...prev, [id]: true }));
  };

  const handleAdminCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSnippet.trim()) return;

    const created: BlogPost = {
      id: `post-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      author: newAuthor.trim() || 'Équipe Espoir en Christ',
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      readTime: newReadTime.trim() || '5 min',
      biblicalReference: newBiblicalRef.trim() || undefined,
      snippet: newSnippet.trim(),
      content: newContent.trim() || newSnippet.trim(),
      likesCount: 1,
      featured: false,
    };

    const updated = [created, ...posts];
    setPosts(updated);
    saveStoredBlogPosts(updated);

    // Reset admin form
    setNewTitle('');
    setNewAuthor('');
    setNewBiblicalRef('');
    setNewSnippet('');
    setNewContent('');
    setShowAdminAdd(false);
  };

  const handleDeletePost = (id: string) => {
    const updated = posts.filter((p) => p.id !== id);
    setPosts(updated);
    saveStoredBlogPosts(updated);
  };

  const handleResetPosts = () => {
    setPosts(DEFAULT_BLOG_POSTS);
    saveStoredBlogPosts(DEFAULT_BLOG_POSTS);
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

  return (
    <div className="py-12 sm:py-16 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-[85vh] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-400 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'Accueil</span>
          </button>

          {/* Admin Testing Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdminAdd(!showAdminAdd)}
              className="px-3.5 py-2 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-850 text-amber-700 dark:text-amber-400 border border-amber-400/50 dark:border-amber-500/40 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 active:scale-95"
              title="Tester la rédaction d'un article pour l'admin"
            >
              <Plus className="w-4 h-4" />
              <span>{showAdminAdd ? 'Fermer le testeur' : '+ Rédiger Article (Admin)'}</span>
            </button>
            <button
              onClick={handleResetPosts}
              className="p-2 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 rounded-xl transition-colors shadow-xs"
              title="Réinitialiser les articles par défaut"
              aria-label="Réinitialiser les articles"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Header */}
        <div className="bg-gradient-to-br from-amber-50 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/40 border border-amber-300 dark:border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-md dark:shadow-xl relative overflow-hidden mb-12 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 bg-amber-500/15 dark:bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
              Blog & Partages
            </span>
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 flex items-center gap-1 shadow-2xs">
              <Layers className="w-3 h-3 text-amber-500" />
              Dynamique & Prêt pour Base de Données
            </span>
          </div>

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

        {/* Dynamic Admin Article Creator Drawer */}
        {showAdminAdd && (
          <div className="mb-10 p-5 sm:p-6 bg-white dark:bg-slate-950 border border-amber-400 dark:border-amber-500/40 rounded-2xl shadow-xl space-y-4 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                MODULE D'ÉDITION D'ARTICLE (PRÉPARÉ POUR VOTRE FUTUR PANEL ADMIN)
              </span>
              <span className="text-[11px] text-slate-500">Stockage dynamique immédiat</span>
            </div>

            <form onSubmit={handleAdminCreatePost} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Titre de l'Article</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: La puissance du pardon selon l'Évangile"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Catégorie</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="Méditation">Méditation</option>
                  <option value="Enseignement">Enseignement</option>
                  <option value="Témoignage">Témoignage</option>
                  <option value="Vie Chrétienne">Vie Chrétienne</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Auteur</label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="Ex: Pasteur David"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Passage Biblique Clé</label>
                <input
                  type="text"
                  value={newBiblicalRef}
                  onChange={(e) => setNewBiblicalRef(e.target.value)}
                  placeholder="Ex: Éphésiens 4:32"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Temps de lecture</label>
                <input
                  type="text"
                  value={newReadTime}
                  onChange={(e) => setNewReadTime(e.target.value)}
                  placeholder="Ex: 5 min"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Résumé d'introduction</label>
                <textarea
                  required
                  rows={2}
                  value={newSnippet}
                  onChange={(e) => setNewSnippet(e.target.value)}
                  placeholder="Une courte introduction pour attirer l'attention du lecteur..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Contenu complet de l'article</label>
                <textarea
                  rows={5}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Développez l'enseignement biblique ou le témoignage complet..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white resize-none font-sans"
                />
              </div>

              <div className="sm:col-span-3 pt-1">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publier l'article dynamiquement</span>
                </button>
              </div>
            </form>
          </div>
        )}

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
                onClick={() => setSelectedCategory(cat)}
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
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un article..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>

        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredPosts.map((post) => {
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
                      {/* Admin delete trigger */}
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors ml-1"
                        title="Supprimer cet article (Action Admin)"
                        aria-label="Supprimer cet article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
