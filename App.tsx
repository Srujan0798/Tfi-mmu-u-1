
import React, { useState, useMemo, useEffect } from 'react';
import CalendarView from './components/CalendarView';
import FloatingChat from './components/FloatingChat';
import EventModal from './components/EventModal';
import LiveHub from './components/LiveHub';
import MediaHub from './components/MediaHub';
import ProfileView from './components/ProfileView';
import Onboarding from './components/Onboarding';
import GamificationHub from './components/GamificationHub';
import DeveloperTools from './components/DeveloperTools';
import NotificationCenter from './components/NotificationCenter';
import GlobalSearch from './components/GlobalSearch';
import CreatorStudio from './components/CreatorStudio';
import CommunityHub from './components/CommunityHub';
import SubscriptionModal from './components/SubscriptionModal';
import InstallModal from './components/InstallModal';
import AILab from './components/AILab';
import { TFIEvent, EventCategory, CreatorTimeline, ViewMode, UserPreferences } from './types';

// Mock Creators / Timelines
const MOCK_TIMELINES: CreatorTimeline[] = [
    {
        id: 'official_channels',
        name: 'Official Channels',
        handle: 'Production Houses',
        description: 'Updates from Mythri, Hombale, Gemini TV, etc.',
        tags: ['Official', 'Industry'],
        followers: 2500000,
        color: 'border-blue-500',
        isOfficial: true,
        events: [
             { 
                 id: 'off1', 
                 title: 'Pushpa 2 Trailer', 
                 date: new Date('2024-11-15'), 
                 category: EventCategory.TEASER, 
                 hero: 'Allu Arjun', 
                 timelineId: 'official_channels', 
                 isOfficial: true, 
                 link: 'https://youtube.com',
                 runtime: '2m 34s',
                 production: 'Mythri Movie Makers',
                 media: ['https://img.youtube.com/vi/Q1NKMPhP8PY/maxresdefault.jpg'],
                 comments: [
                     { id: 'c1', username: 'BunnyVas_Fan', text: 'Mind blowing!! 🤯', timestamp: '2h ago', likes: 120, avatarColor: 'bg-red-500' },
                     { id: 'c2', username: 'TFI_Update', text: 'Records baddhalu ayipothayi 🔥', timestamp: '1h ago', likes: 85, avatarColor: 'bg-blue-500' }
                 ],
                 cast: [
                     { name: 'Allu Arjun', role: 'Actor', imageUrl: '' },
                     { name: 'Rashmika', role: 'Actress', imageUrl: '' },
                     { name: 'Sukumar', role: 'Director', imageUrl: '' },
                     { name: 'DSP', role: 'Music', imageUrl: '' }
                 ]
             },
             { id: 'off2', title: 'Devara Song Drop', date: new Date('2024-09-01'), category: EventCategory.RELEASE, hero: 'NTR', timelineId: 'official_channels', isOfficial: true },
             { id: 'off3', title: 'OG on Netflix', date: new Date('2024-12-25'), category: EventCategory.OTT_RELEASE, hero: 'Pawan Kalyan', timelineId: 'official_channels', isOfficial: true, ottProvider: 'NETFLIX' },
        ]
    },
    {
        id: 'prabhas_core',
        name: 'Prabhas Cults',
        handle: '@rebel_star_edits',
        description: 'Only for Rebel Star fans. Updates, birthdays, re-releases.',
        tags: ['Prabhas', 'Fan'],
        followers: 500000,
        color: 'border-red-500',
        events: [
            { id: 'p1', title: 'Salaar 2 Update (Rumor)', date: new Date('2024-09-15'), category: EventCategory.RUMOR, hero: 'Prabhas', description: 'Possible announcement from Hombal Films.', timelineId: 'prabhas_core', tags: ['Prabhas'] },
            { id: 'p2', title: 'Prabhas Birthday', date: new Date('2024-10-23'), category: EventCategory.BIRTHDAY, hero: 'Prabhas', timelineId: 'prabhas_core', tags: ['Prabhas'] },
        ]
    },
    {
        id: 'classics',
        name: 'TFI Classics',
        handle: '@retro_telugu',
        description: 'Golden era milestones. NTR, ANR, Krishna.',
        tags: ['Classic', 'History'],
        followers: 80000,
        color: 'border-slate-400',
        events: [
            { id: 'c1', title: 'Mahanati Savitri Jayanthi', date: new Date('2024-12-06'), category: EventCategory.BIRTHDAY, hero: 'Savitri', timelineId: 'classics', tags: ['Classic'] },
            { id: 'c2', title: 'Dana Veera Soora Karna Release Anniv', date: new Date('2024-01-14'), category: EventCategory.ANNIVERSARY, hero: 'NTR', timelineId: 'classics', tags: ['Classic', 'NTR'] },
        ]
    }
];

