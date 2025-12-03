
import React, { useState } from 'react';
import { TFIEvent, EventCategory, CalendarSubView } from '../types';

interface CalendarViewProps {
  events: TFIEvent[];
  onAddEvent: (date: Date) => void;
  onEventClick: (event: TFIEvent) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ events, onAddEvent, onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [subView, setSubView] = useState<CalendarSubView>(CalendarSubView.MONTH);

  // --- Helpers ---
  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  
  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day; // adjust when day is sunday
    return new Date(d.setDate(diff));
  };

  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  // --- Navigation Handlers ---
  const handlePrev = () => {
    if (subView === CalendarSubView.YEAR) setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1));
    else if (subView === CalendarSubView.MONTH) setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    else if (subView === CalendarSubView.WEEK) setCurrentDate(addDays(currentDate, -7));
    else if (subView === CalendarSubView.DAY) setCurrentDate(addDays(currentDate, -1));
    else setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)); // Agenda defaults to month nav
  };

  const handleNext = () => {
    if (subView === CalendarSubView.YEAR) setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1));
    else if (subView === CalendarSubView.MONTH) setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    else if (subView === CalendarSubView.WEEK) setCurrentDate(addDays(currentDate, 7));
    else if (subView === CalendarSubView.DAY) setCurrentDate(addDays(currentDate, 1));
    else setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
      setCurrentDate(new Date());
  };

  // --- Styling Helpers ---
  const getCategoryColor = (cat: EventCategory) => {
    switch (cat) {
      case EventCategory.RELEASE: return 'bg-red-500/20 text-red-200 border-red-500/50';
      case EventCategory.RE_RELEASE: return 'bg-orange-600/20 text-orange-200 border-orange-500/50';
      case EventCategory.OTT_RELEASE: return 'bg-orange-500/20 text-orange-200 border-orange-500/50';
      case EventCategory.AUDIO_LAUNCH: return 'bg-purple-500/20 text-purple-200 border-purple-500/50';
      case EventCategory.PRE_RELEASE: return 'bg-indigo-500/20 text-indigo-200 border-indigo-500/50';
      case EventCategory.SUCCESS_MEET: return 'bg-green-500/20 text-green-200 border-green-500/50';
      case EventCategory.BIRTHDAY: return 'bg-yellow-500/20 text-yellow-200 border-yellow-500/50';
      case EventCategory.ANNIVERSARY: return 'bg-yellow-600/20 text-yellow-200 border-yellow-600/50';
      case EventCategory.TEASER: return 'bg-blue-500/20 text-blue-200 border-blue-500/50';
      case EventCategory.TRAILER: return 'bg-red-600/30 text-white border-red-500';
      case EventCategory.RUMOR: return 'bg-pink-500/20 text-pink-200 border-pink-500/50';
      case EventCategory.AWARD: return 'bg-amber-500/20 text-amber-200 border-amber-500/50';
      case EventCategory.SHOOTING_UPDATE: return 'bg-slate-600/40 text-slate-300 border-slate-500';
      case EventCategory.CENSOR: return 'bg-teal-500/20 text-teal-200 border-teal-500/50';
      case EventCategory.BOX_OFFICE: return 'bg-emerald-500/20 text-emerald-200 border-emerald-500/50';
      default: return 'bg-slate-700/30 text-slate-300 border-slate-600';
    }
  };

  // --- RENDERERS ---

  const renderYearView = () => {
      const months = Array.from({ length: 12 }, (_, i) => i);
      const currentYear = currentDate.getFullYear();

      return (
          <div className="h-full overflow-y-auto bg-slate-950 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10">
                  {months.map(monthIndex => {
                      const monthDate = new Date(currentYear, monthIndex, 1);
                      const days = daysInMonth(monthDate);
                      const startDay = firstDayOfMonth(monthDate);
                      const isCurrentMonth = new Date().getMonth() === monthIndex && new Date().getFullYear() === currentYear;

                      return (
                          <div 
                            key={monthIndex} 
                            onClick={() => { setCurrentDate(monthDate); setSubView(CalendarSubView.MONTH); }}
                            className="group cursor-pointer hover:bg-slate-900/50 rounded-xl p-2 transition-all"
                          >
                              <h3 className={`text-sm font-bold mb-3 pl-1 ${isCurrentMonth ? 'text-yellow-500' : 'text-slate-200 group-hover:text-white'}`}>
                                  {monthDate.toLocaleDateString('en-US', { month: 'long' })}
                              </h3>
                              <div className="grid grid-cols-7 text-center gap-y-1">
                                  {['S','M','T','W','T','F','S'].map(d => (
                                      <span key={d} className="text-[9px] font-bold text-slate-600">{d}</span>
                                  ))}
                                  {Array.from({length: startDay}).map((_, i) => <div key={`e-${i}`} />)}
                                  {Array.from({length: days}).map((_, i) => {
                                      const day = i + 1;
                                      const d = new Date(currentYear, monthIndex, day);
                                      const isToday = new Date().toDateString() === d.toDateString();
                                      const dayEvents = events.filter(e => e.date.toDateString() === d.toDateString());
                                      const hasEvent = dayEvents.length > 0;
                                      
                                      // Determine most critical event color
                                      let dotColor = 'bg-slate-700';
                                      if (hasEvent) {
                                          if (dayEvents.some(e => e.category === EventCategory.RELEASE)) dotColor = 'bg-red-500';
                                          else if (dayEvents.some(e => e.category === EventCategory.TRAILER)) dotColor = 'bg-orange-500';
                                          else if (dayEvents.some(e => e.category === EventCategory.BIRTHDAY)) dotColor = 'bg-yellow-500';
                                          else dotColor = 'bg-blue-500';
                                      }

                                      return (
                                          <div key={day} className="flex justify-center items-center h-5 w-5 mx-auto">
                                              <div className={`
                                                  h-5 w-5 flex items-center justify-center rounded-full text-[9px]
                                                  ${isToday ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/50' : 'text-slate-400'}
                                                  ${!isToday && hasEvent ? `text-white font-bold ${dotColor === 'bg-slate-700' ? 'bg-slate-800' : ''}` : ''}
                                              `}>
                                                  {day}
                                                  {/* Dot for Year View events if not today */}
                                                  {!isToday && hasEvent && (
                                                      <span className={`absolute -bottom-0.5 w-1 h-1 rounded-full ${dotColor}`}></span>
                                                  )}
                                              </div>
                                          </div>
                                      )
                                  })}
                              </div>
                          </div>
                      )
                  })}
              </div>
          </div>
      );
  };

  const renderMonthView = () => {
    const totalDays = daysInMonth(currentDate);
    const startDay = firstDayOfMonth(currentDate);
    const days = [];
    
    // Empty slots
    for (let i = 0; i < startDay; i++) {
        days.push(<div key={`empty-${i}`} className="min-h-[100px] border-b border-r border-slate-800/50 bg-slate-900/30"></div>);
    }

    // Days
    for (let i = 1; i <= totalDays; i++) {
      const currentDayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const dayEvents = events.filter(e => e.date.toDateString() === currentDayDate.toDateString());
      const isToday = new Date().toDateString() === currentDayDate.toDateString();

      days.push(
        <div 
          key={`day-${i}`} 
          onClick={() => onAddEvent(currentDayDate)}
          className={`min-h-[100px] border-b border-r border-slate-800 bg-slate-950 hover:bg-slate-900/80 transition-colors p-1 flex flex-col group relative`}
        >
          <div className="flex justify-center mb-1">
             <span className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>
                {i}
             </span>
          </div>
          <div className="flex-grow space-y-1 overflow-hidden">
            {dayEvents.map(evt => (
                <div 
                    key={evt.id} 
                    onClick={(e) => { e.stopPropagation(); onEventClick(evt); }}
                    className={`text-[10px] px-1.5 py-0.5 rounded border-l-2 truncate cursor-pointer hover:brightness-110 ${getCategoryColor(evt.category)}`}
                >
                    {evt.title}
                </div>
            ))}
          </div>
        </div>
      );
    }
    return <div className="grid grid-cols-7 auto-rows-fr h-full overflow-y-auto">{days}</div>;
  };

  const renderWeekView = () => {
      const startOfWeek = getStartOfWeek(currentDate);
      const weekDays = [];
      for(let i=0; i<7; i++) {
          const d = addDays(startOfWeek, i);
          weekDays.push(d);
      }

      return (
          <div className="flex flex-col h-full overflow-hidden">
              {/* Header Row */}
              <div className="grid grid-cols-7 border-b border-slate-800">
                  {weekDays.map((d, idx) => {
                      const isToday = new Date().toDateString() === d.toDateString();
                      return (
                        <div key={idx} className={`py-3 text-center border-r border-slate-800 ${isToday ? 'bg-slate-900' : ''}`}>
                            <div className={`text-[10px] uppercase font-bold ${isToday ? 'text-blue-500' : 'text-slate-500'}`}>
                                {d.toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                            <div className={`text-xl font-light ${isToday ? 'text-blue-400' : 'text-slate-200'}`}>
                                {d.getDate()}
                            </div>
                        </div>
                      );
                  })}
              </div>
              <div className="grid grid-cols-7 flex-grow overflow-y-auto bg-slate-950">
                  {weekDays.map((d, idx) => {
                      const dayEvents = events.filter(e => e.date.toDateString() === d.toDateString());
                      return (
                          <div key={idx} onClick={() => onAddEvent(d)} className="border-r border-slate-800 min-h-[400px] p-1 hover:bg-slate-900/30 transition-colors space-y-2 cursor-pointer">
                                {dayEvents.map(evt => (
                                    <div 
                                        key={evt.id} 
                                        onClick={(e) => { e.stopPropagation(); onEventClick(evt); }}
                                        className={`p-2 rounded border-l-2 text-xs cursor-pointer shadow-sm hover:shadow-md ${getCategoryColor(evt.category)}`}
                                    >
                                        <div className="font-semibold leading-tight">{evt.title}</div>
                                        {evt.hero && <div className="text-[9px] opacity-70 mt-0.5">{evt.hero}</div>}
                                    </div>
                                ))}
                          </div>
                      )
                  })}
              </div>
          </div>
      )
  };

  const renderDayView = () => {
      const isToday = new Date().toDateString() === currentDate.toDateString();
      const dayEvents = events.filter(e => e.date.toDateString() === currentDate.toDateString());
      
      return (
          <div className="flex flex-col h-full overflow-hidden bg-slate-950">
              <div className="p-6 border-b border-slate-800 flex justify-between items-end">
                  <div>
                      <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{currentDate.toLocaleDateString('en-US', { weekday: 'long' })}</div>
                      <div className={`text-5xl font-light ${isToday ? 'text-blue-500' : 'text-slate-100'}`}>{currentDate.getDate()}</div>
                  </div>
                  <button onClick={() => onAddEvent(currentDate)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
                      <span className="material-icons-round">add</span>
                      Add Event
                  </button>
              </div>
              
              <div className="flex-grow overflow-y-auto p-4 space-y-3">
                  {dayEvents.length === 0 ? (
                      <div className="text-center py-20 text-slate-500">
                          <span className="material-icons-round text-4xl mb-2 opacity-50">event_busy</span>
                          <p>No events planned for today.</p>
                      </div>
                  ) : (
                      dayEvents.map(evt => (
                          <div key={evt.id} onClick={() => onEventClick(evt)} className={`p-4 rounded-xl border flex gap-4 cursor-pointer hover:scale-[1.01] transition-transform ${getCategoryColor(evt.category).replace('border-l-0', '')}`}>
                               <div className="flex flex-col items-center justify-center px-2 border-r border-white/10 pr-4">
                                   <span className="text-xs opacity-70">Category</span>
                                   <span className="font-bold text-sm uppercase">{evt.category.replace('_', ' ')}</span>
                               </div>
                               <div>
                                   <h3 className="text-lg font-bold">{evt.title}</h3>
                                   {evt.hero && <p className="text-sm opacity-80">Starring: {evt.hero}</p>}
                                   {evt.description && <p className="text-xs opacity-60 mt-2 line-clamp-1">{evt.description}</p>}
                               </div>
                          </div>
                      ))
                  )}
              </div>
          </div>
      )
  };

  const renderAgendaView = () => {
      // Sort upcoming events
      const upcoming = events
        .filter(e => e.date >= new Date(new Date().setHours(0,0,0,0)))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      // Group by Month
      const grouped: {[key: string]: TFIEvent[]} = {};
      upcoming.forEach(e => {
          const key = e.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          if(!grouped[key]) grouped[key] = [];
          grouped[key].push(e);
      });

      return (
          <div className="h-full overflow-y-auto p-6 space-y-8 bg-slate-950">
              {Object.entries(grouped).map(([month, evts]) => (
                  <div key={month}>
                      <h3 className="text-xl font-bold text-slate-100 mb-4 sticky top-0 bg-slate-950 py-2 border-b border-slate-800 z-10 flex items-center gap-2">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                          {month}
                      </h3>
                      <div className="space-y-4 pl-4 border-l border-slate-800 ml-1">
                          {evts.map(evt => (
                              <div key={evt.id} onClick={() => onEventClick(evt)} className="group flex gap-4 items-start cursor-pointer">
                                  <div className="flex flex-col items-center min-w-[50px] pt-1">
                                      <span className="text-lg font-bold text-slate-300">{evt.date.getDate()}</span>
                                      <span className="text-[10px] uppercase text-slate-500 font-bold">{evt.date.toLocaleDateString('en-US', { weekday: 'short'})}</span>
                                  </div>
                                  <div className={`flex-grow p-3 rounded-lg border border-slate-800 bg-slate-900 group-hover:border-slate-600 transition-colors`}>
                                      <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-slate-200">{evt.title}</h4>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getCategoryColor(evt.category)}`}>{evt.category.replace('_', ' ')}</span>
                                      </div>
                                      {evt.hero && <div className="text-xs text-yellow-500/80 mt-1">{evt.hero}</div>}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              ))}
              {upcoming.length === 0 && (
                  <div className="text-center text-slate-500 mt-20">No upcoming events found.</div>
              )}
          </div>
      );
  };

  const getHeaderText = () => {
      if (subView === CalendarSubView.YEAR) return currentDate.getFullYear().toString();
      if (subView === CalendarSubView.MONTH) return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (subView === CalendarSubView.DAY) return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (subView === CalendarSubView.AGENDA) return 'Schedule';
      if (subView === CalendarSubView.WEEK) {
          const start = getStartOfWeek(currentDate);
          const end = addDays(start, 6);
          return `${start.getDate()} - ${end.getDate()} ${start.toLocaleDateString('en-US', { month: 'short' })}`;
      }
      return '';
  }

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-200">
      
      {/* TOOLBAR */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950 flex-wrap gap-4">
        <div className="flex items-center gap-6">
            <h2 className="text-2xl font-light text-slate-100 tracking-tight min-w-[200px]">
                {getHeaderText()}
            </h2>
            <div className="flex items-center bg-slate-900 rounded-lg border border-slate-700 p-0.5 shadow-sm">
                <button onClick={handlePrev} className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors">
                    <span className="material-icons-round text-lg">chevron_left</span>
                </button>
                <div className="h-4 w-[1px] bg-slate-700 mx-1"></div>
                <button onClick={handleNext} className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors">
                    <span className="material-icons-round text-lg">chevron_right</span>
                </button>
            </div>
            <button onClick={handleToday} className="px-3 py-1.5 text-xs font-semibold border border-slate-700 rounded-md hover:bg-slate-800 text-slate-300 transition-colors">
                Today
            </button>
        </div>
        
        {/* View Switcher */}
        <div className="flex bg-slate-900 rounded-lg border border-slate-800 p-1">
            {[CalendarSubView.YEAR, CalendarSubView.MONTH, CalendarSubView.WEEK, CalendarSubView.DAY, CalendarSubView.AGENDA].map(v => (
                <button
                    key={v}
                    onClick={() => setSubView(v)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                        subView === v 
                        ? 'bg-slate-700 text-white shadow-sm' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                >
                    {v.charAt(0) + v.slice(1).toLowerCase()}
                </button>
            ))}
        </div>
      </div>

      {/* VIEW CONTENT */}
      <div className="flex-grow overflow-hidden relative">
          {subView === CalendarSubView.YEAR && renderYearView()}
          {subView === CalendarSubView.MONTH && (
              <>
                <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950">
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                        <div key={day} className="text-[10px] font-bold text-slate-500 py-2 text-center tracking-widest">
                            {day}
                        </div>
                    ))}
                </div>
                {renderMonthView()}
              </>
          )}
          {subView === CalendarSubView.WEEK && renderWeekView()}
          {subView === CalendarSubView.DAY && renderDayView()}
          {subView === CalendarSubView.AGENDA && renderAgendaView()}
      </div>
    </div>
  );
};

export default CalendarView;