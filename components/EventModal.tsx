
import React, { useState, useEffect } from 'react';
import { TFIEvent, EventCategory, OTTProvider, ReminderType } from '../types';
import TicketingModal from './TicketingModal';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: TFIEvent) => void;
  onDelete: (id: string) => void;
  event?: TFIEvent | null; // If present, we are editing
  selectedDate?: Date | null; // If adding, this is the default date
}

// Group categories for better UX
const CATEGORY_GROUPS = {
    "Releases": [EventCategory.RELEASE, EventCategory.OTT_RELEASE, EventCategory.RE_RELEASE, EventCategory.TEASER, EventCategory.TRAILER, EventCategory.TITLE_REVEAL, EventCategory.FIRST_LOOK],
    "Promotions": [EventCategory.AUDIO_LAUNCH, EventCategory.PRE_RELEASE, EventCategory.SUCCESS_MEET, EventCategory.AWARD, EventCategory.MEETUP, EventCategory.FESTIVAL],
    "Production": [EventCategory.MOVIE_ANNOUNCEMENT, EventCategory.SHOOTING_UPDATE, EventCategory.WRAP_UP, EventCategory.CENSOR, EventCategory.BOX_OFFICE],
    "Stars": [EventCategory.BIRTHDAY, EventCategory.ANNIVERSARY, EventCategory.DEATH_ANNIVERSARY, EventCategory.RUMOR],
    "Other": [EventCategory.OTHER]
};

const OTT_PROVIDERS: { id: OTTProvider, name: string, color: string }[] = [
    { id: 'NETFLIX', name: 'Netflix', color: 'bg-red-600' },
    { id: 'PRIME', name: 'Prime Video', color: 'bg-blue-500' },
    { id: 'AHA', name: 'Aha', color: 'bg-orange-500' },
    { id: 'HOTSTAR', name: 'Disney+ Hotstar', color: 'bg-blue-800' },
    { id: 'ZEE5', name: 'Zee5', color: 'bg-purple-600' },
    { id: 'SONYLIV', name: 'SonyLIV', color: 'bg-indigo-500' },
    { id: 'ETV_WIN', name: 'ETV Win', color: 'bg-red-500' },
];

