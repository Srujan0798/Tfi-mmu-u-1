
import React, { useState, useMemo, useEffect, Suspense } from 'react';
import LoadingScreen from './components/LoadingScreen';
import FloatingChat from './components/FloatingChat';
import EventModal from './components/EventModal';
import NotificationCenter from './components/NotificationCenter';
import GlobalSearch from './components/GlobalSearch';
import SubscriptionModal from './components/SubscriptionModal';
import InstallModal from './components/InstallModal';
import ErrorBoundary from './components/ErrorBoundary';
import { TFIEvent, EventCategory, CreatorTimeline, ViewMode, UserPreferences } from './types';

// --- Lazy Load Components (Code Splitting) ---
const CalendarView = React.lazy(() => import('./components/CalendarView'));
const LiveHub = React.lazy(() => import('./components/LiveHub'));
const MediaHub = React.lazy(() => import('./components/MediaHub'));
const ProfileView = React.lazy(() => import('./components/ProfileView'));
const GamificationHub = React.lazy(() => import('./components/GamificationHub'));
const DeveloperTools = React.lazy(() => import('./components/DeveloperTools'));
const CreatorStudio = React.lazy(() => import('./components/CreatorStudio'));
const CommunityHub = React.lazy(() => import('./components/CommunityHub'));
const AILab = React.lazy(() => import('./components/AILab'));
const Onboarding = React.lazy(() => import('./components/Onboarding'));

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

  const handleSaveEvent = (savedEvent: TFIEvent, shouldClose = true) => {
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
    if (shouldClose) {
        setIsModalOpen(false);
    }
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

  const t = (key: string) => {
      if (lang === 'EN') return key;
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

  // Onboarding Check with Suspense Wrapper
  if (!userPreferences?.hasCompletedOnboarding) {
      return (
        <ErrorBoundary>
            <Suspense fallback={<div className="h-screen w-screen bg-slate-950 flex items-center justify-center text-white">Loading TFI Brain...</div>}>
                <Onboarding onComplete={handleOnboardingComplete} />
            </Suspense>
        </ErrorBoundary>
      );
  }

  // --- UI Components for App Shell ---

  const NavItem = ({ mode, icon, label, badge }: { mode: ViewMode, icon: string, label: string, badge?: string }) => (
      <button 
        onClick={() => setViewMode(mode)}
        className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all group ${viewMode === mode ? 'bg-slate-800/80 text-white shadow-sm ring-1 ring-white/10' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
      >
          <span className={`material-icons-round text-lg ${viewMode === mode ? 'text-yellow-500' : 'text-slate-500 group-hover:text-slate-300'}`}>{icon}</span>
          <div className="flex-grow flex justify-between items-center">
              <span className="text-sm font-medium">{t(label)}</span>
              {badge ? (
                  <span className="text-[9px] bg-red-500 text-white px-1.5 rounded-full">{badge}</span>
              ) : (
                  <span className="material-icons-round text-slate-600 text-sm opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
              )}
          </div>
      </button>
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-200 font-sans selection:bg-yellow-500/30">
      
      {/* --- APP SHELL: SIDEBAR --- */}
      <aside className={`
          flex-col w-72 bg-slate-950/50 backdrop-blur-xl border-r border-slate-800/50 z-20 transition-all duration-300 absolute lg:relative h-full
          ${isLeftSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex
      `}>
          {/* Brand Header */}
          <div className="p-5 pb-2">
             <div className="flex items-center gap-3 mb-6">
                 <div className="w-9 h-9 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20 ring-1 ring-white/10">
                    <span className="material-icons-round text-slate-900 text-lg">movie_filter</span>
                 </div>
                 <div className="flex-grow">
                    <div className="flex items-center justify-between">
                        <h1 className="text-lg font-bold text-white tracking-tight">TFI <span className="text-yellow-500">Timeline</span></h1>
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" title="System Online"></div>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">{t('The Industry Brain')}</p>
                 </div>
             </div>

             {/* Context Switcher (Lang) */}
             <div className="flex bg-slate-900/80 rounded-lg p-1 border border-slate-800/50 mb-6">
                 <button onClick={() => setLang('EN')} className={`flex-1 py-1 text-[10px] font-bold rounded ${lang === 'EN' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500'}`}>ENG</button>
                 <button onClick={() => setLang('TE')} className={`flex-1 py-1 text-[10px] font-bold rounded ${lang === 'TE' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500'}`}>TEL</button>
             </div>

             {/* Navigation Groups */}
             <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-250px)] custom-scrollbar pr-2">
                  <div className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-500 uppercase px-3 mb-2 tracking-wider">Discover</div>
                      <NavItem mode={ViewMode.CALENDAR} icon="calendar_month" label="Calendar" />
                      <NavItem mode={ViewMode.LIVE} icon="local_fire_department" label="Trending" />
                      <NavItem mode={ViewMode.MEDIA} icon="play_circle" label="Media Hub" />
                  </div>

                  <div className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-500 uppercase px-3 mb-2 tracking-wider">Connect</div>
                      <NavItem mode={ViewMode.GAMIFICATION} icon="emoji_events" label="Fan Zone" badge="3" />
                      <NavItem mode={ViewMode.COMMUNITY} icon="forum" label="Community" />
                      <NavItem mode={ViewMode.CREATOR} icon="movie_creation" label="Creator Studio" />
                  </div>

                  <div className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-500 uppercase px-3 mb-2 tracking-wider">Intelligence</div>
                      <NavItem mode={ViewMode.AI_LAB} icon="science" label="AI Lab" />
                      <NavItem mode={ViewMode.PROFILE} icon="person" label="Profile" />
                      <NavItem mode={ViewMode.DEV_TOOLS} icon="terminal" label="Dev Tools" />
                  </div>
             </div>
          </div>

          {/* Subscriptions Footer */}
          <div className="mt-auto px-5 py-4 border-t border-slate-800/50 bg-slate-950/30">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Syncs</h3>
              <div className="flex -space-x-2 overflow-hidden mb-4">
                  {MOCK_TIMELINES.map(tl => (
                      <div key={tl.id} onClick={() => toggleTimeline(tl.id)} className={`w-6 h-6 rounded-full border border-slate-800 bg-slate-700 flex items-center justify-center text-[8px] cursor-pointer hover:z-10 hover:scale-110 transition-transform ${subscribedTimelines.includes(tl.id) ? 'ring-2 ring-blue-500' : 'opacity-50'}`}>
                          {tl.name[0]}
                      </div>
                  ))}
                  <div className="w-6 h-6 rounded-full border border-slate-800 bg-slate-800 flex items-center justify-center text-[10px] text-slate-400 cursor-pointer hover:text-white">+</div>
              </div>
              <button 
                  onClick={() => setIsSubscriptionOpen(true)}
                  className="w-full bg-gradient-to-r from-yellow-600/20 to-orange-600/20 hover:from-yellow-600/30 hover:to-orange-600/30 border border-yellow-600/30 rounded-lg p-2 flex items-center gap-2 group transition-all"
              >
                  <div className="bg-gradient-to-br from-yellow-500 to-orange-600 w-6 h-6 rounded flex items-center justify-center text-slate-900 shadow-lg">
                      <span className="material-icons-round text-xs">star</span>
                  </div>
                  <div className="text-left">
                      <div className="text-xs font-bold text-white group-hover:text-yellow-400 transition-colors">Go Premium</div>
                  </div>
              </button>
          </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-grow flex flex-col relative w-full h-full bg-slate-950 overflow-hidden">
        
        {/* Mobile Header Toggle */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-3">
                <button onClick={() => setLeftSidebarOpen(!isLeftSidebarOpen)} className="text-slate-300 hover:text-white">
                    <span className="material-icons-round">menu</span>
                </button>
                <span className="font-bold text-lg tracking-tight">TFI Timeline</span>
            </div>
            <button onClick={() => setIsNotificationOpen(!isNotificationOpen)} className="text-slate-300 relative">
                <span className="material-icons-round">notifications</span>
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
        </header>

        {/* Viewport with Suspense & Error Boundaries */}
        <div className="flex-grow relative overflow-hidden">
            <ErrorBoundary>
                <Suspense fallback={<LoadingScreen />}>
                    {viewMode === ViewMode.CALENDAR && (
                        <CalendarView 
                            events={displayedEvents} 
                            onAddEvent={handleDateClick}
                            onEventClick={handleEventClick}
                        />
                    )}
                    {viewMode === ViewMode.LIVE && <LiveHub onAddRumor={() => handleDateClick(new Date())} />}
                    {viewMode === ViewMode.MEDIA && <MediaHub />}
                    {viewMode === ViewMode.PROFILE && <ProfileView preferences={userPreferences} userEvents={userEvents} />}
                    {viewMode === ViewMode.GAMIFICATION && <GamificationHub />}
                    {viewMode === ViewMode.DEV_TOOLS && <DeveloperTools />}
                    {viewMode === ViewMode.CREATOR && <CreatorStudio />}
                    {viewMode === ViewMode.COMMUNITY && <CommunityHub />}
                    {viewMode === ViewMode.AI_LAB && <AILab />}
                </Suspense>
            </ErrorBoundary>
        </div>

        {/* --- GLOBAL OVERLAYS --- */}
        
        {/* Command Menu Trigger (Desktop) */}
        <div className="absolute bottom-6 right-6 hidden lg:flex flex-col gap-3 z-30">
             <button 
                onClick={() => setIsInstallModalOpen(true)}
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-full flex items-center justify-center shadow-lg border border-slate-700 transition-all hover:scale-105"
                title="Install App"
            >
                <span className="material-icons-round text-lg">download</span>
            </button>
            <button 
                onClick={() => setIsSearchOpen(true)}
                className="bg-slate-900/90 backdrop-blur hover:bg-slate-800 text-slate-400 hover:text-white px-4 py-2 rounded-full shadow-xl border border-slate-700 flex items-center gap-2 transition-all hover:scale-105 group"
            >
                <span className="material-icons-round text-lg group-hover:text-blue-400">search</span>
                <span className="text-xs font-mono">Cmd+K</span>
            </button>
        </div>

        {/* Floating AI Chat */}
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

        {/* Notification Panel */}
        <NotificationCenter 
            isOpen={isNotificationOpen} 
            onClose={() => setIsNotificationOpen(false)} 
        />
        
        {/* Command Palette */}
        <GlobalSearch 
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            events={displayedEvents}
            onSelectEvent={handleEventClick}
        />

        {/* Other Modals */}
        <SubscriptionModal isOpen={isSubscriptionOpen} onClose={() => setIsSubscriptionOpen(false)} />
        <InstallModal isOpen={isInstallModalOpen} onClose={() => setIsInstallModalOpen(false)} />

      </main>
    </div>
  );
};

export default App;
