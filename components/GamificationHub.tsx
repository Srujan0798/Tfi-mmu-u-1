
import React, { useState } from 'react';
import { Achievement, Reward } from '../types';

const MOCK_ACHIEVEMENTS: Achievement[] = [
    { id: '1', title: 'First Day First Show', description: 'Added a Release event on opening day', icon: 'theaters', xp: 500, isUnlocked: true },
    { id: '2', title: 'TFI Encyclopedia', description: 'Add 50 events to your calendar', icon: 'history_edu', xp: 1000, isUnlocked: false, progress: 12, total: 50 },
    { id: '3', title: 'Social Butterfly', description: 'Sync with 5 Creator Timelines', icon: 'group_add', xp: 300, isUnlocked: true },
    { id: '4', title: 'Oracle', description: 'Get 5 AI Predictions correct', icon: 'visibility', xp: 2000, isUnlocked: false, progress: 1, total: 5 },
    { id: '5', title: 'Loyal Fan', description: 'Open the app 7 days in a row', icon: 'local_fire_department', xp: 150, isUnlocked: false, progress: 3, total: 7 },
];

const MOCK_REWARDS: Reward[] = [
    { id: 'r1', title: 'BookMyShow ₹100 Off', cost: 2000, type: 'VOUCHER', icon: 'confirmation_number' },
    { id: 'r2', title: 'Pro Theme Pack', cost: 5000, type: 'FEATURE', icon: 'palette' },
    { id: 'r3', title: 'Verified Fan Badge', cost: 10000, type: 'BADGE', icon: 'verified' },
];

