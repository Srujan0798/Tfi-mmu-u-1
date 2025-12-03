import React, { useEffect, useState } from 'react';
import { fetchLiveFeed } from '../services/geminiService';

interface LiveHubProps {
    onAddRumor: () => void;
}

interface FeedItem {
    id: string;
    title: string;
    source: string;
    summary: string;
    link: string;
    hashtags: string[];
    timestamp: string;
}

const LiveHub: React.FC<LiveHubProps> = ({ onAddRumor }) => {
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFeed = async () => {
            const data = await fetchLiveFeed();
            setFeedItems(data);
            setLoading(false);
        };
        loadFeed();
    }, []);

    // Helper to get brand colors for sources
    const getSourceStyle = (source: string) => {
        const s = source.toLowerCase();
        if (s.includes('twitter') || s.includes('x')) return 'text-blue-400';
        if (s.includes('youtube')) return 'text-red-500';
        if (s.includes('instagram')) return 'text-pink-500';
        return 'text-slate-400';
    };

    const getSourceIcon = (source: string) => {
        const s = source.toLowerCase();
        if (s.includes('twitter') || s.includes('x')) return 'tag'; // using tag as proxy for hash/X
        if (s.includes('youtube')) return 'play_circle';
        if (s.includes('instagram')) return 'photo_camera';
        return 'public';
    };

    return (
        <div className="h-full bg-slate-950 text-slate-200 overflow-y-auto pb-32">
            {/* Discover Header */}
            <div className="p-8 pb-4 max-w-5xl mx-auto">
                 <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                            <span className="material-icons-round text-blue-500 text-3xl">local_fire_department</span>
                            Trending in TFI
                        </h1>
                        <p className="text-slate-400 mt-1">Live updates from Twitter, YouTube, and the Web</p>
                    </div>
                    <button 
                        onClick={() => { setLoading(true); fetchLiveFeed().then(d => { setFeedItems(d); setLoading(false); }); }}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <span className={`material-icons-round text-sm ${loading ? 'animate-spin' : ''}`}>refresh</span>
                        Refresh Feed
                    </button>
                 </div>

                 {/* Tags / Chips Row */}
                 <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mask-gradient-r">
                     {['#Prabhas', '#GameChanger', '#SSMB29', '#Pushpa2', '#Devara', '#TFI'].map(tag => (
                         <span key={tag} className="px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-sm hover:border-slate-600 hover:text-white cursor-pointer transition-colors whitespace-nowrap">
                             {tag}
                         </span>
                     ))}
                 </div>
            </div>

            <div className="max-w-5xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Loading Skeletons */}
                {loading && [1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="bg-slate-900 rounded-2xl h-64 animate-pulse border border-slate-800 flex flex-col p-4">
                        <div className="w-1/3 h-4 bg-slate-800 rounded mb-4"></div>
                        <div className="w-full h-32 bg-slate-800 rounded mb-4"></div>
                        <div className="w-2/3 h-4 bg-slate-800 rounded"></div>
                    </div>
                ))}

                {/* Feed Cards */}
                {!loading && feedItems.map((item, idx) => (
                    <a 
                        key={idx} 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-600 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative"
                    >
                        <div className="p-6 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <span className={`material-icons-round text-sm ${getSourceStyle(item.source)}`}>
                                        {getSourceIcon(item.source)}
                                    </span>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.source}</span>
                                </div>
                                <span className="text-[10px] text-slate-600 font-mono">{item.timestamp}</span>
                            </div>

                            <h3 className="text-lg font-bold text-slate-100 leading-snug mb-3 group-hover:text-blue-400 transition-colors line-clamp-3">
                                {item.title}
                            </h3>
                            
                            <p className="text-sm text-slate-400 line-clamp-3 mb-4 flex-grow">
                                {item.summary}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-800/50">
                                {item.hashtags?.slice(0, 3).map(tag => (
                                    <span key={tag} className="text-[10px] text-blue-400/80 bg-blue-500/5 px-2 py-1 rounded-md">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        
                        {/* External Link Icon Overlay */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="material-icons-round text-slate-400 text-sm transform -rotate-45">arrow_forward</span>
                        </div>
                    </a>
                ))}

                {!loading && feedItems.length === 0 && (
                    <div className="col-span-full text-center py-20">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                             <span className="material-icons-round text-3xl text-slate-600">wifi_off</span>
                        </div>
                        <h3 className="text-slate-400 font-bold text-lg">No Live Updates</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">Could not fetch the latest buzz. Thammudu might be sleeping.</p>
                        <button onClick={() => window.location.reload()} className="mt-4 text-blue-500 hover:underline text-sm">Try Again</button>
                    </div>
                )}
            </div>
            
            <div className="text-center py-8 text-slate-700 text-[10px] font-mono uppercase tracking-widest">
                Aggregated via Google Search • Powered by Gemini
            </div>
        </div>
    );
}

export default LiveHub;