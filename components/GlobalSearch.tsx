
import React, { useState, useEffect, useRef } from 'react';
import { TFIEvent } from '../types';

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

    const filteredEvents = events.filter(e => 
        e.title.toLowerCase().includes(query.toLowerCase()) || 
        e.hero?.toLowerCase().includes(query.toLowerCase()) ||
        e.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    const trendingQueries = ['Devara', 'OG Release', 'Prabhas Birthday', 'Game Changer'];

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] animate-fade-in" onClick={onClose}>
            <div 
                className="w-full max-w-2xl bg-slate-900 border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 p-4 border-b border-slate-800 bg-slate-900">
                    <span className="material-icons-round text-slate-400 text-xl">search</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a command or search..."
                        className="flex-grow bg-transparent text-white text-lg placeholder-slate-500 focus:outline-none"
                    />
                    <div className="text-[10px] text-slate-500 font-mono border border-slate-700 rounded px-1.5 py-0.5 bg-slate-800">ESC</div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto bg-slate-950/50">
                    {query.length === 0 ? (
                        <div className="p-4">
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Suggested</h3>
                            <div className="flex flex-wrap gap-2">
                                {trendingQueries.map(q => (
                                    <button 
                                        key={q} 
                                        onClick={() => setQuery(q)}
                                        className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-sm transition-all border border-slate-800 hover:border-slate-600"
                                    >
                                        <span className="material-icons-round text-xs text-blue-400">trending_up</span>
                                        {q}
                                    </button>
                                ))}
                            </div>
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 mt-6">Commands</h3>
                            <div className="space-y-1">
                                <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors text-sm">
                                    <span className="material-icons-round text-slate-500 text-sm">calendar_today</span>
                                    Go to Calendar
                                </button>
                                <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors text-sm">
                                    <span className="material-icons-round text-slate-500 text-sm">add_circle</span>
                                    Create New Event...
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="py-2">
                            {filteredEvents.length > 0 ? (
                                <>
                                    <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">Results</div>
                                    {filteredEvents.map(evt => (
                                        <button 
                                            key={evt.id}
                                            onClick={() => { onSelectEvent(evt); onClose(); }}
                                            className="w-full px-4 py-3 hover:bg-blue-600/10 flex items-center justify-between group transition-colors border-l-2 border-transparent hover:border-blue-500"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-blue-400">
                                                    <span className="material-icons-round text-sm">event</span>
                                                </div>
                                                <div className="text-left">
                                                    <div className="text-sm font-bold text-slate-200 group-hover:text-blue-200">{evt.title}</div>
                                                    <div className="text-xs text-slate-500 group-hover:text-blue-300/60">{new Date(evt.date).toDateString()} • {evt.category}</div>
                                                </div>
                                            </div>
                                            <span className="material-icons-round text-slate-600 text-sm group-hover:text-blue-400 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">keyboard_return</span>
                                        </button>
                                    ))}
                                </>
                            ) : (
                                <div className="p-12 text-center text-slate-500">
                                    <span className="material-icons-round text-4xl mb-2 opacity-30">search_off</span>
                                    <p className="text-sm">No results found for "{query}"</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-2 bg-slate-900 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between px-4">
                    <div className="flex gap-2">
                        <span><strong className="text-slate-400">↑↓</strong> to navigate</span>
                        <span><strong className="text-slate-400">↵</strong> to select</span>
                    </div>
                    <span className="font-mono opacity-50">TFI-CMD-v1</span>
                </div>
            </div>
        </div>
    );
};

export default GlobalSearch;
