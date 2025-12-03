
import React from 'react';
import { UserPreferences, TFIEvent } from '../types';

interface ProfileViewProps {
    preferences: UserPreferences | null;
    userEvents: TFIEvent[];
}

const ProfileView: React.FC<ProfileViewProps> = ({ preferences, userEvents }) => {
    // Analytics Calculations
    const totalEvents = userEvents.length;
    const moviesWatched = userEvents.filter(e => e.rating && e.rating > 0).length;
    
    // Genre/Hero Distribution (Simple Simulation)
    const heroCounts: {[key: string]: number} = {};
    userEvents.forEach(e => {
        if (e.hero) heroCounts[e.hero] = (heroCounts[e.hero] || 0) + 1;
    });
    const topHero = Object.entries(heroCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || 'TFI Fan';

    // Activity Heatmap (Simulated last 4 weeks)
    const heatmapDays = Array.from({length: 28}, (_, i) => i);

    return (
        <div className="h-full bg-slate-950 overflow-y-auto p-6 lg:p-10 text-slate-200">
            
            {/* Header / Identity */}
            <div className="flex flex-col md:flex-row items-center gap-6 mb-10 bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-3xl border border-slate-700/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 p-1 shadow-2xl relative">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                        <span className="material-icons-round text-4xl text-yellow-500">person</span>
                    </div>
                    {/* Level Badge */}
                    <div className="absolute -bottom-2 -right-2 bg-slate-900 rounded-full p-1 border border-slate-700">
                        <div className="bg-yellow-500 text-slate-900 text-[10px] font-black w-8 h-8 rounded-full flex items-center justify-center">
                            LVL4
                        </div>
                    </div>
                </div>
                
                <div className="text-center md:text-left z-10">
                    <div className="flex items-center gap-3 justify-center md:justify-start mb-1">
                        <h1 className="text-3xl font-bold text-white">Guest User</h1>
                        <span className="bg-yellow-500 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Premium</span>
                    </div>
                    <p className="text-slate-400 mb-4">@{topHero.toLowerCase().replace(' ', '_')}_cult • Joined Dec 2024</p>
                    <div className="flex gap-3 justify-center md:justify-start">
                        <span className="px-3 py-1 rounded-full bg-slate-700/50 border border-slate-600 text-xs font-semibold">{preferences?.favoriteHeroes[0] || 'Cinema'} Lover</span>
                        <span className="px-3 py-1 rounded-full bg-slate-700/50 border border-slate-600 text-xs font-semibold">Critic</span>
                    </div>
                </div>

                <div className="md:ml-auto flex gap-6 text-center z-10">
                    <div>
                        <div className="text-2xl font-bold text-white">{totalEvents}</div>
                        <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Events</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{moviesWatched}</div>
                        <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Watched</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-yellow-500">3450</div>
                        <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Fan XP</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Analytics Card */}
                <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <span className="material-icons-round text-blue-500">insights</span>
                        Personal Analytics
                    </h3>
                    
                    <div className="space-y-6">
                        {/* Heatmap */}
                        <div>
                            <div className="flex justify-between text-xs text-slate-500 mb-2 uppercase font-bold tracking-wider">
                                <span>Activity Heatmap</span>
                                <span>Last 30 Days</span>
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {heatmapDays.map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={`h-4 rounded-sm ${Math.random() > 0.7 ? 'bg-green-500' : Math.random() > 0.4 ? 'bg-green-900' : 'bg-slate-800'}`}
                                    ></div>
                                ))}
                            </div>
                        </div>

                        {/* Top Hero Progress */}
                        <div>
                             <div className="flex justify-between text-sm mb-1">
                                <span className="font-semibold text-slate-300">Top Star: {topHero}</span>
                                <span className="text-slate-500">75%</span>
                             </div>
                             <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                 <div className="h-full bg-blue-500 w-3/4 rounded-full"></div>
                             </div>
                        </div>

                         {/* Genre Distribution */}
                         <div>
                             <div className="flex justify-between text-sm mb-1">
                                <span className="font-semibold text-slate-300">Genre: Action/Mass</span>
                                <span className="text-slate-500">60%</span>
                             </div>
                             <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                 <div className="h-full bg-red-500 w-3/5 rounded-full"></div>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Settings Card */}
                    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <span className="material-icons-round text-slate-400">tune</span>
                            Preferences & Settings
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="material-icons-round text-slate-500">notifications</span>
                                    <div>
                                        <div className="text-sm font-semibold text-slate-200">Push Notifications</div>
                                        <div className="text-[10px] text-slate-500">Releases, Rumors</div>
                                    </div>
                                </div>
                                <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="material-icons-round text-slate-500">palette</span>
                                    <div>
                                        <div className="text-sm font-semibold text-slate-200">App Theme</div>
                                        <div className="text-[10px] text-slate-500">Midnight Blue (Default)</div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-4 h-4 rounded-full bg-slate-900 border border-white cursor-pointer"></div>
                                    <div className="w-4 h-4 rounded-full bg-black border border-slate-700 cursor-pointer"></div>
                                    <div className="w-4 h-4 rounded-full bg-red-900 border border-slate-700 cursor-pointer"></div>
                                </div>
                            </div>
                            
                            <div className="p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg mt-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-icons-round text-yellow-500 text-sm">diamond</span>
                                    <span className="text-sm font-bold text-yellow-500">TFI Gold Membership</span>
                                </div>
                                <p className="text-xs text-slate-400 mb-3">Unlock AI predictions, unlimited syncs, and early access tickets.</p>
                                <button className="w-full py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded text-xs transition-colors">
                                    Upgrade Now - ₹99/mo
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Privacy & Security Card */}
                    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                         <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <span className="material-icons-round text-red-400">shield</span>
                            Privacy & Security
                        </h3>
                        <div className="space-y-3">
                            <button className="w-full text-left p-3 rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors flex justify-between items-center group">
                                <div>
                                    <div className="text-sm font-bold text-slate-200">Export My Data</div>
                                    <div className="text-[10px] text-slate-500">Download a copy of your events and preferences</div>
                                </div>
                                <span className="material-icons-round text-slate-500 group-hover:text-blue-400">download</span>
                            </button>
                            
                            <button className="w-full text-left p-3 rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors flex justify-between items-center group">
                                <div>
                                    <div className="text-sm font-bold text-slate-200">2-Factor Authentication</div>
                                    <div className="text-[10px] text-slate-500">Secure your account with OTP</div>
                                </div>
                                <span className="material-icons-round text-slate-500 group-hover:text-green-400">toggle_off</span>
                            </button>

                            <button className="w-full text-left p-3 rounded-lg border border-red-900/30 hover:bg-red-900/20 transition-colors flex justify-between items-center group mt-4">
                                <div>
                                    <div className="text-sm font-bold text-red-400">Delete Account</div>
                                    <div className="text-[10px] text-red-400/60">Permanently remove all data</div>
                                </div>
                                <span className="material-icons-round text-red-500 group-hover:text-red-400">delete_forever</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfileView;
