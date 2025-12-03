
import React, { useState } from 'react';
import { MediaItem } from '../types';

const MOCK_MEDIA: MediaItem[] = [
    { id: '1', title: 'Game Changer - Official Teaser', type: 'TRAILER', thumbnailUrl: 'https://img.youtube.com/vi/VzZ2F-hZk5g/maxresdefault.jpg', videoUrl: 'https://youtube.com', duration: '1:45', views: '25M', hero: 'Ram Charan' },
    { id: '2', title: 'Pushpa 2 - The Rule Trailer', type: 'TRAILER', thumbnailUrl: 'https://img.youtube.com/vi/Q1NKMPhP8PY/maxresdefault.jpg', videoUrl: 'https://youtube.com', duration: '2:30', views: '45M', hero: 'Allu Arjun' },
    { id: '3', title: 'Devara - Fear Song Lyrical', type: 'SONG', thumbnailUrl: 'https://img.youtube.com/vi/5d9Xw3fJj9c/maxresdefault.jpg', videoUrl: 'https://youtube.com', duration: '4:10', views: '15M', hero: 'NTR' },
    { id: '4', title: 'Kalki 2898 AD - Making Video', type: 'INTERVIEW', thumbnailUrl: 'https://img.youtube.com/vi/bsP3jF0tFhY/maxresdefault.jpg', videoUrl: 'https://youtube.com', duration: '5:00', views: '5M', hero: 'Prabhas' },
    { id: '5', title: 'OG - Glimpse Fan Edit', type: 'FAN_EDIT', thumbnailUrl: 'https://img.youtube.com/vi/3wDiqKzG6zI/maxresdefault.jpg', videoUrl: 'https://youtube.com', duration: '0:50', views: '1M', hero: 'Pawan Kalyan' },
];

const MediaHub: React.FC = () => {
    const [filter, setFilter] = useState<'ALL' | 'TRAILER' | 'SONG' | 'INTERVIEW'>('ALL');
    const [playing, setPlaying] = useState<MediaItem | null>(null);

    const filteredMedia = filter === 'ALL' ? MOCK_MEDIA : MOCK_MEDIA.filter(m => m.type === filter);

    return (
        <div className="h-full bg-slate-950 p-6 lg:p-8 overflow-y-auto">
            
            {/* Header & Tabs */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="material-icons-round text-red-500">play_circle_filled</span>
                        TFI Watch Party
                    </h1>
                    <p className="text-slate-500 text-sm">Curated trailers, songs, and interviews</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                    {['ALL', 'TRAILER', 'SONG', 'INTERVIEW'].map(t => (
                        <button
                            key={t}
                            onClick={() => setFilter(t as any)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                filter === t 
                                ? 'bg-slate-800 text-white shadow-sm' 
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMedia.map(item => (
                    <div 
                        key={item.id} 
                        onClick={() => setPlaying(item)}
                        className="group bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-slate-600 transition-all cursor-pointer relative"
                    >
                        {/* Thumbnail */}
                        <div className="aspect-video bg-slate-800 relative">
                             {/* Fallback image logic simulated by using standard YT thumbnail url structure */}
                             <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                 <span className="material-icons-round text-5xl text-red-600 drop-shadow-lg scale-90 group-hover:scale-100 transition-transform">play_arrow</span>
                             </div>
                             <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                 {item.duration}
                             </span>
                        </div>
                        
                        {/* Content */}
                        <div className="p-4">
                            <h3 className="text-sm font-bold text-slate-100 line-clamp-2 leading-tight mb-2 group-hover:text-blue-400 transition-colors">
                                {item.title}
                            </h3>
                            <div className="flex justify-between items-center text-[10px] text-slate-500">
                                <span>{item.hero}</span>
                                <span className="flex items-center gap-1">
                                    <span className="material-icons-round text-[10px]">visibility</span>
                                    {item.views}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Video Player Modal Overlay (Simulation) */}
            {playing && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in">
                    <div className="w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
                        <div className="aspect-video bg-black relative">
                            {/* Placeholder for iframe */}
                            <div className="absolute inset-0 flex items-center justify-center text-slate-500 flex-col gap-4">
                                <span className="material-icons-round text-6xl">play_circle_outline</span>
                                <p>Playing: {playing.title}</p>
                                <p className="text-xs">(Video Embed Placeholder)</p>
                            </div>
                        </div>
                        <div className="p-4 flex justify-between items-center border-t border-slate-800">
                             <div>
                                 <h3 className="font-bold text-white">{playing.title}</h3>
                                 <p className="text-xs text-slate-500">{playing.views} Views • {playing.hero}</p>
                             </div>
                             <div className="flex gap-4">
                                 <button className="flex items-center gap-2 text-slate-400 hover:text-white">
                                     <span className="material-icons-round">share</span>
                                 </button>
                                 <button 
                                    onClick={() => setPlaying(null)} 
                                    className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-bold text-xs"
                                 >
                                     Close
                                 </button>
                             </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MediaHub;
