import React, { useState, useEffect } from 'react';
import { PrayerItem, getStoredPrayers, saveStoredPrayers, getStoredPrayedIds, saveStoredPrayedIds, DEFAULT_PRAYERS } from '../data/prayers';
import { HeartHandshake, PlusCircle, CheckCircle, Filter, AlertCircle, Heart, Send, Shield, X, Trash2, RefreshCw, Layers, Sparkles, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const PRAYERS_PER_PAGE = 6;

export const PrayerWallSection: React.FC = () => {
  const [prayers, setPrayers] = useState<PrayerItem[]>(() => getStoredPrayers());
  const [prayedIds, setPrayedIds] = useState<Record<string, boolean>>(() => getStoredPrayedIds());
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showFormModal, setShowFormModal] = useState<boolean>(false);

  // Admin dynamic test drawer toggle (like in EventsSection)
  const [showAdminQuickAdd, setShowAdminQuickAdd] = useState<boolean>(false);
  const [adminAuthor, setAdminAuthor] = useState('');
  const [adminCategory, setAdminCategory] = useState<PrayerItem['category']>('Santé');
  const [adminRequest, setAdminRequest] = useState('');
  const [adminLocation, setAdminLocation] = useState('');
  const [adminIsUrgent, setAdminIsUrgent] = useState(false);

  // Visitor form states
  const [authorName, setAuthorName] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<PrayerItem['category']>('Santé');
  const [requestText, setRequestText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState(false);

  // Sync state with local storage
  useEffect(() => {
    saveStoredPrayers(prayers);
  }, [prayers]);

  useEffect(() => {
    saveStoredPrayedIds(prayedIds);
  }, [prayedIds]);

  // Reactive listener for future Admin page updates or multi-tab sync
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'espoir_dynamic_prayers') {
        setPrayers(getStoredPrayers());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handlePrayClick = (id: string) => {
    if (prayedIds[id]) return;

    const updated = prayers.map((item) =>
      item.id === id ? { ...item, prayersCount: item.prayersCount + 1 } : item
    );
    setPrayers(updated);
    saveStoredPrayers(updated);

    const updatedPrayedIds = { ...prayedIds, [id]: true };
    setPrayedIds(updatedPrayedIds);
    saveStoredPrayedIds(updatedPrayedIds);
  };

  const handleAddPrayerSubmit = (e: React.FormEvent) => {
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

  const handleAdminCreatePrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminRequest.trim()) return;

    const created: PrayerItem = {
      id: `p-admin-${Date.now()}`,
      author: adminAuthor.trim() || 'Modérateur Espoir',
      location: adminLocation.trim() || undefined,
      category: adminCategory,
      request: adminRequest.trim(),
      date: "À l'instant",
      prayersCount: 1,
      isUrgent: adminIsUrgent,
    };

    const updated = [created, ...prayers];
    setPrayers(updated);
    saveStoredPrayers(updated);
    setCurrentPage(1);

    // Reset admin form
    setAdminAuthor('');
    setAdminRequest('');
    setAdminLocation('');
    setAdminIsUrgent(false);
    setShowAdminQuickAdd(false);
  };

  const handleDeletePrayer = (id: string) => {
    const updated = prayers.filter((p) => p.id !== id);
    setPrayers(updated);
    saveStoredPrayers(updated);
  };

  const handleResetPrayers = () => {
    setPrayers(DEFAULT_PRAYERS);
    saveStoredPrayers(DEFAULT_PRAYERS);
    setCurrentPage(1);
  };

  const categories = ['Tous', 'Santé', 'Paix & Famille', 'Emploi & Projets', 'Foi & Orientation', 'Action de Grâce'];

  const filteredPrayers = selectedCategory === 'Tous'
    ? prayers
    : prayers.filter((p) => p.category === selectedCategory);

  // Pagination logic: if prayers exceed 6, paginate max 6 per page
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
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-5 sm:gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 bg-amber-500/15 dark:bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                Chaîne d'Intercession
              </span>
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 flex items-center gap-1 shadow-2xs">
                <Layers className="w-3 h-3 text-amber-500" />
                Dynamique & Prêt pour Base de Données
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mt-1 tracking-tight">
              Le Mur de Prières
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Confiez vos fardeaux, vos requêtes et vos sujets d'action de grâce. La communauté prie fidèlement pour vous.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setShowFormModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 shrink-0 active:scale-95"
            >
              <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Déposer une Prière</span>
            </button>

            {/* Admin dynamic tester button (prepared for future admin page) */}
            <button
              onClick={() => setShowAdminQuickAdd(!showAdminQuickAdd)}
              className="px-3.5 py-2.5 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-850 text-amber-700 dark:text-amber-400 border border-amber-400/50 dark:border-amber-500/40 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 active:scale-95"
              title="Tester l'ajout ou la gestion dynamique des prières"
            >
              <Plus className="w-4 h-4" />
              <span>{showAdminQuickAdd ? 'Fermer le testeur' : '+ Tester Prière (Admin)'}</span>
            </button>

            <button
              onClick={handleResetPrayers}
              className="p-2.5 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 rounded-xl transition-colors shadow-xs"
              title="Réinitialiser la liste d'origine"
              aria-label="Réinitialiser la liste"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Prayer Creator (Admin Tester Tool prepared for future admin dashboard) */}
        {showAdminQuickAdd && (
          <div className="mb-10 p-5 sm:p-6 bg-white dark:bg-slate-950 border border-amber-400 dark:border-amber-500/40 rounded-2xl shadow-xl space-y-4 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                MODULE DE GESTION ADMINISTRATIVE (PRÉPARÉ POUR VOTRE FUTUR PANEL)
              </span>
              <span className="text-[11px] text-slate-500">Stockage dynamique en base locale</span>
            </div>

            <form onSubmit={handleAdminCreatePrayer} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Auteur / Demandeur</label>
                <input
                  type="text"
                  required
                  value={adminAuthor}
                  onChange={(e) => setAdminAuthor(e.target.value)}
                  placeholder="Ex: David M."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Catégorie</label>
                <select
                  value={adminCategory}
                  onChange={(e) => setAdminCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="Santé">Santé & Guérison</option>
                  <option value="Paix & Famille">Paix & Famille</option>
                  <option value="Emploi & Projets">Emploi & Projets</option>
                  <option value="Foi & Orientation">Foi & Orientation</option>
                  <option value="Action de Grâce">Action de Grâce</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Ville / Pays (Optionnel)</label>
                <input
                  type="text"
                  value={adminLocation}
                  onChange={(e) => setAdminLocation(e.target.value)}
                  placeholder="Ex: Marseille, France"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Texte de l'intention de prière</label>
                <textarea
                  required
                  rows={2}
                  value={adminRequest}
                  onChange={(e) => setAdminRequest(e.target.value)}
                  placeholder="Ex: Merci de prier pour la paix dans notre famille..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div className="sm:col-span-3 flex items-center justify-between gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-amber-700 dark:text-amber-400 font-semibold">
                  <input
                    type="checkbox"
                    checked={adminIsUrgent}
                    onChange={(e) => setAdminIsUrgent(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-800 text-amber-500 focus:ring-amber-500"
                  />
                  <span>Marquer comme intention urgente</span>
                </label>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter la prière dynamiquement</span>
                </button>
              </div>
            </form>
          </div>
        )}

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
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-500">{item.date}</span>
                      {/* Delete trigger for testing dynamic admin removal */}
                      <button
                        onClick={() => handleDeletePrayer(item.id)}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors ml-1"
                        title="Supprimer cette prière (Action Admin)"
                        aria-label="Supprimer cette prière"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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

        {/* Pagination Controls when requests exceed 6 (6 demandes max par page) */}
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
              Votre demande sera immédiatement enregistrée et publiée sur le mur de prière de notre communauté.
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
