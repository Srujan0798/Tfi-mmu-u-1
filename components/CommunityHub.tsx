
import React, { useState } from 'react';
import { ForumThread } from '../types';

const MOCK_THREADS: ForumThread[] = [
    { id: '1', title: 'Salaar 2 Predictions - Will it cross 2000cr?', author: 'PrabhasFan_01', replies: 342, views: 15000, lastActive: '2m ago', tags: ['Prediction', 'Box Office'], isTrending: true },
    { id: '2', title: 'SSMB29 Genre Speculation - Globe Trotting Action?', author: 'MaheshBabuCult', replies: 120, views: 5400, lastActive: '10m ago', tags: ['SSMB29', 'Rumor'] },
    { id: '3', title: 'Best Anirudh BGM so far in TFI?', author: 'MusicalTFI', replies: 85, views: 3200, lastActive: '1h ago', tags: ['Music', 'Discussion'] },
    { id: '4', title: 'Game Changer Release Date Confusion', author: 'MegaPower', replies: 450, views: 22000, lastActive: '5m ago', tags: ['News', 'Release'], isTrending: true },
];

const CommunityHub: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'DISCUSSIONS' | 'GROUPS' | 'MEETUPS'>('DISCUSSIONS');

    return (
        <div className="h-full bg-slate-950 p-6 lg:p-8 overflow-y-auto text-slate-200">
             {/* Header */}
             <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="material-icons-round text-indigo-500">forum</span>
                        TFI Community
                    </h1>
                    <p className="text-slate-500 text-sm">Discussions, Fan Groups, and Meetups</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                    {['DISCUSSIONS', 'GROUPS', 'MEETUPS'].map(t => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t as any)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                activeTab === t 
                                ? 'bg-indigo-600 text-white shadow-sm' 
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'DISCUSSIONS' && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Thread List */}
                    <div className="lg:col-span-3 space-y-4">
                        <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
                            {['All', 'News', 'Box Office', 'Rumors', 'Reviews'].map(tag => (
                                <button key={tag} className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs text-slate-400 hover:border-slate-600 hover:text-white transition-colors">
                                    {tag}
                                </button>
                            ))}
                        </div>

                        {MOCK_THREADS.map(thread => (
                            <div key={thread.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-600 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex gap-2">
                                        {thread.tags.map(tag => (
                                            <span key={tag} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase font-bold">{tag}</span>
                                        ))}
                                    </div>
                                    <span className="text-xs text-slate-500">{thread.lastActive}</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-200 group-hover:text-blue-400 mb-2 flex items-center gap-2">
                                    {thread.isTrending && <span className="material-icons-round text-red-500 text-sm" title="Trending">whatshot</span>}
                                    {thread.title}
                                </h3>
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                    <span className="flex items-center gap-1"><span className="material-icons-round text-sm">person</span> {thread.author}</span>
                                    <span className="flex items-center gap-1"><span className="material-icons-round text-sm">chat_bubble</span> {thread.replies} replies</span>
                                    <span className="flex items-center gap-1"><span className="material-icons-round text-sm">visibility</span> {thread.views} views</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20">
                            <span className="material-icons-round">add_comment</span>
                            Start Discussion
                        </button>

                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                            <h4 className="font-bold text-white text-sm mb-3">Popular Tags</h4>
                            <div className="flex flex-wrap gap-2">
                                {['#Prabhas', '#SSR', '#Music', '#Collections', '#USA_Premiere'].map(t => (
                                    <span key={t} className="text-xs text-slate-400 hover:text-indigo-400 cursor-pointer">{t}</span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                            <h4 className="font-bold text-white text-sm mb-3">Top Contributors</h4>
                            <div className="space-y-3">
                                {[1,2,3].map(i => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500"></div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-200">User_{i}</div>
                                            <div className="text-[10px] text-slate-500">1.2k posts</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'GROUPS' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['Prabhas Cults', 'Mega Fans Association', 'Nandamuri Vamsam', 'DHFM - Mahesh Babu', 'Rowdy Boys'].map((g, i) => (
                        <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center hover:border-slate-600 transition-colors">
                            <div className="w-16 h-16 rounded-full bg-slate-800 mx-auto mb-4 flex items-center justify-center">
                                <span className="material-icons-round text-3xl text-slate-600">group</span>
                            </div>
                            <h3 className="font-bold text-white text-lg mb-1">{g}</h3>
                            <p className="text-xs text-slate-500 mb-4">12k Members • 50 posts/day</p>
                            <button className="bg-slate-800 text-blue-400 px-4 py-1.5 rounded-full text-sm font-bold hover:bg-slate-700">Join Group</button>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'MEETUPS' && (
                <div className="text-center py-20 text-slate-500">
                    <span className="material-icons-round text-5xl mb-4 opacity-50">location_on</span>
                    <h3 className="text-xl font-bold text-slate-300">No Meetups Nearby</h3>
                    <p>Be the first to organize a fan gathering in your city!</p>
                    <button className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold">Host a Meetup</button>
                </div>
            )}
        </div>
    );
};

export default CommunityHub;