const INITIAL_USER_EVENTS: TFIEvent[] = [
  { id: 'u1', title: 'Watched Murari 4K', date: new Date('2024-08-25'), category: EventCategory.OTHER, hero: 'Mahesh Babu', description: 'Goosebumps stuff in theaters! Rated 5/5', timelineId: 'user', rating: 5, link: 'https://instagram.com', location: 'Sudarshan 35MM, RTC X Roads' },
];

const App: React.FC = () => {
  // State
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.CALENDAR);
  const [userEvents, setUserEvents] = useState<TFIEvent[]>(INITIAL_USER_EVENTS);
  const [subscribedTimelines, setSubscribedTimelines] = useState<string[]>(['official_channels']);
  const [selectedHeroFilter, setSelectedHeroFilter] = useState<string | null>(null);
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(true); 
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TFIEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // New UI States
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // User Prefs & Localization
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [lang, setLang] = useState<'EN'|'TE'>('EN');

  useEffect(() => {
    // Simulated auth check / init
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          // Ignore if input focused
          if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

          if (e.metaKey || e.ctrlKey) {
              if (e.key === 'k') {
                  e.preventDefault();
                  setIsSearchOpen(prev => !prev);
                  return;
              }
          }

          switch(e.key.toLowerCase()) {
              case 'c': setViewMode(ViewMode.CALENDAR); break;
              case 'l': setViewMode(ViewMode.LIVE); break;
              case 'm': setViewMode(ViewMode.MEDIA); break;
              case 'p': setViewMode(ViewMode.PROFILE); break;
              case 'f': setViewMode(ViewMode.GAMIFICATION); break; // Fan Zone
              case 'd': setViewMode(ViewMode.DEV_TOOLS); break;
              case 'o': setViewMode(ViewMode.COMMUNITY); break;
              case 's': setViewMode(ViewMode.CREATOR); break; // Studio
              case 'a': setViewMode(ViewMode.AI_LAB); break; // AI Lab
              case 'n': 
                  if (viewMode === ViewMode.CALENDAR) {
                      handleDateClick(new Date());
                  }
                  break;
              case '/': 
                  e.preventDefault();
                  setIsSearchOpen(true);
                  break;
          }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode]);

  const handleOnboardingComplete = (prefs: UserPreferences) => {
    setUserPreferences(prefs);
    if (prefs.favoriteHeroes.length > 0) {
        setSelectedHeroFilter(prefs.favoriteHeroes[0]);
    }
  };

  // Derived Events (Merge User + Subscribed + Filter)
  const displayedEvents = useMemo(() => {
      let allEvents = [...userEvents];
      
      MOCK_TIMELINES.forEach(tl => {
          if (subscribedTimelines.includes(tl.id)) {
              allEvents = [...allEvents, ...tl.events];
          }
      });
      
      if (selectedHeroFilter) {
          allEvents = allEvents.filter(e => 
              e.hero?.toLowerCase().includes(selectedHeroFilter.toLowerCase()) || 
              e.tags?.some(t => t.toLowerCase() === selectedHeroFilter.toLowerCase())
          );
      }
      
      return allEvents;
  }, [userEvents, subscribedTimelines, selectedHeroFilter]);

  // Called when AI proposes an event
  const addProposedEvent = (event: TFIEvent) => {
    const newEvent = { ...event, timelineId: 'user', id: Date.now().toString() };
    setUserEvents(prev => [...prev, newEvent]);
    setIsModalOpen(true);
    setSelectedEvent(newEvent);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: TFIEvent) => {
    setSelectedEvent(event);
    setSelectedDate(null);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (savedEvent: TFIEvent) => {
    if (savedEvent.timelineId !== 'user') {
        const newEvent = { ...savedEvent, timelineId: 'user', id: Date.now().toString() };
        setUserEvents(prev => [...prev, newEvent]);
    } else {
        setUserEvents(prev => {
            const exists = prev.find(e => e.id === savedEvent.id);
            if (exists) {
                return prev.map(e => e.id === savedEvent.id ? savedEvent : e);
            } else {
                return [...prev, savedEvent];
            }
        });
    }
    setIsModalOpen(false);
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
        setUserEvents(prev => prev.filter(e => e.id !== id));
        setIsModalOpen(false);
    }
  };

  const toggleTimeline = (id: string) => {
      setSubscribedTimelines(prev => 
          prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
      );
  };

  if (!userPreferences?.hasCompletedOnboarding) {
      return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // --- Localization Helpers ---
  const t = (key: string) => {
      if (lang === 'EN') return key;
      // Simple Mock Translations for Demo
      const dict: Record<string, string> = {
          'Calendar': 'క్యాలెండర్',
          'Trending': 'ట్రెండింగ్',
          'Media Hub': 'మీడియా హబ్',
          'Fan Zone': 'ఫ్యాన్ జోన్',
          'Profile': 'ప్రొఫైల్',
          'Community': 'కమ్యూనిటీ',
          'Creator Studio': 'క్రియేటర్ స్టూడియో',
          'The Industry Brain': 'తెలుగు సినిమా గుండె చప్పుడు',
          'AI Lab': 'AI ప్రయోగశాల'
      };
      return dict[key] || key;
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-200 font-sans selection:bg-yellow-500/30">
      
      {/* LEFT SIDEBAR: Nav & Filters */}
      <div className={`
          flex-col w-72 bg-slate-950 border-r border-slate-800 z-10 transition-all duration-300 absolute lg:relative h-full
          ${isLeftSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex
      `}>
          <div className="p-6 pb-2">
             <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <span className="material-icons-round text-slate-900 text-xl">movie_filter</span>
                 </div>
                 <div className="flex-grow">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-white tracking-tight leading-none">TFI <span className="text-yellow-500">Timeline</span></h1>
                        <button 
                            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                            className={`hover:text-white ${isNotificationOpen ? 'text-yellow-500' : 'text-slate-500'}`}
                        >
                            <span className="material-icons-round text-sm">notifications_active</span>
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-1">{t('The Industry Brain')}</p>
                 </div>
             </div>

             {/* Language Toggle */}
             <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800 mb-6 mx-2">
                 <button 
                    onClick={() => setLang('EN')} 
                    className={`flex-1 py-1 text-xs font-bold rounded ${lang === 'EN' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}
                 >
                     English
                 </button>
                 <button 
                    onClick={() => setLang('TE')} 
                    className={`flex-1 py-1 text-xs font-bold rounded ${lang === 'TE' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}
                 >
                     తెలుగు
                 </button>
             </div>

             <div className="space-y-1">
                  <button 
                    onClick={() => setViewMode(ViewMode.CALENDAR)}
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${viewMode === ViewMode.CALENDAR ? 'bg-slate-800 text-yellow-400 font-semibold shadow-sm ring-1 ring-slate-700' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
                  >
                      <span className="material-icons-round text-lg">calendar_month</span>
                      <div className="flex-grow flex justify-between items-center">
                          <span>{t('Calendar')}</span>
                          <span className="material-icons-round text-slate-600 text-sm">chevron_right</span>
                      </div>
                  </button>
                  <button 
                    onClick={() => setViewMode(ViewMode.LIVE)}
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${viewMode === ViewMode.LIVE ? 'bg-slate-800 text-blue-400 font-semibold shadow-sm ring-1 ring-slate-700' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
                  >
                      <span className="material-icons-round text-lg">local_fire_department</span>
                      <div className="flex-grow flex justify-between items-center">
                          <span>{t('Trending')}</span>
                          <span className="material-icons-round text-slate-600 text-sm">chevron_right</span>
                      </div>
                  </button>
                  <button 
                    onClick={() => setViewMode(ViewMode.MEDIA)}
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${viewMode === ViewMode.MEDIA ? 'bg-slate-800 text-pink-400 font-semibold shadow-sm ring-1 ring-slate-700' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
                  >
                      <span className="material-icons-round text-lg">play_circle</span>
                      <div className="flex-grow flex justify-between items-center">
                          <span>{t('Media Hub')}</span>
                          <span className="material-icons-round text-slate-600 text-sm">chevron_right</span>
                      </div>
                  </button>
                  <button 
                    onClick={() => setViewMode(ViewMode.GAMIFICATION)}
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${viewMode === ViewMode.GAMIFICATION ? 'bg-slate-800 text-purple-400 font-semibold shadow-sm ring-1 ring-slate-700' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
                  >
                      <span className="material-icons-round text-lg">emoji_events</span>
                      <div className="flex-grow flex justify-between items-center">
                          <span>{t('Fan Zone')}</span>
                          <span className="material-icons-round text-slate-600 text-sm">chevron_right</span>
                      </div>
                  </button>
                  <button 
                    onClick={() => setViewMode(ViewMode.COMMUNITY)}
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${viewMode === ViewMode.COMMUNITY ? 'bg-slate-800 text-indigo-400 font-semibold shadow-sm ring-1 ring-slate-700' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
                  >
                      <span className="material-icons-round text-lg">forum</span>
                      <div className="flex-grow flex justify-between items-center">
                          <span>{t('Community')}</span>
                          <span className="material-icons-round text-slate-600 text-sm">chevron_right</span>
                      </div>
                  </button>
                  <button 
                    onClick={() => setViewMode(ViewMode.CREATOR)}
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${viewMode === ViewMode.CREATOR ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm ring-1 ring-slate-700' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
                  >
                      <span className="material-icons-round text-lg">movie_creation</span>
                      <div className="flex-grow flex justify-between items-center">
                          <span>{t('Creator Studio')}</span>
                          <span className="material-icons-round text-slate-600 text-sm">chevron_right</span>
                      </div>
                  </button>
                  
                  {/* AI Lab (New Phase 5) */}
                   <button 
                    onClick={() => setViewMode(ViewMode.AI_LAB)}
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${viewMode === ViewMode.AI_LAB ? 'bg-slate-800 text-pink-500 font-semibold shadow-sm ring-1 ring-slate-700' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
                  >
                      <span className="material-icons-round text-lg">science</span>
                      <div className="flex-grow flex justify-between items-center">
                          <span>{t('AI Lab')}</span>
                          <span className="material-icons-round text-slate-600 text-sm">chevron_right</span>
                      </div>
                  </button>

                  <button 
                    onClick={() => setViewMode(ViewMode.PROFILE)}
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${viewMode === ViewMode.PROFILE ? 'bg-slate-800 text-green-400 font-semibold shadow-sm ring-1 ring-slate-700' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
                  >
                      <span className="material-icons-round text-lg">person</span>
                      <div className="flex-grow flex justify-between items-center">
                          <span>{t('Profile')}</span>
                          <span className="material-icons-round text-slate-600 text-sm">chevron_right</span>
                      </div>
                  </button>
                  
                  {/* Developer Tools Link */}
                  <button 
                    onClick={() => setViewMode(ViewMode.DEV_TOOLS)}
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 mt-4 transition-all ${viewMode === ViewMode.DEV_TOOLS ? 'bg-slate-800 text-slate-200 font-semibold shadow-sm ring-1 ring-slate-700' : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300'}`}
                  >
                      <span className="material-icons-round text-lg">terminal</span>
                      <div className="flex-grow flex justify-between items-center">
                          <span className="text-xs font-mono uppercase tracking-wide">Dev Tools</span>
                          <span className="material-icons-round text-slate-600 text-sm">chevron_right</span>
                      </div>
                  </button>
             </div>
          </div>

          <div className="px-6 py-4 flex-grow overflow-y-auto">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">Subscriptions</h3>
              <div className="space-y-2">
                  {MOCK_TIMELINES.map(tl => (
                      <button 
                          key={tl.id}
                          onClick={() => toggleTimeline(tl.id)}
                          className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors group ${subscribedTimelines.includes(tl.id) ? 'bg-slate-800/50' : 'hover:bg-slate-900'}`}
                      >
                          <div className={`w-2 h-2 rounded-full border-2 ${subscribedTimelines.includes(tl.id) ? `bg-current ${tl.color?.replace('border', 'text')}` : 'border-slate-600 bg-transparent'}`}></div>
                          <div className="text-left overflow-hidden">
                              <div className={`text-sm font-medium truncate ${subscribedTimelines.includes(tl.id) ? 'text-slate-200' : 'text-slate-400 group-hover:text-slate-300'}`}>{tl.name}</div>
                              <div className="text-[10px] text-slate-500 truncate">{tl.handle}</div>
                          </div>
                          {subscribedTimelines.includes(tl.id) && <span className="ml-auto material-icons-round text-xs text-slate-500">check</span>}
                      </button>
                  ))}
              </div>
          </div>
          
          {/* Upgrade Banner */}
          <div className="px-6 pb-2">
              <button onClick={() => setIsSubscriptionOpen(true)} className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg p-3 text-left group hover:brightness-110 transition-all">
                  <div className="text-xs font-bold text-white mb-1 flex items-center gap-1">
                      <span className="material-icons-round text-sm">star</span> Go Premium
                  </div>
                  <div className="text-[10px] text-white/80">Support TFI Timeline & remove ads.</div>
              </button>
          </div>

          {/* Download App Footer */}
          <div className="p-4 border-t border-slate-800">
               <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-slate-400 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors border border-slate-800 hover:border-slate-700 mb-2"
                >
                   <span className="material-icons-round text-sm">search</span>
                   <span className="text-xs font-bold">Search (Cmd+K)</span>
               </button>
               <button 
                    onClick={() => setIsInstallModalOpen(true)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                   <span className="material-icons-round text-sm">install_mobile</span>
                   <span className="text-xs font-bold">Download App</span>
               </button>
          </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-grow flex flex-col relative w-full h-full bg-slate-950 overflow-hidden">
        
        {/* Mobile Header Toggle */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
            <div className="flex items-center">
                <button onClick={() => setLeftSidebarOpen(!isLeftSidebarOpen)} className="text-slate-300">
                    <span className="material-icons-round">menu</span>
                </button>
                <span className="ml-4 font-bold text-lg">TFI Timeline</span>
            </div>
            <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="text-slate-300"
            >
                <span className="material-icons-round">notifications</span>
            </button>
        </div>

        {/* View Switcher */}
        {viewMode === ViewMode.CALENDAR && (
            <CalendarView 
                events={displayedEvents} 
                onAddEvent={handleDateClick}
                onEventClick={handleEventClick}
            />
        )}
        
        {viewMode === ViewMode.LIVE && (
            <LiveHub onAddRumor={() => handleDateClick(new Date())} />
        )}

        {viewMode === ViewMode.MEDIA && (
            <MediaHub />
        )}

        {viewMode === ViewMode.PROFILE && (
            <ProfileView preferences={userPreferences} userEvents={userEvents} />
        )}
        
        {viewMode === ViewMode.GAMIFICATION && (
            <GamificationHub />
        )}

        {viewMode === ViewMode.DEV_TOOLS && (
            <DeveloperTools />
        )}

        {viewMode === ViewMode.CREATOR && (
            <CreatorStudio />
        )}

        {viewMode === ViewMode.COMMUNITY && (
            <CommunityHub />
        )}

        {viewMode === ViewMode.AI_LAB && (
            <AILab />
        )}
        
        {/* Floating AI Chat (Global) */}
        <FloatingChat 
            onEventProposed={addProposedEvent} 
            userPreferences={userPreferences}
        />

        {/* Event Modal */}
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveEvent}
          onDelete={selectedEvent ? () => handleDeleteEvent(selectedEvent.id) : () => {}}
          event={selectedEvent}
          selectedDate={selectedDate}
        />

        {/* Global Overlays */}
        <NotificationCenter 
            isOpen={isNotificationOpen} 
            onClose={() => setIsNotificationOpen(false)} 
        />
        
        <GlobalSearch 
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            events={displayedEvents}
            onSelectEvent={handleEventClick}
        />

        <SubscriptionModal 
            isOpen={isSubscriptionOpen}
            onClose={() => setIsSubscriptionOpen(false)}
        />

        <InstallModal 
            isOpen={isInstallModalOpen}
            onClose={() => setIsInstallModalOpen(false)}
        />

      </div>
    </div>
  );
};

export default App;
