
import React, { useState } from 'react';
import { ApiKey, RoadmapPhase, TaskStatus } from '../types';

const MOCK_KEYS: ApiKey[] = [
    { key: 'tfi_live_8374928374', name: 'My Personal App', created: new Date('2024-01-15'), status: 'ACTIVE', lastUsed: new Date() },
];

const SERVICE_STATUS = [
    { name: 'API Gateway (Kong)', status: 'OPERATIONAL', uptime: '99.99%', load: '12%' },
    { name: 'User Service (Node.js)', status: 'OPERATIONAL', uptime: '99.95%', load: '45%' },
    { name: 'Event Service (Node.js)', status: 'OPERATIONAL', uptime: '99.90%', load: '32%' },
    { name: 'AI Service (Python/FastAPI)', status: 'OPERATIONAL', uptime: '99.80%', load: '78%' },
    { name: 'Scraper Service (Python)', status: 'MAINTENANCE', uptime: '98.50%', load: '0%' },
    { name: 'Notification Service', status: 'OPERATIONAL', uptime: '99.99%', load: '5%' },
];

const DATABASES = [
    { name: 'PostgreSQL (Primary)', status: 'HEALTHY', size: '45 GB' },
    { name: 'MongoDB (Scraped Data)', status: 'HEALTHY', size: '120 GB' },
    { name: 'Redis (Cache)', status: 'HEALTHY', size: '1.2 GB' },
    { name: 'Elasticsearch', status: 'HEALTHY', size: '15 GB' },
];

const INITIAL_ROADMAP: RoadmapPhase[] = [
    {
        id: 'phase0',
        title: 'Phase 0: Planning & Setup',
        timeline: 'Weeks 1-4',
        progress: 100,
        tasks: [
            { id: '1.1', title: 'Conduct user interviews (50 TFI fans)', status: 'DONE' },
            { id: '1.2', title: 'Competitive analysis', status: 'DONE' },
            { id: '2.1', title: 'Brand identity & Logo design', status: 'DONE' },
            { id: '3.1', title: 'Wireframing & UI Mockups', status: 'DONE' },
            { id: '4.1', title: 'Architecture design (Microservices)', status: 'DONE' },
        ]
    },
    {
        id: 'phase1',
        title: 'Phase 1: MVP Development',
        timeline: 'Months 2-5',
        progress: 100,
        tasks: [
            { id: '5.1', title: 'Project Initialization (Monorepo)', status: 'DONE' },
            { id: '5.2', title: 'Database Setup (Postgres/Mongo)', status: 'DONE' },
            { id: '6.1', title: 'Calendar Core: Event Model', status: 'DONE' },
            { id: '7.1', title: 'Mobile App Foundation (React Native)', status: 'DONE' },
            { id: '8.1', title: 'Calendar UI (Month/Week/Day Views)', status: 'DONE' },
            { id: '9.1', title: 'Social: Following System', status: 'DONE' },
        ]
    },
    {
        id: 'phase2',
        title: 'Phase 2: AI & Automation',
        timeline: 'Months 5-6',
        progress: 80,
        tasks: [
            { id: '11.1', title: 'AI Service Setup (Gemini/Anthropic)', status: 'DONE' },
            { id: '11.3', title: 'Web Scraper Service', status: 'IN_PROGRESS' },
            { id: '12.1', title: 'AI Chat Interface & Persona', status: 'DONE' },
            { id: '12.2', title: 'Smart Recommendation Engine', status: 'IN_PROGRESS' },
        ]
    },
    {
        id: 'phase3',
        title: 'Phase 3: Premium & Monetization',
        timeline: 'Months 10-12',
        progress: 60,
        tasks: [
            { id: '21.1', title: 'Stripe Integration', status: 'IN_PROGRESS' },
            { id: '23.1', title: 'Creator Studio Dashboard', status: 'DONE' },
            { id: '25.1', title: 'BookMyShow API Integration', status: 'PENDING' },
        ]
    },
    {
        id: 'phase4',
        title: 'Phase 4: Community & Gamification',
        timeline: 'Months 13-15',
        progress: 40,
        tasks: [
            { id: '27.1', title: 'Forums & Discussion Threads', status: 'DONE' },
            { id: '29.1', title: 'Achievement System Engine', status: 'DONE' },
            { id: '31.1', title: 'Multi-language (Telugu/English)', status: 'DONE' },
        ]
    },
    {
        id: 'phase5',
        title: 'Phase 5: Scaling & Optimization',
        timeline: 'Months 16-18',
        progress: 15,
        tasks: [
            // Month 16: Performance
            { id: '33.1', title: 'Frontend Code Splitting & Lazy Loading', status: 'IN_PROGRESS' },
            { id: '33.2', title: 'Asset Optimization (Image/Video CDN)', status: 'IN_PROGRESS' },
            { id: '33.3', title: 'Service Worker & Offline Caching', status: 'PENDING' },
            { id: '34.1', title: 'Database Query Optimization', status: 'PENDING' },
            { id: '34.3', title: 'Redis Caching Layer', status: 'PENDING' },
            
            // Month 17: Advanced AI
            { id: '35.1', title: 'Predictive Features (Box Office/Trends)', status: 'IN_PROGRESS' },
            { id: '35.2', title: 'Auto-Content Generation (Summaries)', status: 'DONE' },
            { id: '35.3', title: 'Image AI (Poster OCR & Analysis)', status: 'DONE' },
            { id: '36.1', title: 'Multi-source Scraping (20+ sites)', status: 'PENDING' },
            
            // Month 18: Web & Desktop
            { id: '37.1', title: 'PWA Installation & SEO', status: 'PENDING' },
            { id: '38.1', title: 'Desktop App (Electron Setup)', status: 'PENDING' },
            { id: '38.3', title: 'Distribution (Windows/Mac Installers)', status: 'PENDING' },
        ]
    }
];

