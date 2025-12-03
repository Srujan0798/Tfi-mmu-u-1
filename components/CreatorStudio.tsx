
import React from 'react';

const CreatorStudio: React.FC = () => {
    return (
        <div className="h-full bg-slate-950 p-6 lg:p-8 overflow-y-auto text-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="material-icons-round text-blue-500">movie_creation</span>
                        Creator Studio
                    </h1>
                    <p className="text-slate-500 text-sm">Manage your timeline, events, and analytics</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-700">
                        <span className="material-icons-round">upload</span> Bulk Import
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-500 shadow-lg shadow-blue-500/20">
                        <span className="material-icons-round">add</span> New Event
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                    <div className="text-xs text-slate-500 uppercase font-bold mb-1">Total Followers</div>
                    <div className="text-2xl font-bold text-white">25.4K</div>
                    <div className="text-xs text-green-500 flex items-center gap-1 mt-1">
                        <span className="material-icons-round text-xs">trending_up</span> +12% this week
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                    <div className="text-xs text-slate-500 uppercase font-bold mb-1">Event Views</div>
                    <div className="text-2xl font-bold text-white">1.2M</div>
                    <div className="text-xs text-green-500 flex items-center gap-1 mt-1">
                        <span className="material-icons-round text-xs">trending_up</span> +5% this week
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                    <div className="text-xs text-slate-500 uppercase font-bold mb-1">Sync Rate</div>
                    <div className="text-2xl font-bold text-white">45%</div>
                    <div className="text-xs text-slate-500 mt-1">Users syncing your calendar</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Est. Earnings</div>
                        <div className="text-2xl font-bold text-yellow-500">₹12,450</div>
                        <div className="text-xs text-slate-500 mt-1">Pending payout</div>
                    </div>
                    <span className="material-icons-round absolute -bottom-4 -right-4 text-6xl text-yellow-500/10">monetization_on</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Event Management */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="font-bold text-white mb-4">Recent Events</h3>
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead>
                                <tr className="border-b border-slate-800">
                                    <th className="pb-2 font-semibold">Event Title</th>
                                    <th className="pb-2 font-semibold">Date</th>
                                    <th className="pb-2 font-semibold">Status</th>
                                    <th className="pb-2 font-semibold text-right">Reach</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                <tr className="group hover:bg-slate-800/50">
                                    <td className="py-3 font-medium text-slate-200">Devara Success Meet</td>
                                    <td className="py-3">Oct 12, 2024</td>
                                    <td className="py-3"><span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded uppercase font-bold">Live</span></td>
                                    <td className="py-3 text-right">45k</td>
                                </tr>
                                <tr className="group hover:bg-slate-800/50">
                                    <td className="py-3 font-medium text-slate-200">Pushpa 2 Trailer Launch</td>
                                    <td className="py-3">Nov 15, 2024</td>
                                    <td className="py-3"><span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded uppercase font-bold">Scheduled</span></td>
                                    <td className="py-3 text-right">--</td>
                                </tr>
                                <tr className="group hover:bg-slate-800/50">
                                    <td className="py-3 font-medium text-slate-200">OG Glimpse Breakdown</td>
                                    <td className="py-3">Sep 02, 2024</td>
                                    <td className="py-3"><span className="bg-slate-700/50 text-slate-400 text-[10px] px-2 py-0.5 rounded uppercase font-bold">Past</span></td>
                                    <td className="py-3 text-right">120k</td>
                                </tr>
                            </tbody>
                        </table>
                        <button className="w-full mt-4 py-2 border border-slate-700 rounded-lg text-slate-400 text-xs font-bold hover:bg-slate-800 transition-colors">
                            View All Events
                        </button>
                    </div>

                    {/* Analytics Chart Placeholder */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-64 flex flex-col justify-center items-center text-slate-500">
                        <span className="material-icons-round text-4xl mb-2 opacity-50">bar_chart</span>
                        <p className="text-sm">Engagement Analytics Visualization</p>
                        <p className="text-xs">(Chart.js Integration)</p>
                    </div>
                </div>

                {/* Sidebar Tools */}
                <div className="space-y-6">
                    
                    {/* Monetization */}
                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-500/30 rounded-xl p-6">
                        <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                            <span className="material-icons-round text-yellow-500">star</span>
                            Creator Pro
                        </h3>
                        <p className="text-xs text-slate-400 mb-4">You are on the Pro Tier. Next payout is on Dec 1st.</p>
                        
                        <div className="space-y-2">
                            <button className="w-full bg-slate-800/50 hover:bg-slate-800 p-3 rounded-lg flex items-center gap-3 text-sm text-slate-200 transition-colors">
                                <span className="material-icons-round text-slate-500">store</span>
                                Merchandise Store
                            </button>
                            <button className="w-full bg-slate-800/50 hover:bg-slate-800 p-3 rounded-lg flex items-center gap-3 text-sm text-slate-200 transition-colors">
                                <span className="material-icons-round text-slate-500">campaign</span>
                                Brand Collabs
                            </button>
                             <button className="w-full bg-slate-800/50 hover:bg-slate-800 p-3 rounded-lg flex items-center gap-3 text-sm text-slate-200 transition-colors">
                                <span className="material-icons-round text-slate-500">settings</span>
                                Payout Settings
                            </button>
                        </div>
                    </div>

                    {/* Verification */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
                         <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                             <span className="material-icons-round">verified</span>
                         </div>
                         <h4 className="text-white font-bold text-sm">Verified Account</h4>
                         <p className="text-xs text-slate-500 mt-1">Your content is prioritized in the Discovery feed.</p>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default CreatorStudio;
