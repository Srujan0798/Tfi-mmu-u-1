
import React, { useState, useEffect, useRef } from 'react';
import { TFIEvent, MediaItem, CreatorTimeline } from '../types';

interface GlobalSearchProps {
    isOpen: boolean;
    onClose: () => void;
    events: TFIEvent[];
    onSelectEvent: (event: TFIEvent) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose, events, onSelectEvent }) => {
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            setQuery('');
        }
    }, [isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    };

    if (!isOpen) return null;

    // Filter Logic
    const filteredEvents = events.filter(e => 
        e.title.toLowerCase().includes(query.toLowerCase()) || 
        e.hero?.toLowerCase().includes(query.toLowerCase()) ||
        e.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    // Simulated "Trending" suggestions when empty
    const trendingQueries = ['Devara', 'OG Release', 'Prabhas Birthday', 'Game Changer'];

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-24 animate-fade-in" onClick={onClose}>
            <div 
                className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 p-4 border-b border-slate-800 bg-slate-800/50">
                    <span className="material-icons-round text-slate-400 text-xl">search</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search events, movies, stars..."
                        className="flex-grow bg-transparent text-white text-lg placeholder-slate-500 focus:outline-none"
                    />
                    <div className="text-xs text-slate-500 font-mono border border-slate-700 rounded px-1.5 py-0.5">ESC</div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto">
                    {query.length === 0 ? (
                        <div className="p-4">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Trending Now</h3>
                            <div className="flex flex-wrap gap-2">
                                {trendingQueries.map(q => (
                                    <button 
                                        key={q} 
                                        onClick={() => setQuery(q)}
                                        className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full text-sm transition-colors"
                                    >
                                        <span className="material-icons-round text-xs text-blue-400">trending_up</span>
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="py-2">
                            {filteredEvents.length > 0 ? (
                                <>
                                    <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase">Events</div>
                                    {filteredEvents.map(evt => (
                                        <button 
                                            key={evt.id}
                                            onClick={() => { onSelectEvent(evt); onClose(); }}
                                            className="w-full px-4 py-3 hover:bg-slate-800 flex items-center justify-between group transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-slate-700 group-hover:text-white">
                                                    <span className="material-icons-round text-sm">event</span>
                                                </div>
                                                <div className="text-left">
                                                    <div className="text-sm font-bold text-slate-200 group-hover:text-yellow-400">{evt.title}</div>
                                                    <div className="text-xs text-slate-500">{new Date(evt.date).toDateString()} • {evt.category}</div>
                                                </div>
                                            </div>
                                            <span className="material-icons-round text-slate-600 text-sm group-hover:text-white -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">arrow_forward</span>
                                        </button>
                                    ))}
                                </>
                            ) : (
                                <div className="p-8 text-center text-slate-500">
                                    <span className="material-icons-round text-4xl mb-2 opacity-50">search_off</span>
                                    <p>No results found for "{query}"</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-2 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between px-4">
                    <span>Search across Calendar, Media, and People</span>
                    <span className="font-mono">TFI Timeline Search</span>
                </div>
            </div>
        </div>
    );
};

export default GlobalSearch;
