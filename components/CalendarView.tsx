
import React, { useState, useEffect, useRef } from 'react';
import { TFIEvent, EventCategory, CalendarSubView } from '../types';

interface CalendarViewProps {
  events: TFIEvent[];
  onAddEvent: (date: Date) => void;
  onEventClick: (event: TFIEvent) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ events, onAddEvent, onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [subView, setSubView] = useState<CalendarSubView>(CalendarSubView.MONTH);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to 9 AM on mount/view change for Week/Day views
  useEffect(() => {
      if ((subView === CalendarSubView.WEEK || subView === CalendarSubView.DAY) && scrollRef.current) {
          // 9 AM * 60px/hr = 540px
          scrollRef.current.scrollTop = 540; 
      }
  }, [subView]);

  // --- Helpers ---
  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  
  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day; 
    return new Date(d.setDate(diff));
  };

  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const isSameDay = (d1: Date, d2: Date) => {
      return d1.getFullYear() === d2.getFullYear() &&
             d1.getMonth() === d2.getMonth() &&
             d1.getDate() === d2.getDate();
  }

  const isSameMonth = (d1: Date, d2: Date) => {
      return d1.getFullYear() === d2.getFullYear() &&
             d1.getMonth() === d2.getMonth();
  }

  // --- Navigation Handlers ---
  const handlePrev = () => {
    if (subView === CalendarSubView.YEAR) setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1));
    else if (subView === CalendarSubView.MONTH) setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    else if (subView === CalendarSubView.WEEK) setCurrentDate(addDays(currentDate, -7));
    else if (subView === CalendarSubView.DAY) setCurrentDate(addDays(currentDate, -1));
    else setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)); // Agenda defaults to month nav logic or custom
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
  const getEventColor = (cat: EventCategory) => {
      // Google Calendar Palette mappings (Dark Mode)
      // Pastel backgrounds, darker text, left border
      switch (cat) {
        case EventCategory.RELEASE: 
        case EventCategory.RE_RELEASE:
            return 'bg-red-900/40 text-red-100 border-l-4 border-red-500 hover:bg-red-900/60';
        case EventCategory.OTT_RELEASE: 
            return 'bg-orange-900/40 text-orange-100 border-l-4 border-orange-500 hover:bg-orange-900/60';
        case EventCategory.BIRTHDAY: 
        case EventCategory.ANNIVERSARY:
            return 'bg-yellow-900/40 text-yellow-100 border-l-4 border-yellow-500 hover:bg-yellow-900/60';
        case EventCategory.AUDIO_LAUNCH: 
        case EventCategory.PRE_RELEASE:
        case EventCategory.SUCCESS_MEET:
            return 'bg-purple-900/40 text-purple-100 border-l-4 border-purple-500 hover:bg-purple-900/60';
        case EventCategory.TEASER: 
        case EventCategory.TRAILER: 
            return 'bg-blue-900/40 text-blue-100 border-l-4 border-blue-500 hover:bg-blue-900/60';
        case EventCategory.RUMOR:
            return 'bg-pink-900/40 text-pink-100 border-l-4 border-pink-500 hover:bg-pink-900/60';
        default: 
            return 'bg-slate-700/50 text-slate-200 border-l-4 border-slate-500 hover:bg-slate-700';
      }
  };

  // Helper to get time position (top percent) and height
  const getEventPosition = (event: TFIEvent) => {
      const startMinutes = event.date.getHours() * 60 + event.date.getMinutes();
      // Parse duration or default 60m
      let duration = 60;
      if (event.runtime) {
         const hoursMatch = event.runtime.match(/(\d+)h/);
         const minsMatch = event.runtime.match(/(\d+)m/);
         let h = hoursMatch ? parseInt(hoursMatch[1]) : 0;
         let m = minsMatch ? parseInt(minsMatch[1]) : 0;
         if (h > 0 || m > 0) duration = h * 60 + m;
      }
      
      // 1px per minute scale
      return {
          top: startMinutes,
          height: duration
      };
  };

  // --- RENDERERS ---

  const renderYearView = () => {
      const months = Array.from({ length: 12 }, (_, i) => i);
      const currentYear = currentDate.getFullYear();

      return (
          <div className="h-full overflow-y-auto bg-slate-950 p-4 lg:p-8 custom-scrollbar">
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
                            className="group cursor-pointer hover:bg-slate-900/50 rounded-2xl p-4 transition-all border border-transparent hover:border-slate-800"
                          >
                              <h3 className={`text-sm font-bold mb-4 ${isCurrentMonth ? 'text-blue-400' : 'text-slate-200'} pl-2`}>
                                  {monthDate.toLocaleDateString('en-US', { month: 'long' })}
                              </h3>
                              <div className="grid grid-cols-7 text-center gap-y-3 text-[10px]">
                                  {['S','M','T','W','T','F','S'].map(d => (
                                      <span key={d} className="text-slate-500 font-semibold">{d}</span>
                                  ))}
                                  {Array.from({length: startDay}).map((_, i) => <div key={`e-${i}`} />)}
                                  {Array.from({length: days}).map((_, i) => {
                                      const day = i + 1;
                                      const d = new Date(currentYear, monthIndex, day);
                                      const isToday = isSameDay(new Date(), d);
                                      const dayEvents = events.filter(e => isSameDay(e.date, d));
                                      const hasEvent = dayEvents.length > 0;
                                      
                                      let cellClass = "w-6 h-6 flex items-center justify-center rounded-full mx-auto transition-all ";
                                      
                                      if (isToday) {
                                          cellClass += "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20";
                                      } else if (hasEvent) {
                                          const isRelease = dayEvents.some(e => e.category === EventCategory.RELEASE);
                                          cellClass += isRelease 
                                            ? "bg-red-900/50 text-red-200 border border-red-500/30" 
                                            : "bg-slate-800 text-slate-300 font-semibold";
                                      } else {
                                          cellClass += "text-slate-400 group-hover:text-slate-200";
                                      }

                                      return (
                                          <div key={day} className={cellClass}>
                                              {day}
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
    
    // Header for Days
    const dayHeaders = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
        <div key={day} className="h-8 flex items-center justify-center text-[11px] font-semibold text-slate-500 tracking-wide border-b border-slate-800 bg-slate-950">
            {day}
        </div>
    ));

    // Previous Month Fillers
    const prevMonthDays = daysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    for (let i = 0; i < startDay; i++) {
        const dayNum = prevMonthDays - startDay + i + 1;
        days.push(
            <div key={`prev-${i}`} className="min-h-[120px] bg-slate-950/30 border-b border-r border-slate-800/50 p-2 opacity-30 flex flex-col">
                <span className="text-xs font-medium text-slate-600 text-center">{dayNum}</span>
            </div>
        );
    }

    // Current Month Days
    for (let i = 1; i <= totalDays; i++) {
      const currentDayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const dayEvents = events.filter(e => isSameDay(e.date, currentDayDate)).sort((a,b) => a.date.getTime() - b.date.getTime());
      const isToday = isSameDay(new Date(), currentDayDate);

      days.push(
        <div 
          key={`day-${i}`} 
          onClick={() => onAddEvent(currentDayDate)}
          className={`min-h-[120px] border-b border-r border-slate-800 bg-slate-950 hover:bg-slate-900/30 transition-colors p-1 flex flex-col group relative`}
        >
          <div className="flex justify-center mb-1 py-1">
             <span className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400'}`}>
                {i}
             </span>
          </div>
          <div className="flex-grow space-y-1 overflow-hidden">
            {dayEvents.slice(0, 4).map(evt => (
                <div 
                    key={evt.id} 
                    onClick={(e) => { e.stopPropagation(); onEventClick(evt); }}
                    className={`text-[10px] px-1.5 py-0.5 rounded-sm truncate cursor-pointer transition-transform hover:scale-[1.02] shadow-sm ${getEventColor(evt.category)}`}
                >
                    <span className="font-semibold opacity-75 mr-1">{evt.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})}</span>
                    {evt.title}
                </div>
            ))}
            {dayEvents.length > 4 && (
                <div className="text-[9px] text-slate-500 font-medium pl-1 hover:text-slate-300 cursor-pointer">
                    {dayEvents.length - 4} more
                </div>
            )}
          </div>
        </div>
      );
    }
    
    // Next Month Fillers
    const remaining = 7 - ((days.length) % 7);
    if (remaining < 7) {
        for(let j=1; j<=remaining; j++) {
            days.push(
                <div key={`next-${j}`} className="min-h-[120px] bg-slate-950/30 border-b border-r border-slate-800/50 p-2 opacity-30 flex flex-col">
                    <span className="text-xs font-medium text-slate-600 text-center">{j}</span>
                </div>
            );
        }
    }

    return (
        <div className="flex flex-col h-full bg-slate-950">
            <div className="grid grid-cols-7 bg-slate-950 border-b border-slate-800">{dayHeaders}</div>
            <div className="grid grid-cols-7 auto-rows-fr overflow-y-auto custom-scrollbar">
                {days}
            </div>
        </div>
    );
  };

  const renderTimeGrid = (dates: Date[]) => {
      // 24 hours * 60 minutes = 1440px height usually. Let's do 60px per hour.
      const HOUR_HEIGHT = 60;
      const hours = Array.from({length: 24}, (_, i) => i);
      
      return (
          <div className="flex flex-col h-full overflow-hidden bg-slate-950">
              {/* Header */}
              <div className="flex border-b border-slate-800 bg-slate-950 mr-[8px]"> {/* mr to offset scrollbar */}
                  <div className="w-16 flex-shrink-0 border-r border-slate-800"></div> {/* Time col header */}
                  {dates.map((d, i) => {
                      const isToday = isSameDay(new Date(), d);
                      return (
                          <div key={i} className={`flex-1 py-3 text-center border-r border-slate-800 ${isToday ? 'bg-slate-900/50' : ''}`}>
                              <div className={`text-[11px] font-bold uppercase mb-1 ${isToday ? 'text-blue-500' : 'text-slate-500'}`}>
                                  {d.toLocaleDateString('en-US', { weekday: 'short' })}
                              </div>
                              <div className={`text-2xl font-light rounded-full w-10 h-10 flex items-center justify-center mx-auto transition-colors ${isToday ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-300 hover:bg-slate-800'}`}>
                                  {d.getDate()}
                              </div>
                          </div>
                      );
                  })}
              </div>

              {/* Grid Body */}
              <div className="flex-grow overflow-y-auto custom-scrollbar relative bg-slate-950" ref={scrollRef}>
                   <div className="flex relative min-h-[1440px]">
                       {/* Time Column */}
                       <div className="w-16 flex-shrink-0 border-r border-slate-800 bg-slate-950 z-10 sticky left-0 text-right pr-3 pt-0 select-none">
                           {hours.map(h => (
                               <div key={h} className="h-[60px] relative">
                                   <span className="absolute -top-2.5 right-0 text-[10px] text-slate-500 font-medium">
                                       {h === 0 ? '' : h < 12 ? `${h} AM` : h === 12 ? `12 PM` : `${h-12} PM`}
                                   </span>
                               </div>
                           ))}
                       </div>

                       {/* Columns */}
                       {dates.map((d, colIndex) => {
                           const dayEvents = events.filter(e => isSameDay(e.date, d));
                           const isToday = isSameDay(new Date(), d);
                           const now = new Date();
                           const nowMinutes = now.getHours() * 60 + now.getMinutes();

                           return (
                               <div key={colIndex} 
                                    className="flex-1 border-r border-slate-800 relative min-h-[1440px] group"
                                    onClick={(e) => {
                                        // Simple click to add event at rough time
                                        onAddEvent(d); 
                                    }}
                               >
                                   {/* Grid lines */}
                                   {hours.map(h => (
                                       <div key={h} className="h-[60px] border-b border-slate-800/30 box-border w-full absolute pointer-events-none" style={{top: h * HOUR_HEIGHT}}></div>
                                   ))}

                                   {/* Events */}
                                   {dayEvents.map(evt => {
                                       const { top, height } = getEventPosition(evt);
                                       return (
                                           <div 
                                               key={evt.id}
                                               onClick={(e) => { e.stopPropagation(); onEventClick(evt); }}
                                               className={`absolute inset-x-1 rounded-sm p-2 text-xs overflow-hidden cursor-pointer hover:brightness-110 hover:z-20 transition-all shadow-sm ${getEventColor(evt.category)}`}
                                               style={{ top: `${top}px`, height: `${Math.max(height, 25)}px` }}
                                           >
                                               <div className="font-bold leading-tight truncate">{evt.title}</div>
                                               <div className="text-[10px] opacity-80 truncate">
                                                   {evt.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                   {evt.hero ? ` • ${evt.hero}` : ''}
                                               </div>
                                           </div>
                                       );
                                   })}

                                   {/* Current Time Line */}
                                   {isToday && (
                                       <div className="absolute w-full border-t border-red-500 z-30 pointer-events-none flex items-center" style={{ top: nowMinutes }}>
                                           <div className="w-2 h-2 bg-red-500 rounded-full -ml-1"></div>
                                       </div>
                                   )}
                               </div>
                           );
                       })}
                   </div>
              </div>
          </div>
      );
  };

  const renderWeekView = () => {
      const startOfWeek = getStartOfWeek(currentDate);
      const weekDays = Array.from({length: 7}, (_, i) => addDays(startOfWeek, i));
      return renderTimeGrid(weekDays);
  };

  const renderDayView = () => {
      return renderTimeGrid([currentDate]);
  };

  const renderAgendaView = () => {
    const upcoming = events
      .filter(e => e.date >= new Date(new Date().setHours(0,0,0,0)))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    const grouped: {[key: string]: TFIEvent[]} = {};
    upcoming.forEach(e => {
        const key = e.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        if(!grouped[key]) grouped[key] = [];
        grouped[key].push(e);
    });

    return (
        <div className="h-full overflow-y-auto p-4 lg:p-8 space-y-8 bg-slate-950 custom-scrollbar">
            {Object.entries(grouped).map(([month, evts]) => (
                <div key={month} className="relative">
                    <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest sticky top-0 bg-slate-950/95 backdrop-blur-sm py-2 z-10 border-b border-slate-800 w-full flex items-center gap-2">
                        <span className="material-icons-round text-base">calendar_month</span>
                        {month}
                    </h3>
                    <div className="space-y-1">
                        {evts.map(evt => (
                            <div key={evt.id} onClick={() => onEventClick(evt)} className="flex group cursor-pointer hover:bg-slate-900 p-2 rounded-lg transition-colors border border-transparent hover:border-slate-800">
                                <div className="w-14 flex-shrink-0 flex flex-col items-center justify-center text-center">
                                    <span className="text-lg font-light text-slate-200">{evt.date.getDate()}</span>
                                    <span className="text-[9px] text-slate-500 font-bold uppercase">{evt.date.toLocaleDateString('en-US', { weekday: 'short'})}</span>
                                </div>
                                <div className="w-20 flex-shrink-0 flex items-center text-xs text-slate-500 font-mono">
                                    {evt.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}
                                </div>
                                <div className="flex-grow flex items-center">
                                    <div className={`w-1 h-8 rounded-full mr-4 ${getEventColor(evt.category).split(' ')[0].replace('/40', '')}`}></div>
                                    <div className="min-w-0">
                                        <div className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors truncate">{evt.title}</div>
                                        <div className="text-xs text-slate-500 truncate">{evt.category.replace(/_/g, ' ')} {evt.hero ? `• ${evt.hero}` : ''}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            {upcoming.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                    <span className="material-icons-round text-4xl mb-2 opacity-50">event_busy</span>
                    <p>No upcoming events scheduled.</p>
                </div>
            )}
        </div>
    );
  };

  const getHeaderText = () => {
    const opts = { month: 'long', year: 'numeric' } as const;
    if (subView === CalendarSubView.YEAR) return currentDate.getFullYear().toString();
    if (subView === CalendarSubView.MONTH || subView === CalendarSubView.DAY) return currentDate.toLocaleDateString('en-US', opts);
    if (subView === CalendarSubView.AGENDA) return 'Schedule';
    if (subView === CalendarSubView.WEEK) {
        const start = getStartOfWeek(currentDate);
        const end = addDays(start, 6);
        if (start.getMonth() !== end.getMonth()) {
            return `${start.toLocaleDateString('en-US', { month: 'short' })} - ${end.toLocaleDateString('en-US', { month: 'short' })} ${end.getFullYear()}`;
        }
        return `${start.toLocaleDateString('en-US', opts)}`;
    }
    return '';
  }

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-200 font-sans">
      
      {/* TOOLBAR */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950 shrink-0">
        <div className="flex items-center gap-6">
            <h1 className="text-2xl font-normal text-slate-100 min-w-[200px] select-none tracking-tight">
                {getHeaderText()}
            </h1>
            <div className="flex items-center gap-3">
                 <button onClick={handleToday} className="px-4 py-2 text-xs font-bold border border-slate-700 rounded-md hover:bg-slate-800 text-slate-300 transition-colors">
                    Today
                </button>
                <div className="flex items-center gap-1">
                    <button onClick={handlePrev} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                        <span className="material-icons-round text-lg">chevron_left</span>
                    </button>
                    <button onClick={handleNext} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                        <span className="material-icons-round text-lg">chevron_right</span>
                    </button>
                </div>
            </div>
        </div>
        
        {/* View Switcher */}
        <div className="flex bg-slate-900 rounded-lg border border-slate-800 p-1">
            {[CalendarSubView.YEAR, CalendarSubView.MONTH, CalendarSubView.WEEK, CalendarSubView.DAY, CalendarSubView.AGENDA].map(v => (
                <button
                    key={v}
                    onClick={() => setSubView(v)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
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
          {subView === CalendarSubView.MONTH && renderMonthView()}
          {subView === CalendarSubView.WEEK && renderWeekView()}
          {subView === CalendarSubView.DAY && renderDayView()}
          {subView === CalendarSubView.AGENDA && renderAgendaView()}
      </div>
    </div>
  );
};

export default CalendarView;
