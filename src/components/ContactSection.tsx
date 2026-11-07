import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

import { ContactMessage, getStoredContactMessages, saveStoredContactMessages } from '../data/contactMessages';
import { getSupabaseClient } from '../services/supabase';
import { saveServerMessages } from '../services/api';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [requestType, setRequestType] = useState('Demande de prière personnelle');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [requestCallback, setRequestCallback] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const [savedMessages, setSavedMessages] = useState<ContactMessage[]>(() => getStoredContactMessages());

  useEffect(() => {
    saveStoredContactMessages(savedMessages);
  }, [savedMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      requestType,
      subject: subject.trim() || undefined,
      message: message.trim(),
      requestCallback,
      date: new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'nouveau',
    };

    const updated = [newMsg, ...savedMessages];
    setSavedMessages(updated);
    saveStoredContactMessages(updated);
    setIsSubmitted(true);

    // Sync to Server API for cross-device real-time visibility in Admin
    await saveServerMessages(newMsg);

    // If Supabase is connected, persist remotely
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('contact_messages').insert([
          {
            id: newMsg.id,
            name: newMsg.name,
            email: newMsg.email,
            phone: newMsg.phone,
            request_type: newMsg.requestType,
            subject: newMsg.subject,
            message: newMsg.message,
            request_callback: newMsg.requestCallback,
            date: newMsg.date,
            status: 'nouveau',
          },
        ]);
      } catch (err) {
        console.warn('Could not sync contact message to Supabase:', err);
      }
    }

    setTimeout(() => {
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
      setRequestCallback(false);
    }, 1000);
  };

  const faqs = [
    {
      q: "Comment puis-je assister aux cultes pour la première fois ?",
      a: "Nos portes vous sont grandement ouvertes chaque dimanche à 10h00. Il n'y a pas d'inscription requise, venez tel que vous êtes ! Nos équipes vous accueilleront chaleureusement dès votre arrivée."
    },
    {
      q: "Mes demandes de prières sont-elles confidentielles ?",
      a: "Absolument. Si vous choisissez l'option de confidentialité, votre demande est transmise exclusivement à l'équipe restreinte d'intercession pastorale."
    },
    {
      q: "Proposez-vous un accompagnement spirituel personnalisé ?",
      a: "Oui, notre équipe est disponible pour des entretiens d'écoute et de prière fraternelle. Il suffit de cocher l'option dans le formulaire."
    },
    {
      q: "Comment rejoindre un groupe de maison ou d'étude biblique ?",
      a: "Indiquez simplement 'Inscription aux études bibliques' dans le formulaire ci-dessus, et un responsable prendra contact avec vous."
    }
  ];

  return (
    <section id="contact" className="py-16 sm:py-20 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-t border-slate-200 dark:border-slate-900 transition-colors duration-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 bg-amber-500/15 dark:bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
            Écoute & Accompagnement
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mt-3 tracking-tight">
            Formulaire de Contact
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Une question, un besoin d'entretien spirituel ou une intention particulière ? N'hésitez pas à nous écrire, nous serons honorés de vous lire.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
          
          {/* Detailed Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-10 shadow-lg dark:shadow-2xl relative transition-colors">
            <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-2">
              Envoyez-nous votre message
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-8">
              Remplissez les informations ci-dessous pour contacter l'équipe d'Espoir en Christ.
            </p>

            {isSubmitted ? (
              <div className="p-6 sm:p-8 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 rounded-2xl text-center space-y-4 my-6">
                <CheckCircle className="w-12 sm:w-14 h-12 sm:h-14 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="text-xl font-serif font-bold text-emerald-800 dark:text-emerald-300">
                  Message Transmis avec Succès !
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  Merci de nous avoir contactés. Votre message a bien été pris en compte et un membre de notre équipe vous répondra très rapidement avec attention et prière.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-2 px-4 py-2 bg-white dark:bg-slate-950 text-amber-700 dark:text-amber-400 border border-amber-400/40 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors shadow-2xs"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                
                {/* Name & Email split */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Nom et Prénom <span className="text-amber-600 dark:text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Jean-Baptiste Emmanuel"
                      className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Adresse Email <span className="text-amber-600 dark:text-amber-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre.email@exemple.com"
                      className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 shadow-2xs"
                    />
                  </div>
                </div>

                {/* Phone & Request Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Téléphone (Optionnel)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+33 6 12 34 56 78"
                      className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Objet de la Demande
                    </label>
                    <select
                      value={requestType}
                      onChange={(e) => setRequestType(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 shadow-2xs"
                    >
                      <option value="Demande de prière personnelle">Demande de prière personnelle</option>
                      <option value="Conseil spirituel / Accompagnement">Conseil spirituel & Entretien</option>
                      <option value="Témoignage à partager">Témoignage à partager</option>
                      <option value="Inscription aux études bibliques">Inscription étude biblique</option>
                      <option value="Question générale / Contact pastoral">Question générale</option>
                      <option value="Bénévolat / Soutien au ministère">Bénévolat & Soutien</option>
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Sujet de votre message
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Résumez en quelques mots le motif de votre contact..."
                    className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 shadow-2xs"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Message détaillé <span className="text-amber-600 dark:text-amber-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Rédigez votre message ici. Nous lisons chaque demande avec la plus grande bienveillance..."
                    className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 resize-none shadow-2xs"
                  />
                </div>

                {/* Checkbox callback */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="callback"
                    checked={requestCallback}
                    onChange={(e) => setRequestCallback(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-800 text-amber-500 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="callback" className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                    Souhaitez-vous être recontacté pour un échange pastoral ?
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 transform active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer mon Message</span>
                </button>
              </form>
            )}

            {/* Sent messages feedback log */}
            {savedMessages.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-3">
                  Vos Derniers Messages Envoyés ({savedMessages.length})
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {savedMessages.slice(0, 3).map((msg) => (
                    <div key={msg.id} className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs shadow-2xs">
                      <div className="flex justify-between text-slate-500 text-[11px] mb-1">
                        <span className="font-bold text-amber-700 dark:text-amber-300">{msg.requestType}</span>
                        <span>{msg.date}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 truncate font-sans">"{msg.message}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: FAQ & Spiritual Encouragement (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-gradient-to-br from-amber-50 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/40 border border-amber-300 dark:border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-xl transition-colors">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block mb-2">
                Soutien & Prière
              </span>
              <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-3">
                Nous sommes à votre écoute
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 font-sans">
                Chaque message reçu est traité dans la confidentialité et l'intercession. N'hésitez pas à nous confier vos intentions de prière et vos interrogations.
              </p>
              <div className="p-4 bg-white/90 dark:bg-slate-950/80 border border-amber-300/80 dark:border-amber-500/30 rounded-xl shadow-xs">
                <p className="text-xs sm:text-sm font-serif italic text-amber-900 dark:text-amber-200 leading-relaxed">
                  « Ne crains rien, car je suis avec toi; Ne promène pas des regards inquiets, car je suis ton Dieu; Je te fortifie, je viens à ton secours. » — Ésaïe 41:10
                </p>
              </div>
            </div>

            {/* Accordion FAQ */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-xl transition-colors">
              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                Questions Fréquentes
              </h3>

              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-950 shadow-2xs transition-colors"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full px-4 py-3 text-left text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-300 flex items-center justify-between transition-colors gap-2"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-amber-500' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-900 pt-2 font-sans">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
