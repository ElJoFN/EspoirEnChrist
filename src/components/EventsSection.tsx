import React, { useState, useEffect } from 'react';
import { MinistryEvent, getStoredEvents, saveStoredEvents, DEFAULT_EVENTS } from '../data/events';
import { Calendar, Clock, MapPin, Video, Download, Check, Sparkles, User, ExternalLink, Plus, Trash2, RefreshCw, Layers } from 'lucide-react';

export const EventsSection: React.FC = () => {
  const [events, setEvents] = useState<MinistryEvent[]>(() => getStoredEvents());
  const [downloadedEvtId, setDownloadedEvtId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  
  // Admin preparation quick-add drawer toggle
  const [showAdminQuickAdd, setShowAdminQuickAdd] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<MinistryEvent['category']>('Culte');
  const [newDateStr, setNewDateStr] = useState('');
  const [newTimeStr, setNewTimeStr] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Sync state with local storage & listen for external admin updates
  useEffect(() => {
    saveStoredEvents(events);
  }, [events]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'espoir_dynamic_events') {
        setEvents(getStoredEvents());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleDownloadICS = (evt: MinistryEvent) => {
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Espoir en Christ//NONSGML Event//FR
BEGIN:VEVENT
SUMMARY:${evt.title}
DESCRIPTION:${evt.description} - Intervenant: ${evt.speaker || 'Espoir en Christ'}
LOCATION:${evt.location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${evt.id}-espoir-en-christ.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadedEvtId(evt.id);
    setTimeout(() => setDownloadedEvtId(null), 3000);
  };

  const getGoogleCalendarUrl = (evt: MinistryEvent) => {
    const title = encodeURIComponent(evt.title);
    const details = encodeURIComponent(`${evt.description}\nIntervenant: ${evt.speaker || 'Espoir en Christ'}`);
    const location = encodeURIComponent(evt.location);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: MinistryEvent = {
      id: `evt-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      dateStr: newDateStr.trim() || 'Date à venir',
      timeStr: newTimeStr.trim() || '10:00 - 12:00',
      location: newLocation.trim() || 'Centre Espoir en Christ',
      description: newDescription.trim() || 'Rencontre et célébration d\'Espoir en Christ.',
      isOnlineAvailable: true,
      speaker: 'Équipe Espoir',
    };

    const updated = [created, ...events];
    setEvents(updated);
    saveStoredEvents(updated);

    // Reset inputs
    setNewTitle('');
    setNewDateStr('');
    setNewTimeStr('');
    setNewLocation('');
    setNewDescription('');
    setShowAdminQuickAdd(false);
  };

  const handleDeleteEvent = (id: string) => {
    const updated = events.filter((e) => e.id !== id);
    setEvents(updated);
    saveStoredEvents(updated);
  };

  const handleResetEvents = () => {
    setEvents(DEFAULT_EVENTS);
    saveStoredEvents(DEFAULT_EVENTS);
  };

  const categories = ['Tous', 'Culte', 'Étude Biblique', 'Louange', 'Jeunesse', 'Prière'];

  const filteredEvents = selectedCategory === 'Tous'
    ? events
    : events.filter((e) => e.category === selectedCategory);

  return (
    <section id="evenements" className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors duration-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-5 sm:gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 bg-amber-500/15 dark:bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                Agenda Dynamique
              </span>
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 flex items-center gap-1 shadow-2xs">
                <Layers className="w-3 h-3 text-amber-500" />
                Prêt pour Gestion Admin
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mt-3 tracking-tight">
              Cultes & Événements à Venir
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl">
              Retrouvez l'agenda mis à jour en temps réel des cultes, temps d'intercession et rassemblements d'Espoir en Christ.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdminQuickAdd(!showAdminQuickAdd)}
              className="px-4 py-2.5 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-850 text-amber-700 dark:text-amber-400 border border-amber-400/50 dark:border-amber-500/40 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{showAdminQuickAdd ? 'Fermer le testeur' : '+ Tester un Événement (Admin)'}</span>
            </button>
            <button
              onClick={handleResetEvents}
              className="p-2.5 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 rounded-xl transition-colors shadow-xs"
              title="Réinitialiser la liste d'origine"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Event Creator (Admin Tester Tool) */}
        {showAdminQuickAdd && (
          <div className="mb-10 p-5 sm:p-6 bg-white dark:bg-slate-950 border border-amber-400 dark:border-amber-500/40 rounded-2xl shadow-xl space-y-4 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                MODULE DE GESTION ADMINISTRATIVE (PRÉPARÉ POUR VOTRE FUTUR PANEL)
              </span>
              <span className="text-[11px] text-slate-500">Stockage dynamique immédiat</span>
            </div>

            <form onSubmit={handleCreateEvent} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Titre du Culte / Événement</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Culte d'Action de Grâce"
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
                  <option value="Culte">Culte</option>
                  <option value="Étude Biblique">Étude Biblique</option>
                  <option value="Louange">Louange</option>
                  <option value="Jeunesse">Jeunesse</option>
                  <option value="Prière">Prière</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Date & Fréquence</label>
                <input
                  type="text"
                  value={newDateStr}
                  onChange={(e) => setNewDateStr(e.target.value)}
                  placeholder="Ex: Dimanche prochain 10h"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Heure</label>
                <input
                  type="text"
                  value={newTimeStr}
                  onChange={(e) => setNewTimeStr(e.target.value)}
                  placeholder="Ex: 10:00 - 12:00"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Lieu</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Ex: Salle Espoir & Zoom"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Description courte</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Ex: Enseignement et partage de foi..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="sm:col-span-3 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter l'événement dynamiquement</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex items-center gap-2 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-2 shrink-0">Filtrer par :</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/40 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 shadow-sm dark:shadow-md group relative"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-500/20">
                    {evt.category}
                  </span>
                  <div className="flex items-center gap-2">
                    {evt.isOnlineAvailable && (
                      <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1">
                        <Video className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        En ligne
                      </span>
                    )}
                    {/* Admin Delete trigger */}
                    <button
                      onClick={() => handleDeleteEvent(evt.id)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                      title="Supprimer cet événement (Action Admin)"
                      aria-label="Supprimer cet événement"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                  {evt.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-sans">
                  {evt.description}
                </p>

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 mb-6 border-t border-slate-100 dark:border-slate-900 pt-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{evt.dateStr}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>{evt.timeStr}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>{evt.location}</span>
                  </div>
                  {evt.speaker && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>{evt.speaker}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Add to calendar actions */}
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-900">
                <button
                  onClick={() => handleDownloadICS(evt)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 transition-colors"
                >
                  {downloadedEvtId === evt.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Download className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  )}
                  <span>{downloadedEvtId === evt.id ? 'Ajouté !' : 'Fichier .ICS'}</span>
                </button>

                <a
                  href={getGoogleCalendarUrl(evt)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Google Agenda</span>
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