const GamificationHub: React.FC = () => {
    const [xp] = useState(3450);
    const [level] = useState(4);
    const [activeTab, setActiveTab] = useState<'STATS' | 'CHALLENGES'>('STATS');
    
    const nextLevelXp = 5000;
    const progressPercent = (xp / nextLevelXp) * 100;

    return (
        <div className="h-full bg-slate-950 p-6 lg:p-8 overflow-y-auto text-slate-200">
            {/* Header / Stats */}
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl p-8 mb-8 border border-indigo-500/30 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-10 opacity-10">
                    <span className="material-icons-round text-9xl text-white">emoji_events</span>
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <span className="bg-yellow-500 text-slate-900 font-black px-3 py-1 rounded text-xs uppercase tracking-widest">Level {level}</span>
                            <h1 className="text-3xl font-bold text-white">Super Fan</h1>
                        </div>
                        
                        <div className="max-w-xl">
                            <div className="flex justify-between text-sm mb-2 font-bold text-indigo-200">
                                <span>{xp} XP</span>
                                <span>{nextLevelXp} XP</span>
                            </div>
                            <div className="h-4 bg-black/40 rounded-full overflow-hidden backdrop-blur-sm border border-white/10 w-64 md:w-96">
                                <div 
                                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-[0_0_15px_rgba(251,191,36,0.5)]" 
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-indigo-300 mt-2">Earn 1,550 more XP to become a "Mega Fan"!</p>
                        </div>
                    </div>
                    <div className="flex bg-indigo-950/50 p-1 rounded-lg border border-indigo-500/30">
                         <button 
                            onClick={() => setActiveTab('STATS')}
                            className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${activeTab === 'STATS' ? 'bg-indigo-500 text-white' : 'text-indigo-300 hover:text-white'}`}
                        >
                             Achievements
                         </button>
                         <button 
                            onClick={() => setActiveTab('CHALLENGES')}
                            className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${activeTab === 'CHALLENGES' ? 'bg-indigo-500 text-white' : 'text-indigo-300 hover:text-white'}`}
                        >
                             Daily Challenges
                         </button>
                    </div>
                </div>
            </div>

            {activeTab === 'STATS' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Achievements */}
                    <div>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="material-icons-round text-yellow-500">military_tech</span>
                            Achievements
                        </h2>
                        <div className="space-y-4">
                            {MOCK_ACHIEVEMENTS.map(ach => (
                                <div key={ach.id} className={`bg-slate-900 border ${ach.isUnlocked ? 'border-yellow-500/30 bg-yellow-900/10' : 'border-slate-800'} rounded-xl p-4 flex items-center gap-4`}>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${ach.isUnlocked ? 'bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/20' : 'bg-slate-800 text-slate-600'}`}>
                                        <span className="material-icons-round text-2xl">{ach.icon}</span>
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className={`font-bold ${ach.isUnlocked ? 'text-white' : 'text-slate-500'}`}>{ach.title}</h3>
                                        <p className="text-xs text-slate-400">{ach.description}</p>
                                        {!ach.isUnlocked && ach.total && (
                                            <div className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden w-32">
                                                <div className="h-full bg-slate-600" style={{ width: `${(ach.progress! / ach.total) * 100}%` }}></div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-sm font-bold ${ach.isUnlocked ? 'text-yellow-500' : 'text-slate-600'}`}>+{ach.xp} XP</span>
                                        {ach.isUnlocked && <span className="block material-icons-round text-green-500 text-lg">check_circle</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rewards Store */}
                    <div>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="material-icons-round text-purple-400">storefront</span>
                            Rewards Store
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {MOCK_REWARDS.map(reward => (
                                <div key={reward.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between group hover:border-purple-500/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-purple-900/20 text-purple-400 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <span className="material-icons-round text-2xl">{reward.icon}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-200">{reward.title}</h3>
                                            <span className="text-xs text-purple-400 font-mono bg-purple-900/30 px-2 py-0.5 rounded">{reward.type}</span>
                                        </div>
                                    </div>
                                    <button 
                                        className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1 ${xp >= reward.cost ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                                        disabled={xp < reward.cost}
                                    >
                                        {reward.cost} XP
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Leaderboard Teaser */}
                        <div className="mt-8 bg-slate-800/50 rounded-xl p-6 text-center border border-slate-700 border-dashed">
                            <span className="material-icons-round text-4xl text-slate-600 mb-2">leaderboard</span>
                            <h3 className="text-slate-300 font-bold">Global Leaderboard</h3>
                            <p className="text-xs text-slate-500 mb-4">Compete with other TFI fans worldwide.</p>
                            <button className="text-blue-400 text-sm font-bold hover:underline">View Rankings</button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'CHALLENGES' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                     {[
                         { title: 'Prediction Master', desc: 'Predict 3 box office openings correctly this week.', reward: 500, progress: 1, total: 3, type: 'WEEKLY' },
                         { title: 'Trailer Watch', desc: 'Watch the new Pushpa 2 trailer.', reward: 50, progress: 0, total: 1, type: 'DAILY' },
                         { title: 'Quiz Whiz', desc: 'Answer 5 trivia questions.', reward: 100, progress: 2, total: 5, type: 'DAILY' }
                     ].map((c, i) => (
                         <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center gap-4">
                             <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-blue-900/20 text-blue-400`}>
                                 <span className="material-icons-round text-xl">bolt</span>
                             </div>
                             <div className="flex-grow">
                                 <div className="flex justify-between items-start mb-1">
                                     <h3 className="font-bold text-white">{c.title}</h3>
                                     <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-bold">{c.type}</span>
                                 </div>
                                 <p className="text-xs text-slate-400 mb-3">{c.desc}</p>
                                 <div className="flex items-center gap-3">
                                     <div className="flex-grow h-2 bg-slate-800 rounded-full overflow-hidden">
                                         <div className="h-full bg-blue-500" style={{ width: `${(c.progress / c.total) * 100}%` }}></div>
                                     </div>
                                     <span className="text-xs font-bold text-slate-500">{c.progress}/{c.total}</span>
                                 </div>
                             </div>
                             <div className="text-right min-w-[60px]">
                                 <div className="text-yellow-500 font-bold text-sm">+{c.reward}</div>
                                 <div className="text-[10px] text-slate-600 uppercase">XP</div>
                             </div>
                         </div>
                     ))}
                </div>
            )}
        </div>
    );
};

export default GamificationHub;
