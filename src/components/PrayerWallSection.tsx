import React, { useState, useEffect } from 'react';
import { PrayerItem, getStoredPrayers, saveStoredPrayers, getStoredPrayedIds, saveStoredPrayedIds, mergePrayers } from '../data/prayers';
import { getSupabaseClient } from '../services/supabase';
import { HeartHandshake, PlusCircle, CheckCircle, Filter, AlertCircle, Heart, Send, Shield, X, ChevronLeft, ChevronRight } from 'lucide-react';

const PRAYERS_PER_PAGE = 6;

export const PrayerWallSection: React.FC = () => {
  const [prayers, setPrayers] = useState<PrayerItem[]>(() => getStoredPrayers());
  const [prayedIds, setPrayedIds] = useState<Record<string, boolean>>(() => getStoredPrayedIds());
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showFormModal, setShowFormModal] = useState<boolean>(false);

  // Visitor form states
  const [authorName, setAuthorName] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<PrayerItem['category']>('Santé');
  const [requestText, setRequestText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState(false);

  // Load prayers and sync with Supabase & local storage
  useEffect(() => {
    const loadPrayers = async () => {
      // 1. Immediately sync with local storage
      const local = getStoredPrayers();
      setPrayers(local);

      // 2. If Supabase is connected, fetch live prayers
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('prayers')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && Array.isArray(data)) {
            const mapped: PrayerItem[] = data.map((d: any) => ({
              id: d.id,
              author: d.author,
              location: d.location || undefined,
              category: d.category,
              request: d.request,
              date: d.date,
              prayersCount: d.prayers_count || 1,
              isUrgent: Boolean(d.is_urgent),
            }));
            const currentLocal = getStoredPrayers();
            const merged = mergePrayers(mapped, currentLocal);
            setPrayers(merged);
            saveStoredPrayers(merged);
          }
        } catch (e) {
          console.warn('Supabase fetch prayers error:', e);
        }
      }
    };

    loadPrayers();

    // Listen for updates from Admin page or another tab
    const handleDataUpdate = (e: any) => {
      if (!e.detail || e.detail.type === 'prayers') {
        setPrayers(getStoredPrayers());
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'espoir_dynamic_prayers') {
        setPrayers(getStoredPrayers());
      }
    };

    window.addEventListener('espoir_data_updated', handleDataUpdate);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('espoir_data_updated', handleDataUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    saveStoredPrayedIds(prayedIds);
  }, [prayedIds]);

  const handlePrayClick = async (id: string) => {
    if (prayedIds[id]) return;

    const targetPrayer = prayers.find((item) => item.id === id);
    const newCount = targetPrayer ? targetPrayer.prayersCount + 1 : 1;

    const updated = prayers.map((item) =>
      item.id === id ? { ...item, prayersCount: newCount } : item
    );
    setPrayers(updated);
    saveStoredPrayers(updated);

    const updatedPrayedIds = { ...prayedIds, [id]: true };
    setPrayedIds(updatedPrayedIds);
    saveStoredPrayedIds(updatedPrayedIds);

    // Sync to Supabase in background
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase
          .from('prayers')
          .update({ prayers_count: newCount })
          .eq('id', id);
      } catch (err) {}
    }
  };

  const handleAddPrayerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestText.trim()) return;

    const newPrayer: PrayerItem = {
      id: `p-user-${Date.now()}`,
      author: isAnonymous ? 'Demandeur Anonyme' : (authorName.trim() || 'Visiteur Espoir'),
      location: location.trim() || undefined,
      category: category,
      request: requestText.trim(),
      date: "À l'instant",
      prayersCount: 1,
      isUrgent: isUrgent,
    };

    const updated = [newPrayer, ...prayers];
    setPrayers(updated);
    saveStoredPrayers(updated);
    setCurrentPage(1);
    setSubmittedMessage(true);

    // Sync to Supabase
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('prayers').insert([
          {
            id: newPrayer.id,
            author: newPrayer.author,
            location: newPrayer.location || null,
            category: newPrayer.category,
            request: newPrayer.request,
            date: newPrayer.date,
            prayers_count: 1,
            is_urgent: newPrayer.isUrgent || false,
            is_approved: true,
          },
        ]);
      } catch (err) {
        console.warn('Could not insert prayer into Supabase:', err);
      }
    }

    setTimeout(() => {
      setSubmittedMessage(false);
      setShowFormModal(false);
      setAuthorName('');
      setLocation('');
      setRequestText('');
      setIsAnonymous(false);
      setIsUrgent(false);
    }, 1800);
  };

  const categories = ['Tous', 'Santé', 'Paix & Famille', 'Emploi & Projets', 'Foi & Orientation', 'Action de Grâce'];

  const filteredPrayers = selectedCategory === 'Tous'
    ? prayers
    : prayers.filter((p) => p.category === selectedCategory);

  // Pagination logic: max 6 prayers per page
  const totalPrayers = filteredPrayers.length;
  const totalPages = Math.ceil(totalPrayers / PRAYERS_PER_PAGE) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * PRAYERS_PER_PAGE;
  const paginatedPrayers = filteredPrayers.slice(startIndex, startIndex + PRAYERS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const element = document.getElementById('prieres');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="prieres" className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors duration-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Clean Header without debug/tester elements */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-5 sm:gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 bg-amber-500/15 dark:bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
              Chaîne d'Intercession
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mt-2 tracking-tight">
              Le Mur de Prières
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Confiez vos fardeaux, vos requêtes et vos sujets d'action de grâce. La communauté prie fidèlement pour vous.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setShowFormModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 shrink-0 active:scale-95"
            >
              <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Déposer une Prière</span>
            </button>
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-2 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-amber-500" />
            Catégorie :
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
                  : 'bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Prayer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {paginatedPrayers.map((item) => {
            const hasPrayed = prayedIds[item.id];
            return (
              <div
                key={item.id}
                className={`bg-white dark:bg-slate-950/80 border rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-sm dark:shadow-md ${
                  item.isUrgent
                    ? 'border-amber-400 dark:border-amber-500/50 shadow-md shadow-amber-500/5'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Category & Date Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-slate-900 border border-amber-200 dark:border-slate-800 px-2.5 py-0.5 rounded-md">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-slate-500">{item.date}</span>
                  </div>

                  {/* Urgent indicator */}
                  {item.isUrgent && (
                    <div className="flex items-center gap-1.5 mb-3 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-300 dark:border-amber-500/20">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Intention Urgente</span>
                    </div>
                  )}

                  {/* Request text */}
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-sans mb-5">
                    "{item.request}"
                  </p>
                </div>

                {/* Card Footer: Author & Pray Button */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.author}</p>
                    {item.location && (
                      <p className="text-[11px] text-slate-500">{item.location}</p>
                    )}
                  </div>

                  <button
                    onClick={() => handlePrayClick(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      hasPrayed
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30'
                        : 'bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-amber-800 dark:text-amber-300 border border-slate-200 dark:border-amber-500/30'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${hasPrayed ? 'fill-emerald-600 dark:fill-emerald-400 text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`} />
                    <span>{hasPrayed ? 'Prié !' : 'J\'ai prié'}</span>
                    <span className="ml-1 px-1.5 py-0.2 bg-white dark:bg-slate-800 rounded-full text-[10px] text-slate-700 dark:text-slate-300 font-mono">
                      {item.prayersCount}
                    </span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Empty state if category filter has 0 results */}
        {filteredPrayers.length === 0 && (
          <div className="py-12 text-center bg-white dark:bg-slate-950/60 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
            <p className="text-sm text-slate-500">Aucune intention de prière trouvée dans cette catégorie.</p>
            <button
              onClick={() => {
                setSelectedCategory('Tous');
                setCurrentPage(1);
              }}
              className="mt-3 text-xs font-bold text-amber-700 dark:text-amber-400 underline"
            >
              Voir toutes les prières
            </button>
          </div>
        )}

        {/* Pagination Controls when requests exceed 6 */}
        {totalPrayers > PRAYERS_PER_PAGE && (
          <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Affichage de <span className="font-bold text-slate-900 dark:text-white">{startIndex + 1}</span> à{' '}
              <span className="font-bold text-slate-900 dark:text-white">{Math.min(startIndex + PRAYERS_PER_PAGE, totalPrayers)}</span> sur{' '}
              <span className="font-bold text-amber-700 dark:text-amber-400">{totalPrayers}</span> demandes de prière
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

      </div>

      {/* Modal for Submitting a Prayer Request */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-amber-500/40 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowFormModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
              <HeartHandshake className="w-4 h-4" />
              <span>DÉPÔT D'INTENTION DE PRIÈRE</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-2">
              Confiez votre intention
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
              Votre demande sera enregistrée et publiée sur le mur de prière de notre communauté.
            </p>

            {submittedMessage ? (
              <div className="p-6 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 rounded-xl text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="text-lg font-serif font-bold text-emerald-800 dark:text-emerald-300">Intention Publiée avec Succès</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Que la paix de Dieu garde votre cœur. Nos frères et sœurs vont intercéder pour vous.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddPrayerSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Votre Nom ou Prénom
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Ex: Marie-Jeanne"
                    disabled={isAnonymous}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 disabled:opacity-50"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="anonymousCheck"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-800 text-amber-500 focus:ring-amber-500"
                  />
                  <label htmlFor="anonymousCheck" className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1 cursor-pointer">
                    <Shield className="w-3.5 h-3.5 text-amber-500" />
                    Garder ma demande anonyme
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Ville / Pays (Optionnel)
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Ex: Paris, France"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Catégorie
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Santé">Santé & Guérison</option>
                      <option value="Paix & Famille">Paix & Famille</option>
                      <option value="Emploi & Projets">Emploi & Projets</option>
                      <option value="Foi & Orientation">Foi & Orientation</option>
                      <option value="Action de Grâce">Action de Grâce</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Votre Requête de Prière <span className="text-amber-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={requestText}
                    onChange={(e) => setRequestText(e.target.value)}
                    placeholder="Exprimez clairement votre intention de prière afin que la communauté puisse prier avec vous..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="urgentCheck"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-800 text-amber-500 focus:ring-amber-500"
                  />
                  <label htmlFor="urgentCheck" className="text-xs text-amber-700 dark:text-amber-400 font-semibold cursor-pointer">
                    Marquer comme intention urgente
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Publier ma Prière</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