const DeveloperTools: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'CONSOLE' | 'ARCHITECTURE' | 'ROADMAP' | 'PERFORMANCE'>('CONSOLE');
    const [keys, setKeys] = useState<ApiKey[]>(MOCK_KEYS);
    const [roadmap, setRoadmap] = useState<RoadmapPhase[]>(INITIAL_ROADMAP);
    const [logs, setLogs] = useState<string[]>([
        '[INFO] Scraper initialized for 123Telugu',
        '[INFO] Webhook ping sent to endpoint',
        '[WARN] Rate limit approaching for /events'
    ]);

    const generateKey = () => {
        const newKey: ApiKey = {
            key: `tfi_live_${Math.floor(Math.random() * 1000000000)}`,
            name: 'New Project',
            created: new Date(),
            status: 'ACTIVE'
        };
        setKeys([...keys, newKey]);
        addLog(`[SUCCESS] Generated new API Key: ${newKey.key.substring(0, 10)}...`);
    };

    const addLog = (msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
    };

    const handleExport = () => {
        addLog('[INFO] Exporting user data to JSON...');
        setTimeout(() => addLog('[SUCCESS] Export complete. Download started.'), 1000);
    };

    const toggleTaskStatus = (phaseId: string, taskId: string) => {
        setRoadmap(prev => prev.map(phase => {
            if (phase.id !== phaseId) return phase;
            const updatedTasks = phase.tasks.map(t => {
                if (t.id !== taskId) return t;
                const nextStatus: Record<TaskStatus, TaskStatus> = {
                    'PENDING': 'IN_PROGRESS',
                    'IN_PROGRESS': 'DONE',
                    'DONE': 'PENDING'
                };
                return { ...t, status: nextStatus[t.status] };
            });
            // Recalculate progress
            const doneCount = updatedTasks.filter(t => t.status === 'DONE').length;
            const newProgress = Math.round((doneCount / updatedTasks.length) * 100);
            return { ...phase, tasks: updatedTasks, progress: newProgress };
        }));
    };

    return (
        <div className="h-full bg-slate-950 p-6 lg:p-8 overflow-y-auto text-slate-200 font-mono">
            
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800 flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="material-icons-round text-green-500">terminal</span>
                        Developer Console
                    </h1>
                    <p className="text-slate-500 text-xs mt-1">Build on top of the TFI Timeline Platform</p>
                </div>
                <div className="flex gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    {['CONSOLE', 'ARCHITECTURE', 'ROADMAP', 'PERFORMANCE'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-4 py-2 rounded text-xs font-bold transition-all ${activeTab === tab ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {tab.charAt(0) + tab.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'CONSOLE' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* API Keys */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-200">API Credentials</h3>
                                <button onClick={generateKey} className="text-green-400 hover:text-green-300 text-xs font-bold flex items-center gap-1">
                                    <span className="material-icons-round text-sm">add</span> Generate Key
                                </button>
                            </div>
                            
                            <div className="space-y-3">
                                {keys.map((k, i) => (
                                    <div key={i} className="bg-slate-950 rounded border border-slate-800 p-3 flex justify-between items-center group">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-slate-300">{k.name}</span>
                                                <span className={`text-[9px] px-1.5 rounded ${k.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{k.status}</span>
                                            </div>
                                            <div className="text-xs text-slate-500 font-mono mt-1">{k.key}</div>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-slate-500">
                                            <span>Used: {k.lastUsed ? k.lastUsed.toLocaleDateString() : 'Never'}</span>
                                            <button className="opacity-0 group-hover:opacity-100 text-red-500 hover:underline">Revoke</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Webhooks Simulator */}
                        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                            <h3 className="font-bold text-slate-200 mb-4">Webhook Simulator</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-500 uppercase font-bold">Event Type</label>
                                    <select className="w-full bg-slate-950 border border-slate-700 text-slate-300 text-xs p-2 rounded focus:outline-none">
                                        <option>movie.release_date_changed</option>
                                        <option>ticket.sales_opened</option>
                                        <option>news.trending</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-500 uppercase font-bold">Target URL</label>
                                    <input type="text" placeholder="https://your-api.com/webhook" className="w-full bg-slate-950 border border-slate-700 text-slate-300 text-xs p-2 rounded focus:outline-none" />
                                </div>
                            </div>
                            <button 
                                onClick={() => addLog('[SUCCESS] Test webhook sent to endpoint (200 OK)')}
                                className="mt-4 bg-slate-800 hover:bg-slate-700 text-slate-300 w-full py-2 rounded text-xs font-bold transition-colors"
                            >
                                Send Test Payload
                            </button>
                        </div>
                    </div>

                    {/* Sidebar Utilities */}
                    <div className="space-y-6">
                        
                        {/* Data Tools */}
                        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                            <h3 className="font-bold text-slate-200 mb-4">Data Tools</h3>
                            <div className="space-y-3">
                                <button onClick={handleExport} className="w-full flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded hover:border-blue-500/50 transition-colors group">
                                    <div className="text-left">
                                        <div className="text-xs font-bold text-slate-300 group-hover:text-blue-400">Export JSON</div>
                                        <div className="text-[10px] text-slate-500">All events & prefs</div>
                                    </div>
                                    <span className="material-icons-round text-slate-500 group-hover:text-blue-400">download</span>
                                </button>
                                <button className="w-full flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded hover:border-purple-500/50 transition-colors group">
                                    <div className="text-left">
                                        <div className="text-xs font-bold text-slate-300 group-hover:text-purple-400">Import Calendar</div>
                                        <div className="text-[10px] text-slate-500">.ics or .csv</div>
                                    </div>
                                    <span className="material-icons-round text-slate-500 group-hover:text-purple-400">upload</span>
                                </button>
                            </div>
                        </div>

                        {/* Console Logs */}
                        <div className="bg-black rounded-xl border border-slate-800 p-4 h-64 overflow-hidden flex flex-col">
                            <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">System Logs</h3>
                            <div className="flex-grow overflow-y-auto font-mono text-[10px] space-y-1">
                                {logs.map((log, i) => (
                                    <div key={i} className={`${log.includes('WARN') ? 'text-yellow-500' : log.includes('SUCCESS') ? 'text-green-400' : 'text-slate-400'}`}>
                                        {log}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {activeTab === 'ARCHITECTURE' && (
                <div className="animate-fade-in space-y-8">
                    {/* System Diagram Visual */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                        {/* Client Layer */}
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col gap-2">
                             <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Client Layer</div>
                             <div className="flex-grow flex flex-col justify-center gap-2">
                                 <div className="bg-blue-900/20 border border-blue-500/30 p-2 rounded text-blue-300 text-xs font-bold">React Native (Mobile)</div>
                                 <div className="bg-cyan-900/20 border border-cyan-500/30 p-2 rounded text-cyan-300 text-xs font-bold">React PWA (Web)</div>
                             </div>
                        </div>
                        
                        {/* Gateway */}
                        <div className="flex items-center justify-center">
                            <span className="material-icons-round text-slate-700 hidden md:block">arrow_forward</span>
                            <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-xl w-full mx-2 flex flex-col justify-center items-center h-full">
                                <span className="material-icons-round text-purple-400 mb-2">dns</span>
                                <div className="text-purple-300 font-bold text-sm">API Gateway</div>
                                <div className="text-[10px] text-purple-400/60">Kong / Nginx</div>
                            </div>
                            <span className="material-icons-round text-slate-700 hidden md:block">arrow_forward</span>
                        </div>

                        {/* Services */}
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col gap-2">
                             <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Microservices</div>
                             <div className="grid grid-cols-2 gap-2">
                                 <div className="bg-green-900/20 border border-green-500/30 p-2 rounded text-green-300 text-[10px] font-bold">User Service</div>
                                 <div className="bg-green-900/20 border border-green-500/30 p-2 rounded text-green-300 text-[10px] font-bold">Event Service</div>
                                 <div className="bg-yellow-900/20 border border-yellow-500/30 p-2 rounded text-yellow-300 text-[10px] font-bold">AI Service</div>
                                 <div className="bg-red-900/20 border border-red-500/30 p-2 rounded text-red-300 text-[10px] font-bold">Scraper</div>
                             </div>
                        </div>

                        {/* Data */}
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col gap-2">
                             <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Data Layer</div>
                             <div className="flex-grow flex flex-col justify-center gap-2">
                                 <div className="bg-slate-800 border border-slate-700 p-2 rounded text-slate-300 text-[10px] font-bold">PostgreSQL</div>
                                 <div className="bg-slate-800 border border-slate-700 p-2 rounded text-slate-300 text-[10px] font-bold">MongoDB</div>
                                 <div className="bg-slate-800 border border-slate-700 p-2 rounded text-slate-300 text-[10px] font-bold">Redis</div>
                             </div>
                        </div>
                    </div>

                    {/* Status Tables */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-bold text-white mb-4">Service Health</h3>
                            <div className="space-y-2">
                                {SERVICE_STATUS.map((s, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${s.status === 'OPERATIONAL' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-yellow-500 animate-pulse'}`}></div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-300">{s.name}</div>
                                                <div className="text-[10px] text-slate-500">Load: {s.load}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-[10px] font-bold px-2 py-0.5 rounded ${s.status === 'OPERATIONAL' ? 'bg-green-900/20 text-green-400' : 'bg-yellow-900/20 text-yellow-400'}`}>{s.status}</div>
                                            <div className="text-[10px] text-slate-600 mt-1">{s.uptime} uptime</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-white mb-4">Database Cluster</h3>
                             <div className="space-y-2">
                                {DATABASES.map((d, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <span className="material-icons-round text-slate-500 text-lg">storage</span>
                                            <div>
                                                <div className="text-xs font-bold text-slate-300">{d.name}</div>
                                                <div className="text-[10px] text-slate-500">{d.size} used</div>
                                            </div>
                                        </div>
                                        <div className="text-[10px] font-bold text-green-400 bg-green-900/20 px-2 py-0.5 rounded">
                                            {d.status}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 p-4 bg-blue-900/10 border border-blue-500/20 rounded-xl">
                                <h4 className="text-xs font-bold text-blue-400 mb-2">Tech Stack Overview</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['React Native', 'TypeScript', 'Node.js', 'Python', 'FastAPI', 'GraphQL', 'Docker', 'Kubernetes', 'AWS S3'].map(tech => (
                                        <span key={tech} className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-[10px] text-slate-400">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'ROADMAP' && (
                <div className="animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {roadmap.map(phase => (
                            <div key={phase.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col h-full relative overflow-hidden">
                                {phase.progress === 100 && (
                                    <div className="absolute top-2 right-2 text-green-500">
                                        <span className="material-icons-round text-lg">check_circle</span>
                                    </div>
                                )}
                                <h3 className="text-sm font-bold text-slate-100 mb-1">{phase.title}</h3>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-4">{phase.timeline}</p>
                                
                                <div className="mt-auto">
                                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                                        <span>Progress</span>
                                        <span>{phase.progress}%</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${phase.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                                            style={{ width: `${phase.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-8">
                        {roadmap.map(phase => (
                            <div key={phase.id}>
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    {phase.title}
                                    <span className="text-xs text-slate-500 font-normal border border-slate-700 px-2 py-0.5 rounded-full">{phase.timeline}</span>
                                </h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                    {phase.tasks.map(task => (
                                        <div 
                                            key={task.id} 
                                            onClick={() => toggleTaskStatus(phase.id, task.id)}
                                            className={`
                                                flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all select-none
                                                ${task.status === 'DONE' 
                                                    ? 'bg-green-900/10 border-green-500/30 opacity-75' 
                                                    : task.status === 'IN_PROGRESS' 
                                                        ? 'bg-blue-900/10 border-blue-500/30' 
                                                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'}
                                            `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`
                                                    w-5 h-5 rounded flex items-center justify-center border
                                                    ${task.status === 'DONE' ? 'bg-green-500 border-green-500' : 'border-slate-600'}
                                                `}>
                                                    {task.status === 'DONE' && <span className="material-icons-round text-white text-xs">check</span>}
                                                    {task.status === 'IN_PROGRESS' && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                                                </div>
                                                <span className={`text-sm ${task.status === 'DONE' ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                                                    <span className="font-mono text-slate-600 mr-2">{task.id}</span>
                                                    {task.title}
                                                </span>
                                            </div>
                                            <span className={`
                                                text-[9px] font-bold px-2 py-0.5 rounded uppercase
                                                ${task.status === 'DONE' ? 'bg-green-500/20 text-green-400' 
                                                : task.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-400' 
                                                : 'bg-slate-800 text-slate-500'}
                                            `}>
                                                {task.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {activeTab === 'PERFORMANCE' && (
                 <div className="animate-fade-in space-y-8">
                     {/* Summary Cards */}
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                         <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                             <div className="text-xs text-slate-500 uppercase font-bold mb-1">API Latency</div>
                             <div className="text-2xl font-bold text-green-500">45ms</div>
                             <div className="text-[10px] text-slate-500 mt-1">p99 avg</div>
                         </div>
                         <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                             <div className="text-xs text-slate-500 uppercase font-bold mb-1">Cache Hit Rate</div>
                             <div className="text-2xl font-bold text-blue-500">92%</div>
                             <div className="text-[10px] text-slate-500 mt-1">Redis Cluster</div>
                         </div>
                         <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                             <div className="text-xs text-slate-500 uppercase font-bold mb-1">Bundle Size</div>
                             <div className="text-2xl font-bold text-yellow-500">128KB</div>
                             <div className="text-[10px] text-slate-500 mt-1">Gzipped</div>
                         </div>
                         <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                             <div className="text-xs text-slate-500 uppercase font-bold mb-1">Offline Ready</div>
                             <div className="text-2xl font-bold text-purple-500">YES</div>
                             <div className="text-[10px] text-slate-500 mt-1">Service Worker Active</div>
                         </div>
                     </div>

                     {/* Main Metric Visualization */}
                     <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                         <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                             <span className="material-icons-round text-blue-500">speed</span>
                             Real-time Request Throughput
                         </h3>
                         <div className="h-40 flex items-end gap-1">
                             {Array.from({length: 40}).map((_, i) => {
                                 const height = Math.floor(Math.random() * 80) + 20;
                                 return (
                                     <div 
                                        key={i} 
                                        className="flex-1 bg-blue-500/20 hover:bg-blue-500 rounded-t transition-colors"
                                        style={{ height: `${height}%` }}
                                     ></div>
                                 )
                             })}
                         </div>
                         <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                             <span>-5m</span>
                             <span>Requests / sec</span>
                             <span>Now</span>
                         </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                             <h3 className="font-bold text-white mb-4">Optimization Checklist</h3>
                             <div className="space-y-3">
                                 {[
                                     { item: 'Code Splitting (React.lazy)', status: 'Active' },
                                     { item: 'Image Optimization (WebP)', status: 'Active' },
                                     { item: 'CDN Caching (Cloudflare)', status: 'Active' },
                                     { item: 'Database Indexing', status: 'Warning' },
                                     { item: 'Gzip Compression', status: 'Active' },
                                 ].map((opt, i) => (
                                     <div key={i} className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                                         <span className="text-slate-300">{opt.item}</span>
                                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${opt.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                             {opt.status}
                                         </span>
                                     </div>
                                 ))}
                             </div>
                         </div>

                         <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                             <h3 className="font-bold text-white mb-4">Slow Queries</h3>
                             <div className="font-mono text-[10px] text-slate-400 space-y-2">
                                 <div className="bg-slate-950 p-2 rounded border border-slate-800">
                                     SELECT * FROM events WHERE date > NOW() ORDER BY popularity DESC;
                                     <div className="text-red-400 mt-1">Duration: 240ms</div>
                                 </div>
                                 <div className="bg-slate-950 p-2 rounded border border-slate-800">
                                     SELECT * FROM users JOIN activity_logs ON users.id = activity_logs.user_id;
                                     <div className="text-yellow-400 mt-1">Duration: 180ms</div>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
            )}

        </div>
    );
};

export default DeveloperTools;