const EventModal: React.FC<EventModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  event, 
  selectedDate 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isTicketingOpen, setIsTicketingOpen] = useState(false);
  
  // Reminder State
  const [reminder, setReminder] = useState<ReminderType>('NONE');
  const [showToast, setShowToast] = useState(false);

  const [formData, setFormData] = useState<Partial<TFIEvent>>({
    title: '',
    category: EventCategory.OTHER,
    hero: '',
    description: '',
    link: '',
    rating: 0,
    location: '',
    ottProvider: undefined,
    production: '',
    runtime: ''
  });

  useEffect(() => {
    if (isOpen) {
        if (event) {
          setIsEditing(false); // Default to view mode for existing events
          setReminder(event.reminderType || 'NONE');
          setFormData({
            title: event.title,
            date: event.date,
            category: event.category,
            hero: event.hero || '',
            description: event.description || '',
            link: event.link || '',
            rating: event.rating || 0,
            location: event.location || '',
            ottProvider: event.ottProvider,
            production: event.production || '',
            runtime: event.runtime || ''
          });
        } else if (selectedDate) {
          setIsEditing(true); // Default to edit mode for new events
          setReminder('NONE');
          setFormData({
            title: '',
            date: selectedDate,
            category: EventCategory.OTHER,
            hero: '',
            description: '',
            link: '',
            rating: 0,
            location: '',
            ottProvider: undefined,
            production: '',
            runtime: ''
          });
        }
    }
  }, [event, selectedDate, isOpen]);

  const handleSetReminder = (type: ReminderType) => {
      setReminder(type);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      // In a real app, this would trigger a backend save or notification schedule
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;

    const newEvent: TFIEvent = {
      id: event?.id || Date.now().toString(),
      title: formData.title,
      date: typeof formData.date === 'string' ? new Date(formData.date) : formData.date,
      category: formData.category || EventCategory.OTHER,
      hero: formData.hero,
      description: formData.description,
      link: formData.link,
      imageUrl: event?.imageUrl, // Preserve if existing
      isOfficial: event?.isOfficial,
      timelineId: event?.timelineId || 'user',
      rating: formData.rating,
      location: formData.location,
      ottProvider: formData.ottProvider,
      reminderType: reminder,
      production: formData.production,
      runtime: formData.runtime,
      cast: event?.cast, // Preserve
      comments: event?.comments, // Preserve
      media: event?.media // Preserve
    };
    onSave(newEvent);
    onClose();
  };

  const formatDateForInput = (date?: Date) => {
    if (!date) return '';
    try {
      return date.toISOString().split('T')[0];
    } catch (e) {
      return '';
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateVal = e.target.valueAsDate;
    if (dateVal) {
      setFormData({ ...formData, date: dateVal });
    }
  };

  const getCategoryColor = (cat: EventCategory) => {
    switch (cat) {
      case EventCategory.RELEASE: return 'bg-red-600';
      case EventCategory.OTT_RELEASE: return 'bg-orange-600';
      case EventCategory.RE_RELEASE: return 'bg-orange-700';
      case EventCategory.AUDIO_LAUNCH: return 'bg-purple-600';
      case EventCategory.PRE_RELEASE: return 'bg-indigo-600';
      case EventCategory.SUCCESS_MEET: return 'bg-green-600';
      case EventCategory.BIRTHDAY: return 'bg-yellow-500';
      case EventCategory.ANNIVERSARY: return 'bg-yellow-600';
      case EventCategory.TEASER: return 'bg-blue-600';
      case EventCategory.TRAILER: return 'bg-red-700';
      case EventCategory.RUMOR: return 'bg-pink-600';
      case EventCategory.AWARD: return 'bg-amber-600';
      case EventCategory.CENSOR: return 'bg-teal-600';
      case EventCategory.BOX_OFFICE: return 'bg-emerald-600';
      case EventCategory.SHOOTING_UPDATE: return 'bg-slate-500';
      default: return 'bg-slate-600';
    }
  };

  const getCategoryIcon = (cat: EventCategory) => {
    if (cat === EventCategory.RELEASE) return 'movie';
    if (cat === EventCategory.BIRTHDAY || cat === EventCategory.ANNIVERSARY) return 'cake';
    if (cat === EventCategory.AUDIO_LAUNCH) return 'library_music';
    if (cat === EventCategory.RUMOR) return 'psychology';
    if (cat === EventCategory.AWARD) return 'emoji_events';
    if (cat === EventCategory.BOX_OFFICE) return 'currency_rupee';
    if (cat === EventCategory.CENSOR) return 'verified_user';
    if (cat.includes('RELEASE')) return 'local_movies';
    return 'event';
  };

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden relative">
        
        {/* Toast Notification */}
        {showToast && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg animate-fade-in flex items-center gap-2">
                <span className="material-icons-round text-sm">alarm_on</span>
                Reminder Set!
            </div>
        )}

        {/* View Mode Header (Poster Style) */}
        {!isEditing && event && (
            <div className={`h-40 ${getCategoryColor(event.category || EventCategory.OTHER)} relative`}>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                <div className="absolute bottom-4 left-6 right-6">
                    <div className="flex items-center justify-between mb-2">
                         <div className="flex items-center gap-2">
                             <span className="material-icons-round text-white/90 text-sm bg-black/30 px-2 py-0.5 rounded-full">
                                 {getCategoryIcon(event.category)}
                             </span>
                             <span className="text-white/80 text-xs font-bold tracking-wider uppercase">
                                 {event.category.replace(/_/g, ' ')}
                             </span>
                         </div>
                         {event.rating ? (
                             <div className="flex text-yellow-400 text-sm bg-black/40 px-2 rounded-full">
                                {Array.from({length: event.rating}).map((_, i) => <span key={i}>★</span>)}
                             </div>
                        ) : null}
                    </div>
                    <h2 className="text-3xl font-bold text-white leading-none shadow-black drop-shadow-lg">{event.title}</h2>
                    <div className="flex items-center gap-3 mt-1 text-sm text-white/80">
                        {event.hero && <div className="font-semibold text-yellow-400">Starring: {event.hero}</div>}
                        {event.runtime && <span>• {event.runtime}</span>}
                    </div>
                </div>
                <button onClick={onClose} className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 rounded-full p-1 text-white transition-colors">
                    <span className="material-icons-round">close</span>
                </button>
            </div>
        )}

        {/* Edit Mode Header */}
        {(isEditing || !event) && (
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <span className="material-icons-round text-yellow-500">
                    {event ? 'edit_calendar' : 'add_circle'}
                    </span>
                    {event ? 'Edit Event' : 'New TFI Event'}
                </h2>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                    <span className="material-icons-round">close</span>
                </button>
            </div>
        )}

        {/* View Mode Body */}
        {!isEditing && event && (
             <div className="p-6 overflow-y-auto space-y-6">
                 
                 {/* Metadata Grid */}
                 <div className="grid grid-cols-2 gap-4 text-sm">
                     <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                         <div className="text-xs text-slate-500 uppercase font-bold mb-1">Date</div>
                         <div className="flex items-center gap-2 text-slate-200 font-medium">
                             <span className="material-icons-round text-slate-500 text-sm">calendar_today</span>
                             {event.date.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                         </div>
                     </div>
                     <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Production</div>
                        <div className="flex items-center gap-2 text-slate-200 font-medium">
                             <span className="material-icons-round text-slate-500 text-sm">business</span>
                             <span className="truncate">{event.production || 'N/A'}</span>
                        </div>
                     </div>
                     {event.location && (
                         <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800 col-span-2">
                            <div className="text-xs text-slate-500 uppercase font-bold mb-1">Location / Venue</div>
                            <div className="flex items-center gap-2 text-slate-200 font-medium">
                                 <span className="material-icons-round text-slate-500 text-sm">location_on</span>
                                 <span className="truncate">{event.location}</span>
                            </div>
                         </div>
                     )}
                 </div>

                 {/* Cast & Crew */}
                 {event.cast && event.cast.length > 0 && (
                     <div>
                         <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cast & Crew</h4>
                         <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                             {event.cast.map((member, i) => (
                                 <div key={i} className="flex-shrink-0 text-center">
                                     <div className="w-12 h-12 rounded-full bg-slate-700 overflow-hidden mb-1 mx-auto border border-slate-600">
                                         {member.imageUrl ? (
                                             <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                                         ) : (
                                             <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                                                 <span className="material-icons-round text-lg">person</span>
                                             </div>
                                         )}
                                     </div>
                                     <div className="text-[10px] font-bold text-slate-200 w-16 truncate">{member.name}</div>
                                     <div className="text-[9px] text-slate-500 w-16 truncate">{member.role}</div>
                                 </div>
                             ))}
                         </div>
                     </div>
                 )}

                 {/* Description */}
                 {event.description && (
                     <div>
                         <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Synopsis</h4>
                         <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{event.description}</p>
                     </div>
                 )}

                 {/* Media Gallery (Simulated) */}
                 {event.media && event.media.length > 0 && (
                     <div>
                         <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Media ({event.media.length})</h4>
                         <div className="flex gap-3 overflow-x-auto pb-2">
                             {event.media.map((url, i) => (
                                 <div key={i} className="flex-shrink-0 w-32 aspect-video bg-slate-800 rounded-lg overflow-hidden border border-slate-700 relative group cursor-pointer">
                                     <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-colors">
                                         <span className="material-icons-round text-white drop-shadow-md">play_circle</span>
                                     </div>
                                     <img src={url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="Media" />
                                 </div>
                             ))}
                         </div>
                     </div>
                 )}
                 
                 {/* Quick Links */}
                 <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Links</h4>
                    <div className="flex flex-col gap-2">
                        {event.link && (
                             <button onClick={() => window.open(event.link, '_blank')} className="bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-lg font-bold flex items-center gap-3 transition-colors border border-slate-700">
                                <span className="material-icons-round text-red-500">play_arrow</span>
                                Watch Trailer / Video
                             </button>
                        )}
                        <button className="bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-lg font-bold flex items-center gap-3 transition-colors border border-slate-700">
                            <span className="material-icons-round text-pink-500">photo_camera</span>
                            Instagram Updates
                        </button>
                        {(event.category === EventCategory.RELEASE || event.category === EventCategory.RE_RELEASE) && (
                             <button onClick={() => setIsTicketingOpen(true)} className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-3 rounded-lg font-bold flex items-center gap-3 transition-colors shadow-lg">
                                <span className="material-icons-round">confirmation_number</span>
                                Book Tickets on BookMyShow
                             </button>
                        )}
                    </div>
                 </div>

                 {/* Reminders Section */}
                 <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span className="material-icons-round text-sm">notifications</span>
                        Remind Me
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { id: '1_DAY', label: '1 Day Before' },
                            { id: '1_HOUR', label: '1 Hour Before' },
                            { id: 'ON_START', label: 'On Event Start' },
                            { id: 'NONE', label: 'No Reminder' }
                        ].map(opt => (
                            <button
                                key={opt.id}
                                onClick={() => handleSetReminder(opt.id as ReminderType)}
                                className={`flex items-center justify-between p-3 rounded-lg text-xs font-bold transition-all border ${
                                    reminder === opt.id 
                                    ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50 shadow-sm' 
                                    : 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${reminder === opt.id ? 'border-yellow-500' : 'border-slate-500'}`}>
                                        {reminder === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>}
                                    </div>
                                    <span>{opt.label}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                 </div>

                 {/* Community Comments */}
                 {event.comments && event.comments.length > 0 && (
                     <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <span className="material-icons-round text-sm">forum</span>
                            Community ({event.comments.length})
                        </h4>
                        <div className="space-y-3">
                            {event.comments.map(comment => (
                                <div key={comment.id} className="bg-slate-800/30 p-3 rounded-lg border border-slate-800">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-5 h-5 rounded-full ${comment.avatarColor || 'bg-blue-500'} flex items-center justify-center text-[10px] text-white font-bold`}>
                                                {comment.username[0]}
                                            </div>
                                            <span className="text-xs font-bold text-slate-300">@{comment.username}</span>
                                        </div>
                                        <span className="text-[10px] text-slate-500">{comment.timestamp}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-snug">{comment.text}</p>
                                    <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-500">
                                        <span className="material-icons-round text-xs text-red-500/50">favorite</span>
                                        {comment.likes}
                                    </div>
                                </div>
                            ))}
                            <button className="w-full py-2 text-xs text-blue-400 hover:text-blue-300 font-bold">View All Comments</button>
                        </div>
                     </div>
                 )}

             </div>
        )}

        {/* Edit Mode Form Body */}
        {(isEditing || !event) && (
            <div className="p-6 overflow-y-auto space-y-4">
                {/* Title */}
                <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Event Title</label>
                    <input 
                        type="text" 
                        value={formData.title} 
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        placeholder="e.g. Game Changer Pre-Release Event"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                        autoFocus
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Date */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Date</label>
                        <input 
                            type="date" 
                            value={formatDateForInput(formData.date as Date)} 
                            onChange={handleDateChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:ring-2 focus:ring-yellow-500 focus:outline-none appearance-none"
                        />
                    </div>
                </div>

                {/* Category Grouped Selection */}
                <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                    <div className="space-y-3 h-40 overflow-y-auto border border-slate-800 rounded-lg p-2 bg-slate-800/30">
                        {Object.entries(CATEGORY_GROUPS).map(([group, cats]) => (
                            <div key={group} className="mb-2">
                                <div className="text-[10px] font-bold text-slate-500 uppercase px-1 mb-1">{group}</div>
                                <div className="flex flex-wrap gap-1">
                                    {cats.map(cat => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setFormData({...formData, category: cat})}
                                            className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                                                formData.category === cat 
                                                ? 'bg-yellow-500 text-black border-yellow-500 font-bold' 
                                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                                            }`}
                                        >
                                            {cat.replace(/_/g, ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* OTT Provider Selector (Conditional) */}
                {formData.category === EventCategory.OTT_RELEASE && (
                    <div className="animate-fade-in">
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Streaming Platform</label>
                        <div className="flex flex-wrap gap-2">
                            {OTT_PROVIDERS.map(p => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => setFormData({...formData, ottProvider: p.id})}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        formData.ottProvider === p.id 
                                        ? `${p.color} text-white shadow-lg` 
                                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
                                    }`}
                                >
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Hero / Artist */}
                <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Related Star / Movie</label>
                    <input 
                        type="text" 
                        value={formData.hero} 
                        onChange={e => setFormData({...formData, hero: e.target.value})}
                        placeholder="e.g. Ram Charan, Thaman S"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                    />
                </div>

                {/* Location */}
                <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Location / Venue</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            value={formData.location} 
                            onChange={e => setFormData({...formData, location: e.target.value})}
                            placeholder="e.g. Hyderabad, Shilpakala Vedika"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-slate-100 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                        />
                        <span className="material-icons-round absolute left-2.5 top-2.5 text-slate-500 text-sm">location_on</span>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Details / Notes</label>
                    <textarea 
                        value={formData.description} 
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        placeholder="Location, timings, or personal review..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:ring-2 focus:ring-yellow-500 focus:outline-none h-20 resize-none"
                    />
                </div>
            </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-800/50 flex justify-between items-center">
            
            {/* View Mode Actions */}
            {!isEditing && event && (
                <>
                    <button 
                         onClick={() => onDelete(event.id)}
                         className="flex items-center gap-2 text-slate-500 hover:text-red-400 transition-colors px-2 py-1"
                    >
                         <span className="material-icons-round text-lg">delete</span>
                    </button>
                    <div className="flex gap-3">
                        <button 
                            onClick={onClose}
                            className="px-4 py-2 text-slate-300 hover:text-white text-sm font-medium"
                        >
                            Close
                        </button>
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="bg-slate-700 hover:bg-slate-600 text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                        >
                            <span className="material-icons-round text-sm">edit</span>
                            Edit
                        </button>
                    </div>
                </>
            )}

            {/* Edit Mode Actions */}
            {(isEditing || !event) && (
                <>
                    {event ? (
                        <button 
                            onClick={() => setIsEditing(false)}
                            className="text-slate-400 hover:text-white text-sm"
                        >
                            Cancel
                        </button>
                    ) : <div />}

                    <div className="flex gap-3">
                         {!event && <button onClick={onClose} className="px-4 py-2 text-slate-300 hover:text-white text-sm">Cancel</button>}
                        <button 
                            onClick={handleSubmit}
                            className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-6 py-2 rounded-lg font-bold shadow-lg shadow-yellow-500/20 transition-all transform hover:scale-105"
                        >
                            {event ? 'Save Changes' : 'Add Event'}
                        </button>
                    </div>
                </>
            )}
        </div>
      </div>
    </div>
    
    <TicketingModal 
        isOpen={isTicketingOpen} 
        onClose={() => setIsTicketingOpen(false)} 
        event={event} 
    />
    </>
  );
};

export default EventModal;
