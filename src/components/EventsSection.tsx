import React, { useState, useEffect } from 'react';
import { MinistryEvent, getStoredEvents, saveStoredEvents } from '../data/events';
import { getSupabaseClient } from '../services/supabase';
import { fetchServerEvents, registerDataSyncListener } from '../services/api';
import { Calendar, Clock, MapPin, Video, Download, Check, User, ExternalLink } from 'lucide-react';

export const EventsSection: React.FC = () => {
  const [events, setEvents] = useState<MinistryEvent[]>(() => getStoredEvents());
  const [downloadedEvtId, setDownloadedEvtId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');

  // Load and synchronize events with Server API, Supabase & localStorage
  useEffect(() => {
    const loadEvents = async () => {
      // 1. Fetch from real-time full-stack server API
      const serverEvts = await fetchServerEvents();
      if (Array.isArray(serverEvts)) {
        setEvents((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(serverEvts)) {
            saveStoredEvents(serverEvts, false);
            return serverEvts;
          }
          return prev;
        });
      }

      // 2. If Supabase is connected, fetch live events
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && Array.isArray(data)) {
            const mapped: MinistryEvent[] = data.map((d: any) => ({
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
            setEvents((prev) => {
              if (JSON.stringify(prev) !== JSON.stringify(mapped)) {
                saveStoredEvents(mapped, false);
                return mapped;
              }
              return prev;
            });
          }
        } catch (e) {
          console.warn('Supabase fetch events error:', e);
        }
      }
    };

    loadEvents();

    // Poll server API every 4s for instant cross-device real-time sync
    const interval = setInterval(loadEvents, 4000);

    // Register robust cross-tab & cross-component listener
    const unregister = registerDataSyncListener('events', loadEvents);

    return () => {
      clearInterval(interval);
      unregister();
    };
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

  const categories = ['Tous', 'Culte', 'Étude Biblique', 'Louange', 'Jeunesse', 'Prière'];

  const filteredEvents = selectedCategory === 'Tous'
    ? events
    : events.filter((e) => e.category === selectedCategory);

  return (
    <section id="evenements" className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors duration-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Clean Header without debug/tester labels */}
        <div className="mb-10 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 bg-amber-500/15 dark:bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
            Agenda & Rencontres
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mt-3 tracking-tight">
            Cultes & Événements à Venir
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Retrouvez l'agenda mis à jour de nos cultes dominicaux, temps d'intercession communautaire et rassemblements d'édification.
          </p>
        </div>

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

        {/* Empty state if no events */}
        {filteredEvents.length === 0 && (
          <div className="py-12 text-center bg-white dark:bg-slate-950/60 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
            <Calendar className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-sm text-slate-500">Aucun événement programmé dans cette catégorie pour le moment.</p>
          </div>
        )}

        {/* Events Grid (Clean Visitor Interface) */}
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
                  {evt.isOnlineAvailable && (
                    <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1">
                      <Video className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      En direct disponible
                    </span>
                  )}
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
